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

  const data = await getFullProfile(req.userId);
  const p = data.profile || {};
  const userName = data.user?.display_name || 'Client';
  const planDate = p.date_of_plan ? new Date(p.date_of_plan).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');

  const wb = new ExcelJS.Workbook();
  wb.creator = 'Radds Capital';
  wb.created = new Date();

  // ── Helper styles ──────────────────────────────────────────────────
  const BLUE = 'FF22568F';
  const WHITE = 'FFFFFFFF';
  const LIGHT = 'FFEAF2FF';
  const GREY = 'FFF4F8FC';

  function headerStyle(ws, row, cols) {
    for (let c = 1; c <= cols; c++) {
      const cell = ws.getCell(row, c);
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BLUE } };
      cell.font = { color: { argb: WHITE }, bold: true, size: 10 };
    }
  }

  function sectionLabel(ws, text) {
    const r = ws.addRow([text]);
    r.getCell(1).font = { bold: true, color: { argb: BLUE }, size: 10 };
    r.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LIGHT } };
    ws.addRow([]);
  }

  function logoHeader(ws, title) {
    ws.addRow(['Radds Capital', '', title]);
    ws.addRow(['AMFI-Registered Mutual Fund Distributor', '', `Client: ${userName}`]);
    ws.addRow(['', '', `Date: ${planDate}`]);
    ws.addRow([]);
    const titleRow = ws.getRow(1);
    titleRow.getCell(1).font = { bold: true, size: 14, color: { argb: BLUE } };
    titleRow.getCell(3).font = { bold: true, size: 12 };
  }

  // ── Totals ─────────────────────────────────────────────────────────
  const totalIncome = data.income.reduce((s, r) => s + Number(r.amount || 0), 0);
  const totalExpenses = data.expenses.reduce((s, r) => s + Number(r.amount || 0), 0);
  const balance = totalIncome - totalExpenses;

  const getExp = (key) => Number(data.expenses.find(e => e.key === key)?.amount || 0);
  const getInc = (type, secondary) => {
    const src = data.income.find(i => i.source_type === type && (secondary === undefined || i.is_secondary === secondary));
    return Number(src?.amount || 0);
  };

  const financialAssets = (data.investments || []).filter(i => !i.asset_class || i.asset_class === 'financial');
  const physicalAssets = (data.investments || []).filter(i => i.asset_class === 'physical');
  const totalFinancial = financialAssets.reduce((s, i) => s + Number(i.current_value || 0), 0);
  const totalPhysical = physicalAssets.reduce((s, i) => s + Number(i.current_value || 0), 0);
  const totalLiab = data.liabilities.reduce((s, l) => s + Number(l.outstanding_amount || 0), 0);

  // ── Sheet 1: Financial Planning ────────────────────────────────────
  const ws1 = wb.addWorksheet('Financial Planning');
  ws1.columns = [{ width: 22 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 }];
  logoHeader(ws1, 'Financial Planning');

  // Month headers
  const now = new Date();
  const months = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    months.push(d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }));
  }
  ws1.addRow(['', 'Monthly', ...months, 'Annual Total']);
  headerStyle(ws1, ws1.rowCount, 15);
  ws1.addRow([]);

  // Income section
  sectionLabel(ws1, 'INCOME');
  const salary = getInc('salary', false);
  const salary2 = getInc('salary', true);
  const otherInc = getInc('other', false);
  [
    ['Salary', salary],
    ['Salary - 2', salary2],
    ['Other Income', otherInc],
    ['Total Income', totalIncome],
  ].forEach(([label, val]) => {
    const row = ws1.addRow([label, val, ...Array(12).fill(val), val * 12]);
    if (label === 'Total Income') row.font = { bold: true };
    row.getCell(2).numFmt = '₹#,##0';
    for (let c = 3; c <= 15; c++) row.getCell(c).numFmt = '₹#,##0';
  });

  ws1.addRow([]);
  sectionLabel(ws1, 'EXPENSES');
  const expRows = [
    ['House Hold Exp', getExp('householdExp')],
    ['Rent', getExp('rent')],
    ['EMI', getExp('emi')],
    ['Health Insurance', getExp('healthInsurance')],
    ['Insurance', getExp('insurance')],
    ['Bills', getExp('bills')],
    ['School Fees', getExp('schoolFees')],
    ['Fuel', getExp('fuel')],
    ['Personal', getExp('personal')],
    ['Existing SIP', getExp('existingSip')],
    ['Add Expenses', getExp('addExpenses')],
    ['Total Expenses', totalExpenses],
    ['Balance', balance],
  ];
  expRows.forEach(([label, val]) => {
    const row = ws1.addRow([label, val, ...Array(12).fill(val), val * 12]);
    if (label === 'Total Expenses' || label === 'Balance') row.font = { bold: true };
    row.getCell(2).numFmt = '₹#,##0';
    for (let c = 3; c <= 15; c++) row.getCell(c).numFmt = '₹#,##0';
  });

  ws1.addRow([]);
  ws1.addRow(['Income - Expenses = Savings (Old approach)']);
  ws1.addRow(['Income - Investments = Expenses (Radds approach)']);

  // ── Sheet 2: Investment Planning ───────────────────────────────────
  const ws2 = wb.addWorksheet('Investment Planning');
  ws2.columns = [{ width: 20 }, { width: 14 }, { width: 6 }, { width: 10 }, { width: 10 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 }];
  logoHeader(ws2, 'Investment Planning');

  const sipAmt = Number(p.sip_amount || 0);
  const sipRate = Number(p.sip_growth_rate || 0.12);
  const sipStartAge = Number(p.sip_start_age || 22);
  const oneTime = Number(p.one_time_invest || 0);
  const swpWithd = Number(p.swp_withdrawal || 0);
  const swpCorpus = Number(p.swp_corpus || 0);
  const swpRate = Number(p.swp_growth_rate || 0.12);

  ws2.addRow([]);
  ws2.addRow(['SIP Amount (Monthly)', inr(sipAmt)]);
  ws2.addRow(['Growth Rate', `${(sipRate * 100).toFixed(1)}% p.a.`]);
  ws2.addRow(['Start Age', sipStartAge]);
  ws2.addRow(['One Time Investment', inr(oneTime)]);
  ws2.addRow(['SWP Monthly Withdrawal', inr(swpWithd)]);
  ws2.addRow(['SWP Corpus', inr(swpCorpus)]);
  ws2.addRow([]);

  // SIP yearly projection — 20 years
  ws2.addRow(['SIP Projection (20 Years)']);
  ws2.addRow(['Year', 'Age', 'Opening', 'Annual SIP Added', 'Growth', 'Closing']);
  headerStyle(ws2, ws2.rowCount, 6);
  let sipOpen = 0;
  for (let yr = 1; yr <= 20; yr++) {
    const add = sipAmt * 12;
    const growth = (sipOpen + add) * sipRate;
    const close = sipOpen + add + growth;
    const row = ws2.addRow([yr, sipStartAge + yr - 1, sipOpen, add, growth, close]);
    for (let c = 3; c <= 6; c++) row.getCell(c).numFmt = '₹#,##0';
    sipOpen = close;
  }

  ws2.addRow([]);
  ws2.addRow(['One-Time Investment Projection (20 Years)']);
  ws2.addRow(['Year', '', 'Opening', '', 'Growth (12%)', 'Closing']);
  headerStyle(ws2, ws2.rowCount, 6);
  let otOpen = oneTime;
  for (let yr = 1; yr <= 20; yr++) {
    const growth = otOpen * 0.12;
    const close = otOpen + growth;
    const row = ws2.addRow([yr, '', otOpen, '', growth, close]);
    for (let c = 3; c <= 6; c++) row.getCell(c).numFmt = '₹#,##0';
    otOpen = close;
  }

  ws2.addRow([]);
  ws2.addRow(['SWP Projection']);
  ws2.addRow(['Year', '', 'Opening', 'Withdrawal', 'Growth', 'Closing']);
  headerStyle(ws2, ws2.rowCount, 6);
  let swpOpen = swpCorpus;
  for (let yr = 1; yr <= 20 && swpOpen > 0; yr++) {
    const withdrawal = swpWithd * 12;
    const growth = (swpOpen - withdrawal) * swpRate;
    const close = Math.max(0, swpOpen - withdrawal + growth);
    const row = ws2.addRow([yr, '', swpOpen, withdrawal, growth, close]);
    for (let c = 3; c <= 6; c++) row.getCell(c).numFmt = '₹#,##0';
    swpOpen = close;
  }

  // ── Sheet 3: Home Loan Interest Free ──────────────────────────────
  const ws3 = wb.addWorksheet('Home Loan Interest Free');
  ws3.columns = [{ width: 20 }, { width: 14 }, { width: 6 }, { width: 10 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 }];
  logoHeader(ws3, 'Home Loan — Interest Free Plan');

  const hlAmt = Number(p.home_loan_amount || 0);
  const hlEmi = Number(p.home_loan_emi || 0);
  const hlTenure = Number(p.home_loan_tenure || 20);
  const hlRate = Number(p.home_loan_rate || 0.071);
  const totalInterest = (hlEmi * hlTenure * 12) - hlAmt;
  // SIP needed to offset total interest at 12% over tenure
  const n = hlTenure * 12;
  const r = 0.12 / 12;
  const sipNeeded = n > 0 && r > 0 ? Math.round((totalInterest * r) / (Math.pow(1 + r, n) - 1)) : 0;

  ws3.addRow([]);
  ws3.addRow(['Loan Amount', inr(hlAmt)]);
  ws3.addRow(['Monthly EMI', inr(hlEmi)]);
  ws3.addRow(['Tenure', `${hlTenure} Years`]);
  ws3.addRow(['Interest Rate', `${(hlRate * 100).toFixed(2)}% p.a.`]);
  ws3.addRow(['Total Interest Payable', inr(Math.max(0, totalInterest))]);
  ws3.addRow(['SIP Needed to Offset Interest', inr(sipNeeded)]);
  ws3.addRow(['SIP Growth Rate', '12% p.a.']);
  ws3.addRow([]);

  ws3.addRow(['Year', 'Opening Balance', 'Annual EMI', 'Interest Component', 'Principal Component', 'Closing Balance']);
  headerStyle(ws3, ws3.rowCount, 6);
  let loanBal = hlAmt;
  for (let yr = 1; yr <= hlTenure && loanBal > 0; yr++) {
    const annualEmi = hlEmi * 12;
    const interest = loanBal * hlRate;
    const principal = Math.min(loanBal, annualEmi - interest);
    loanBal = Math.max(0, loanBal - principal);
    const row = ws3.addRow([yr, loanBal + principal, annualEmi, interest, principal, loanBal]);
    for (let c = 2; c <= 6; c++) row.getCell(c).numFmt = '₹#,##0';
  }

  // ── Sheet 4: Net Worth ─────────────────────────────────────────────
  const ws4 = wb.addWorksheet('Networth');
  ws4.columns = [{ width: 28 }, { width: 30 }, { width: 18 }];
  logoHeader(ws4, 'Net Worth Statement');

  ws4.addRow([]);
  ws4.addRow(['NET WORTH STATEMENT']);
  ws4.lastRow.getCell(1).font = { bold: true, size: 13, color: { argb: BLUE } };
  ws4.addRow(['Client Name', userName]);
  ws4.addRow(['As on Date', planDate]);
  ws4.addRow([]);

  ws4.addRow(['ASSETS', 'Details', 'Value (₹)']);
  headerStyle(ws4, ws4.rowCount, 3);
  ws4.addRow(['Financial Assets']);
  ws4.lastRow.getCell(1).font = { bold: true };
  financialAssets.forEach(a => {
    const row = ws4.addRow(['  ' + (a.label || a.investment_type), '', Number(a.current_value || 0)]);
    row.getCell(3).numFmt = '₹#,##0';
  });
  const totFinRow = ws4.addRow(['Total Financial Assets', '', totalFinancial]);
  totFinRow.font = { bold: true };
  totFinRow.getCell(3).numFmt = '₹#,##0';
  ws4.addRow([]);

  ws4.addRow(['Physical Assets']);
  ws4.lastRow.getCell(1).font = { bold: true };
  physicalAssets.forEach(a => {
    const row = ws4.addRow(['  ' + (a.label || a.investment_type), '', Number(a.current_value || 0)]);
    row.getCell(3).numFmt = '₹#,##0';
  });
  const totPhysRow = ws4.addRow(['Total Physical Assets', '', totalPhysical]);
  totPhysRow.font = { bold: true };
  totPhysRow.getCell(3).numFmt = '₹#,##0';
  ws4.addRow([]);

  const totAssetsRow = ws4.addRow(['TOTAL ASSETS', '', totalFinancial + totalPhysical]);
  totAssetsRow.font = { bold: true, size: 11 };
  totAssetsRow.getCell(3).numFmt = '₹#,##0';
  ws4.addRow([]);

  ws4.addRow(['LIABILITIES', 'Details', 'Outstanding (₹)']);
  headerStyle(ws4, ws4.rowCount, 3);
  data.liabilities.forEach(l => {
    const row = ws4.addRow(['  ' + l.label, `${l.loan_type} | EMI: ${inr(l.emi)}/mo`, Number(l.outstanding_amount || 0)]);
    row.getCell(3).numFmt = '₹#,##0';
  });
  const totLiabRow = ws4.addRow(['Total Liabilities', '', totalLiab]);
  totLiabRow.font = { bold: true };
  totLiabRow.getCell(3).numFmt = '₹#,##0';
  ws4.addRow([]);

  const netWorth = (totalFinancial + totalPhysical) - totalLiab;
  const nwRow = ws4.addRow(['NET WORTH', '', netWorth]);
  nwRow.font = { bold: true, size: 12, color: { argb: netWorth >= 0 ? 'FF1a7f3c' : 'FFcc0000' } };
  nwRow.getCell(3).numFmt = '₹#,##0';

  // ── Sheet 5: Term Insurance ─────────────────────────────────────────
  const ws5 = wb.addWorksheet('Term Insurance');
  ws5.columns = [{ width: 8 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 }];
  logoHeader(ws5, 'Term Insurance Planning');

  const termPrem = Number(p.term_insurance_premium || 0);
  const termSip = Number(p.term_insurance_sip || 0);
  const termTenure = Number(p.term_insurance_tenure || 12);
  const termRate = Number(p.term_growth_rate || 0.12);

  ws5.addRow([]);
  ws5.addRow(['Annual Premium', inr(termPrem)]);
  ws5.addRow(['Monthly SIP Amount', inr(termSip)]);
  ws5.addRow(['Tenure (Years)', termTenure]);
  ws5.addRow(['Growth Rate', `${(termRate * 100).toFixed(1)}% p.a.`]);
  ws5.addRow([]);

  ws5.addRow(['Year', 'Annual Premium', 'Opening SIP Corpus', 'Annual SIP Added', 'Growth', 'Closing SIP Corpus']);
  headerStyle(ws5, ws5.rowCount, 6);
  let sipCorpus = 0;
  for (let yr = 1; yr <= termTenure; yr++) {
    const add = termSip * 12;
    const growth = (sipCorpus + add) * termRate;
    sipCorpus = sipCorpus + add + growth;
    const row = ws5.addRow([yr, termPrem, sipCorpus - add - growth, add, growth, sipCorpus]);
    for (let c = 2; c <= 6; c++) row.getCell(c).numFmt = '₹#,##0';
  }
  ws5.addRow([]);
  const finalRow = ws5.addRow(['Final SIP Corpus vs Total Premiums Paid']);
  finalRow.font = { bold: true };
  ws5.addRow(['Total Premiums Paid', inr(termPrem * termTenure)]);
  ws5.addRow(['Final SIP Corpus', inr(sipCorpus)]);
  ws5.addRow(['Net Benefit', inr(sipCorpus - termPrem * termTenure)]);

  // ── Disclaimer sheet row ───────────────────────────────────────────
  [ws1, ws2, ws3, ws4, ws5].forEach(ws => {
    ws.addRow([]);
    const dr = ws.addRow([DISCLAIMER]);
    dr.getCell(1).font = { color: { argb: 'FF999999' }, italic: true, size: 8 };
    dr.getCell(1).alignment = { wrapText: true };
  });

  // ── Stream ─────────────────────────────────────────────────────────
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=radds_${userName.replace(/\s+/g,'_')}_${Date.now()}.xlsx`);
  await wb.xlsx.write(res);

  await supabaseAdmin.from('export_reports').insert({
    user_id: req.userId, export_type: 'xlsx', calculator_type: null,
  }).catch(() => {});

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