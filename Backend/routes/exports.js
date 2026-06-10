const express = require('express');
const { body, validationResult } = require('express-validator');
const { supabaseAdmin } = require('../services/supabase');
const requireAuth = require('../middleware/auth');
const { exportLimiter } = require('../middleware/rateLimiter');
const { auditLog } = require('../middleware/audit');
const ExcelJS = require('exceljs');
// const puppeteer = require('puppeteer');
const PDFDocument = require('pdfkit');

const CALCULATORS = require('../calculators'); // barrel export below
const router = express.Router();
router.use(requireAuth, exportLimiter);

const DISCLAIMER = `Mutual Fund investments are subject to market risks. Read all scheme related documents carefully. 
Past performance is not indicative of future returns. This report is for planning purposes only and does not 
constitute investment advice. Radds Capital is an AMFI-Registered Mutual Fund Distributor (ARN-XXXXXX).`;

// Helper: fetch full profile
async function getFullProfile(userId) {
  const [profile, user, income, expenses, children, childExp, liabilities, investments, insurance, goals] = await Promise.all([
    supabaseAdmin.from('financial_profiles').select('*').eq('user_id', userId).single(),
    supabaseAdmin.from('user_profiles').select('display_name, email, phone').eq('id', userId).single(),
    supabaseAdmin.from('income_sources').select('*').eq('user_id', userId),
    supabaseAdmin.from('expense_items').select('*').eq('user_id', userId),
    supabaseAdmin.from('children').select('*').eq('user_id', userId),
    supabaseAdmin.from('child_expenses').select('*').eq('user_id', userId),
    supabaseAdmin.from('liabilities').select('*').eq('user_id', userId),
    supabaseAdmin.from('investments').select('*').eq('user_id', userId),
    supabaseAdmin.from('insurance_policies').select('*').eq('user_id', userId),
    supabaseAdmin.from('financial_goals').select('*').eq('user_id', userId),
  ]);
  return {
    user: user.data,
    profile: profile.data,
    income: income.data || [],
    expenses: expenses.data || [],
    children: children.data || [],
    child_expenses: childExp.data || [],
    liabilities: liabilities.data || [],
    investments: investments.data || [],
    insurance: insurance.data || [],
    goals: goals.data || [],
  };
}

// Helper: format INR
function inr(n) {
  if (!n) return '₹0';
  return '₹' + Number(n).toLocaleString('en-IN');
}

// ============================================================
// POST /api/exports/xlsx
// ============================================================
router.post('/xlsx', [
  body('calculator_type').optional().isIn(['sip','swp','lumpsum','step-up-sip','cost-of-delay-sip','one-time-investment']),
  body('inputs').optional().isObject(),
], auditLog({ action: 'export.xlsx', entityType: 'export_reports' }), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { calculator_type, inputs } = req.body;
  const data = await getFullProfile(req.userId);

  const wb = new ExcelJS.Workbook();
  wb.creator = 'Radds Capital';
  wb.created = new Date();

  // ── Sheet 1: Profile Summary ──────────────────────────────
  const profileSheet = wb.addWorksheet('Financial Profile');
  profileSheet.columns = [
    { header: 'Field', key: 'field', width: 30 },
    { header: 'Value', key: 'value', width: 40 },
  ];
  profileSheet.addRow({ field: 'Name', value: data.user?.display_name || '' });
  profileSheet.addRow({ field: 'Email', value: data.user?.email || '' });
  profileSheet.addRow({ field: 'Phone', value: data.user?.phone || '' });
  profileSheet.addRow({ field: 'Age', value: data.profile?.age || '' });
  profileSheet.addRow({ field: 'Risk Preference', value: data.profile?.risk_preference || '' });
  profileSheet.addRow({});

  // Income
  profileSheet.addRow({ field: '── INCOME SOURCES ──', value: '' });
  const totalIncome = data.income.reduce((s, r) => s + Number(r.amount), 0);
  data.income.forEach(r => profileSheet.addRow({ field: r.label, value: inr(r.amount) + '/mo' }));
  profileSheet.addRow({ field: 'Total Monthly Income', value: inr(totalIncome) });
  profileSheet.addRow({});

  // Expenses
  profileSheet.addRow({ field: '── EXPENSES ──', value: '' });
  const totalExpense = data.expenses.reduce((s, r) => s + Number(r.amount), 0);
  data.expenses.forEach(r => profileSheet.addRow({ field: r.label, value: inr(r.amount) + '/mo' }));
  profileSheet.addRow({ field: 'Total Monthly Expenses', value: inr(totalExpense) });
  profileSheet.addRow({ field: 'Net Monthly Surplus', value: inr(totalIncome - totalExpense) });
  profileSheet.addRow({});

  // Liabilities
  if (data.liabilities.length) {
    profileSheet.addRow({ field: '── LIABILITIES ──', value: '' });
    data.liabilities.forEach(r => profileSheet.addRow({ field: r.label, value: `EMI: ${inr(r.emi)}/mo | Outstanding: ${inr(r.outstanding_amount)}` }));
    profileSheet.addRow({});
  }

  // Investments
  if (data.investments.length) {
    profileSheet.addRow({ field: '── EXISTING INVESTMENTS ──', value: '' });
    data.investments.forEach(r => profileSheet.addRow({ field: r.label, value: `Current Value: ${inr(r.current_value)}` }));
    profileSheet.addRow({});
  }

  // Goals
  if (data.goals.length) {
    profileSheet.addRow({ field: '── FINANCIAL GOALS ──', value: '' });
    data.goals.forEach(r => profileSheet.addRow({ field: r.goal_name, value: `Target: ${inr(r.target_amount)} by ${r.target_year}` }));
    profileSheet.addRow({});
  }

  // Disclaimer
  profileSheet.addRow({ field: 'Disclaimer', value: DISCLAIMER });
  profileSheet.addRow({ field: 'Generated At', value: new Date().toLocaleString('en-IN') });

  // ── Sheet 2: Calculator Results (if provided) ─────────────
  if (calculator_type && inputs) {
    const fn = CALCULATORS[calculator_type];
    if (fn) {
      const result = fn(inputs);
      const calcSheet = wb.addWorksheet('Calculator Results');

      // Inputs
      calcSheet.addRow(['Calculator', calculator_type.toUpperCase()]);
      calcSheet.addRow(['']);
      calcSheet.addRow(['── INPUTS ──']);
      Object.entries(inputs).forEach(([k, v]) => calcSheet.addRow([k, v]));
      calcSheet.addRow(['']);

      // Summary
      calcSheet.addRow(['── SUMMARY ──']);
      Object.entries(result.summary).forEach(([k, v]) => calcSheet.addRow([k.replace(/_/g, ' '), inr(v)]));
      calcSheet.addRow(['']);

      // Year-wise table
      if (result.yearly_table.length) {
        calcSheet.addRow(['── YEAR-WISE PROJECTION ──']);
        const headers = Object.keys(result.yearly_table[0]);
        calcSheet.addRow(headers.map(h => h.replace(/_/g, ' ').toUpperCase()));
        result.yearly_table.forEach(row => {
          calcSheet.addRow(headers.map(h => typeof row[h] === 'number' && h !== 'year' ? inr(row[h]) : row[h]));
        });
      }

      calcSheet.addRow(['']);
      calcSheet.addRow(['Disclaimer', DISCLAIMER]);
    }
  }

  // Stream to response
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=radds_report_${Date.now()}.xlsx`);

  await wb.xlsx.write(res);

  // Log export
  await supabaseAdmin.from('export_reports').insert({
    user_id: req.userId,
    export_type: 'xlsx',
    calculator_type: calculator_type || null,
  });

  res.end();
});

// ============================================================
// POST /api/exports/pdf
// Body: { calculator_type?, inputs?, chart_image_base64? }
// ============================================================

// npm install pdfkit

router.post('/pdf', requireAuth, exportLimiter, async (req, res) => {
  const { calculator_type, inputs } = req.body;
  const data = await getFullProfile(req.userId);

  let calcResult = null;
  if (calculator_type && inputs) {
    const fn = CALCULATORS[calculator_type];
    if (fn) calcResult = fn(inputs);
  }

  const doc = new PDFDocument({ margin: 50, size: 'A4' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=radds_report_${Date.now()}.pdf`);
  doc.pipe(res);

  // Header
  doc.rect(0, 0, 595, 60).fill('#22568f');
  doc.fillColor('white').fontSize(16).font('Helvetica-Bold')
    .text('Radds Capital', 50, 15);
  doc.fontSize(9).font('Helvetica')
    .text('AMFI-Registered Mutual Fund Distributor | ARN-XXXXXX', 50, 35);
  doc.fontSize(9).text(`Generated: ${new Date().toLocaleString('en-IN')}`, 400, 35, { align: 'right' });

  doc.fillColor('#1a1a2e').moveDown(3);

  // Title
  doc.fontSize(18).font('Helvetica-Bold').text('Financial Profile Report', 50, 80);
  doc.fontSize(11).font('Helvetica').fillColor('#666')
    .text(`${data.user?.display_name || ''} | ${data.user?.email || ''}`, 50, 105);

  doc.moveDown(2);

  // Helper functions
  function sectionHeader(title) {
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#22568f')
      .text(title);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#e2ebf5').stroke();
    doc.moveDown(0.5);
  }

  function row(label, value) {
    doc.fontSize(10).font('Helvetica').fillColor('#333')
      .text(label, 50, doc.y, { continued: true, width: 250 })
      .font('Helvetica-Bold').text(value, { align: 'right' });
    doc.moveDown(0.3);
  }

  // Personal
  sectionHeader('Personal Details');
  row('Age', String(data.profile?.age || '-'));
  row('Risk Preference', data.profile?.risk_preference || '-');
  doc.moveDown(0.5);

  // Income
  const totalIncome = data.income.reduce((s, r) => s + Number(r.amount), 0);
  sectionHeader('Income Sources');
  data.income.forEach(r => row(r.label, inr(r.amount) + '/mo'));
  row('Total Monthly Income', inr(totalIncome));
  doc.moveDown(0.5);

  // Expenses
  const totalExpense = data.expenses.reduce((s, r) => s + Number(r.amount), 0);
  sectionHeader('Expenses');
  data.expenses.forEach(r => row(r.label, inr(r.amount) + '/mo'));
  row('Total Monthly Expenses', inr(totalExpense));
  row('Net Monthly Surplus', inr(totalIncome - totalExpense));
  doc.moveDown(0.5);

  // Liabilities
  if (data.liabilities.length) {
    sectionHeader('Liabilities');
    data.liabilities.forEach(r => row(r.label, `EMI ${inr(r.emi)}/mo`));
    doc.moveDown(0.5);
  }

  // Investments
  if (data.investments.length) {
    sectionHeader('Existing Investments');
    data.investments.forEach(r => row(r.label, inr(r.current_value)));
    doc.moveDown(0.5);
  }

  // Goals
  if (data.goals.length) {
    sectionHeader('Financial Goals');
    data.goals.forEach(r => row(`${r.goal_name} (${r.target_year})`, inr(r.target_amount)));
    doc.moveDown(0.5);
  }

  // Calculator results
  if (calcResult) {
    sectionHeader(`Calculator: ${calculator_type?.toUpperCase()}`);
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#333').text('Inputs:');
    doc.moveDown(0.2);
    Object.entries(inputs).forEach(([k, v]) => row(k.replace(/_/g, ' '), String(v)));
    doc.moveDown(0.3);
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#333').text('Results:');
    doc.moveDown(0.2);
    Object.entries(calcResult.summary).forEach(([k, v]) => row(k.replace(/_/g, ' '), inr(v)));

    // Year-wise table (first 10 rows to avoid overflow)
    if (calcResult.yearly_table.length) {
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#333').text('Year-wise Projection (first 10 years):');
      doc.moveDown(0.3);
      const preview = calcResult.yearly_table.slice(0, 10);
      const headers = Object.keys(preview[0]);
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#22568f')
        .text(headers.map(h => h.replace(/_/g, ' ').toUpperCase()).join('   '));
      doc.moveDown(0.2);
      preview.forEach(r => {
        doc.fontSize(9).font('Helvetica').fillColor('#333')
          .text(headers.map(h => h === 'year' ? r[h] : inr(r[h])).join('   '));
        doc.moveDown(0.15);
      });
    }
  }

  // Disclaimer
  doc.moveDown(1);
  doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#eee').stroke();
  doc.moveDown(0.5);
  doc.fontSize(8).font('Helvetica').fillColor('#999').text(DISCLAIMER, 50, doc.y, { width: 495 });

  doc.end();

  await supabaseAdmin.from('export_reports').insert({
    user_id: req.userId,
    export_type: 'pdf',
    calculator_type: calculator_type || null,
  });
});

// router.post('/pdf', [
//   body('calculator_type').optional().isIn(['sip','swp','lumpsum','step-up-sip','cost-of-delay-sip','one-time-investment']),
//   body('inputs').optional().isObject(),
//   body('chart_image_base64').optional().isString(),
// ], auditLog({ action: 'export.pdf', entityType: 'export_reports' }), async (req, res) => {
//   const { calculator_type, inputs, chart_image_base64 } = req.body;
//   const data = await getFullProfile(req.userId);

//   let calcResult = null;
//   if (calculator_type && inputs) {
//     const fn = CALCULATORS[calculator_type];
//     if (fn) calcResult = fn(inputs);
//   }

//   // Validate chart image if provided
//   let chartImg = null;
//   if (chart_image_base64) {
//     if (chart_image_base64.length > 2 * 1024 * 1024) {
//       return res.status(400).json({ error: 'Chart image too large' });
//     }
//     if (!chart_image_base64.startsWith('data:image/png;base64,') && !chart_image_base64.startsWith('data:image/jpeg;base64,')) {
//       return res.status(400).json({ error: 'Invalid chart image format' });
//     }
//     chartImg = chart_image_base64;
//   }

//   const totalIncome = data.income.reduce((s, r) => s + Number(r.amount), 0);
//   const totalExpense = data.expenses.reduce((s, r) => s + Number(r.amount), 0);

//   const html = `<!DOCTYPE html>
// <html>
// <head>
// <meta charset="UTF-8">
// <style>
//   * { margin: 0; padding: 0; box-sizing: border-box; }
//   body { font-family: Arial, sans-serif; font-size: 12px; color: #1a1a2e; padding: 32px; }
//   h1 { font-size: 20px; color: #22568f; margin-bottom: 4px; }
//   h2 { font-size: 14px; color: #22568f; margin: 20px 0 8px; border-bottom: 1px solid #e2ebf5; padding-bottom: 4px; }
//   .meta { color: #666; font-size: 10px; margin-bottom: 20px; }
//   table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
//   th { background: #22568f; color: #fff; padding: 6px 8px; text-align: left; font-size: 11px; }
//   td { padding: 5px 8px; border-bottom: 1px solid #f0f0f0; font-size: 11px; }
//   tr:nth-child(even) td { background: #f8fafc; }
//   .summary-box { background: #f4f8fc; border: 1px solid #e2ebf5; border-radius: 6px; padding: 12px; margin-bottom: 12px; }
//   .summary-row { display: flex; justify-content: space-between; padding: 4px 0; }
//   .disclaimer { font-size: 9px; color: #999; border-top: 1px solid #eee; margin-top: 24px; padding-top: 12px; line-height: 1.5; }
//   .header-bar { background: #22568f; color: white; padding: 8px 16px; margin: -32px -32px 24px; display: flex; justify-content: space-between; align-items: center; }
//   .ardn-tag { font-size: 10px; opacity: 0.7; }
//   img.chart { max-width: 100%; height: auto; margin: 12px 0; border-radius: 6px; }
// </style>
// </head>
// <body>
// <div class="header-bar">
//   <div>
//     <div style="font-size:16px;font-weight:bold;">Radds Capital</div>
//     <div class="ardn-tag">AMFI-Registered Mutual Fund Distributor | ARN-XXXXXX</div>
//   </div>
//   <div style="font-size:10px;opacity:0.7;">Generated: ${new Date().toLocaleString('en-IN')}</div>
// </div>

// <h1>Financial Profile Report</h1>
// <p class="meta">Prepared for: ${data.user?.display_name || ''} | ${data.user?.email || ''}</p>

// <h2>Personal Details</h2>
// <div class="summary-box">
//   <div class="summary-row"><span>Name</span><span>${data.user?.display_name || '-'}</span></div>
//   <div class="summary-row"><span>Age</span><span>${data.profile?.age || '-'}</span></div>
//   <div class="summary-row"><span>Risk Preference</span><span>${data.profile?.risk_preference || '-'}</span></div>
// </div>

// <h2>Income Summary</h2>
// <table>
//   <tr><th>Source</th><th>Type</th><th>Monthly Amount</th></tr>
//   ${data.income.map(r => `<tr><td>${r.label}</td><td>${r.source_type}</td><td>${inr(r.amount)}</td></tr>`).join('')}
//   <tr><td colspan="2"><strong>Total Monthly Income</strong></td><td><strong>${inr(totalIncome)}</strong></td></tr>
// </table>

// <h2>Expense Summary</h2>
// <table>
//   <tr><th>Expense</th><th>Category</th><th>Monthly Amount</th></tr>
//   ${data.expenses.map(r => `<tr><td>${r.label}</td><td>${r.category}</td><td>${inr(r.amount)}</td></tr>`).join('')}
//   <tr><td colspan="2"><strong>Total Monthly Expenses</strong></td><td><strong>${inr(totalExpense)}</strong></td></tr>
//   <tr><td colspan="2"><strong>Net Monthly Surplus</strong></td><td><strong>${inr(totalIncome - totalExpense)}</strong></td></tr>
// </table>

// ${data.liabilities.length ? `
// <h2>Liabilities</h2>
// <table>
//   <tr><th>Loan</th><th>Type</th><th>EMI</th><th>Outstanding</th></tr>
//   ${data.liabilities.map(r => `<tr><td>${r.label}</td><td>${r.loan_type}</td><td>${inr(r.emi)}/mo</td><td>${inr(r.outstanding_amount)}</td></tr>`).join('')}
// </table>` : ''}

// ${data.investments.length ? `
// <h2>Existing Investments</h2>
// <table>
//   <tr><th>Investment</th><th>Type</th><th>Current Value</th><th>Monthly Contribution</th></tr>
//   ${data.investments.map(r => `<tr><td>${r.label}</td><td>${r.investment_type}</td><td>${inr(r.current_value)}</td><td>${inr(r.monthly_contribution)}</td></tr>`).join('')}
// </table>` : ''}

// ${data.goals.length ? `
// <h2>Financial Goals</h2>
// <table>
//   <tr><th>Goal</th><th>Target Amount</th><th>Target Year</th><th>Priority</th></tr>
//   ${data.goals.map(r => `<tr><td>${r.goal_name}</td><td>${inr(r.target_amount)}</td><td>${r.target_year}</td><td>${r.priority}</td></tr>`).join('')}
// </table>` : ''}

// ${calcResult ? `
// <h2>Calculator: ${calculator_type?.toUpperCase()}</h2>
// <div class="summary-box">
//   ${Object.entries(calcResult.summary).map(([k, v]) => `<div class="summary-row"><span>${k.replace(/_/g, ' ')}</span><span><strong>${inr(v)}</strong></span></div>`).join('')}
// </div>
// ${chartImg ? `<img class="chart" src="${chartImg}" alt="Calculator Chart" />` : ''}
// ${calcResult.yearly_table.length ? `
// <h2>Year-wise Projection</h2>
// <table>
//   <tr>${Object.keys(calcResult.yearly_table[0]).map(h => `<th>${h.replace(/_/g, ' ').toUpperCase()}</th>`).join('')}</tr>
//   ${calcResult.yearly_table.map(row => `<tr>${Object.entries(row).map(([k, v]) => `<td>${k === 'year' ? v : inr(v)}</td>`).join('')}</tr>`).join('')}
// </table>` : ''}` : ''}

// <div class="disclaimer">
//   <strong>Disclaimer:</strong> ${DISCLAIMER}
// </div>
// </body>
// </html>`;

//   let browser;
//   try {
//     browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
//     const page = await browser.newPage();
//     await page.setContent(html, { waitUntil: 'networkidle0' });
//     const pdf = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '0', bottom: '20mm', left: '0', right: '0' } });
//     await browser.close();

//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename=radds_report_${Date.now()}.pdf`);
//     res.send(pdf);

//     await supabaseAdmin.from('export_reports').insert({
//       user_id: req.userId,
//       export_type: 'pdf',
//       calculator_type: calculator_type || null,
//     });
//   } catch (err) {
//     if (browser) await browser.close();
//     console.error('PDF generation error:', err);
//     res.status(500).json({ error: 'PDF generation failed' });
//   }
// });

module.exports = router;