const express = require('express');
const { body, validationResult } = require('express-validator');
const { supabaseAdmin } = require('../services/supabase');
const requireAuth = require('../middleware/auth');
const { exportLimiter } = require('../middleware/rateLimiter');
const { auditLog } = require('../middleware/audit');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const CALCULATORS = require('../calculators');

const router = express.Router();
router.use(requireAuth, exportLimiter);

const DISCLAIMER = `Mutual Fund investments are subject to market risks. Read all scheme related documents carefully. Past performance is not indicative of future returns. This report is for planning purposes only and does not constitute investment advice. Radds Capital is an AMFI-Registered Mutual Fund Distributor (ARN-XXXXXX).`;

// ── Fetch full profile from DB ─────────────────────────────────────────
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
    user: user.data || {},
    profile: profile.data || {},
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

function inr(n) {
  return '₹' + Number(n || 0).toLocaleString('en-IN');
}
function numFmt(cell) {
  cell.numFmt = '#,##0';
}

// ── Style helpers ──────────────────────────────────────────────────────
const C_BLUE  = 'FF22568F';
const C_WHITE = 'FFFFFFFF';
const C_LIGHT = 'FFEAF2FF';
const C_GREY  = 'FFF4F8FC';
const C_GREEN = 'FF1a7f3c';
const C_RED   = 'FFcc0000';

function styleHeader(cell) {
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C_BLUE } };
  cell.font = { color: { argb: C_WHITE }, bold: true, size: 10, name: 'Arial' };
  cell.alignment = { horizontal: 'center', vertical: 'middle' };
}

function styleSection(cell) {
  cell.font = { bold: true, color: { argb: C_BLUE }, size: 10, name: 'Arial' };
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C_LIGHT } };
}

function styleBold(cell) {
  cell.font = { bold: true, size: 10, name: 'Arial' };
}

function styleLogoRow(ws, userName, planDate, title) {
  const r1 = ws.addRow(['Radds Capital', '', title]);
  r1.getCell(1).font = { bold: true, size: 14, color: { argb: C_BLUE }, name: 'Arial' };
  r1.getCell(3).font = { bold: true, size: 12, name: 'Arial' };
  r1.getCell(3).alignment = { horizontal: 'right' };

  const r2 = ws.addRow(['AMFI-Registered Mutual Fund Distributor', '', `Client: ${userName}`]);
  r2.getCell(1).font = { italic: true, size: 9, color: { argb: '666666' }, name: 'Arial' };
  r2.getCell(3).font = { size: 10, name: 'Arial' };
  r2.getCell(3).alignment = { horizontal: 'right' };

  ws.addRow(['', '', `Date: ${planDate}`]).getCell(3).alignment = { horizontal: 'right' };
  ws.addRow([]); // blank spacer
}

function addDisclaimer(ws) {
  ws.addRow([]);
  const dr = ws.addRow([DISCLAIMER]);
  dr.getCell(1).font = { color: { argb: 'FF999999' }, italic: true, size: 8, name: 'Arial' };
  dr.getCell(1).alignment = { wrapText: true };
}

// ============================================================
// POST /api/exports/xlsx  — 5-sheet financial plan
// ============================================================
router.post('/xlsx', [
  body('calculator_type').optional().isIn(['sip','swp','lumpsum','step-up-sip','cost-of-delay-sip','one-time-investment']),
  body('inputs').optional().isObject(),
], auditLog({ action: 'export.xlsx', entityType: 'export_reports' }), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const data = await getFullProfile(req.userId);
    const p = data.profile || {};
    const userName = data.user?.display_name || 'Client';
    const planDate = p.date_of_plan
      ? new Date(p.date_of_plan).toLocaleDateString('en-IN')
      : new Date().toLocaleDateString('en-IN');

    const wb = new ExcelJS.Workbook();
    wb.creator = 'Radds Capital';
    wb.created = new Date();

    // ── Helpers ──
    const getExp = (key) => Number(data.expenses.find(e => e.key === key)?.amount || 0);
    const getInc = (type, secondary) => {
      const src = data.income.find(i =>
        i.source_type === type && (secondary === undefined || Boolean(i.is_secondary) === Boolean(secondary))
      );
      return Number(src?.amount || 0);
    };

    const salary     = getInc('salary', false);
    const salary2    = getInc('salary', true);
    const otherInc   = getInc('other');
    const totalIncome = salary + salary2 + otherInc;

    const expKeys = ['householdExp','rent','emi','healthInsurance','insurance','bills',
                     'schoolFees','fuel','personal','existingSip','addExpenses'];
    const expLabels = ['House Hold Exp','Rent','EMI','Health Insurance','Insurance','Bills',
                       'School Fees','Fuel','Personal','Existing SIP','Add Expenses'];
    const totalExpenses = expKeys.reduce((s, k) => s + getExp(k), 0);
    const balance = totalIncome - totalExpenses;

    const financialAssets = (data.investments || []).filter(i => !i.asset_class || i.asset_class === 'financial');
    const physicalAssets  = (data.investments || []).filter(i => i.asset_class === 'physical');
    const totalFinancial  = financialAssets.reduce((s, i) => s + Number(i.current_value || 0), 0);
    const totalPhysical   = physicalAssets.reduce((s, i)  => s + Number(i.current_value || 0), 0);
    const totalLiab       = data.liabilities.reduce((s, l) => s + Number(l.outstanding_amount || 0), 0);

    // ══════════════════════════════════════════════════════════
    // SHEET 1: Financial Planning
    // ══════════════════════════════════════════════════════════
    const ws1 = wb.addWorksheet('Financial Planning');
    const now = new Date();
    // Generate 12 monthly column headers from current month
    const planStart = p.date_of_plan ? new Date(p.date_of_plan) : now;
    const months = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(planStart.getFullYear(), planStart.getMonth() + i, 1);
      return d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
    });

    ws1.columns = [
      { width: 22 },
      ...Array(13).fill({ width: 12 }),
      { width: 14 },
    ];

    styleLogoRow(ws1, userName, planDate, 'Financial Planning');

    // Title row
    const fpTitle = ws1.addRow(['Financial Plan For', userName, ...months.map(() => ''), 'Total']);
    fpTitle.getCell(1).font = { bold: true, size: 11, name: 'Arial' };
    fpTitle.getCell(2).font = { bold: true, size: 11, color: { argb: C_BLUE }, name: 'Arial' };

    // Column headers
    const fpHead = ws1.addRow(['', 'Monthly', ...months, 'Annual Total']);
    for (let c = 1; c <= 15; c++) styleHeader(fpHead.getCell(c));
    ws1.addRow([]);

    // Income section
    const incSection = ws1.addRow(['INCOME']);
    styleSection(incSection.getCell(1));
    ws1.addRow([]);

    const incRows = [
      ['Salary',       salary],
      ['Salary - 2',   salary2],
      ['Other Income', otherInc],
    ];
    incRows.forEach(([label, val]) => {
      const r = ws1.addRow([label, val, ...Array(12).fill(val), val * 12]);
      numFmt(r.getCell(2));
      for (let c = 3; c <= 15; c++) numFmt(r.getCell(c));
    });
    const totIncRow = ws1.addRow(['Total- Income', totalIncome, ...Array(12).fill(totalIncome), totalIncome * 12]);
    styleBold(totIncRow.getCell(1)); styleBold(totIncRow.getCell(2));
    numFmt(totIncRow.getCell(2));
    for (let c = 3; c <= 15; c++) { numFmt(totIncRow.getCell(c)); styleBold(totIncRow.getCell(c)); }

    ws1.addRow([]);
    const expSection = ws1.addRow(['EXPENSES']);
    styleSection(expSection.getCell(1));
    ws1.addRow([]);

    expKeys.forEach((key, idx) => {
      const val = getExp(key);
      const r = ws1.addRow([expLabels[idx], val, ...Array(12).fill(val), val * 12]);
      numFmt(r.getCell(2));
      for (let c = 3; c <= 15; c++) numFmt(r.getCell(c));
    });

    const totExpRow = ws1.addRow(['Total', totalExpenses, ...Array(12).fill(totalExpenses), totalExpenses * 12]);
    styleBold(totExpRow.getCell(1)); styleBold(totExpRow.getCell(2));
    numFmt(totExpRow.getCell(2));
    for (let c = 3; c <= 15; c++) { numFmt(totExpRow.getCell(c)); styleBold(totExpRow.getCell(c)); }

    const balRow = ws1.addRow(['Balance', '', ...Array(12).fill(balance), balance * 12]);
    balRow.getCell(2).value = null; // monthly col blank like template
    styleBold(balRow.getCell(1));
    for (let c = 3; c <= 15; c++) {
      numFmt(balRow.getCell(c));
      balRow.getCell(c).font = { bold: true, color: { argb: balance >= 0 ? C_GREEN : C_RED }, name: 'Arial' };
    }

    ws1.addRow([]);
    ws1.addRow(['Income - Expenses = Saving (Old approach)']).getCell(1).font = { italic: true, size: 9, name: 'Arial' };
    ws1.addRow(['Income - Investment = Expenses (Radds approach)']).getCell(1).font = { bold: true, size: 9, color: { argb: C_BLUE }, name: 'Arial' };
    addDisclaimer(ws1);

    // ══════════════════════════════════════════════════════════
    // SHEET 2: Investment Planning
    // ══════════════════════════════════════════════════════════
    const ws2 = wb.addWorksheet('Investment Planning');
    ws2.columns = [
      { width: 20 }, { width: 14 }, { width: 8 },
      { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 },
      { width: 4 },
      { width: 8 }, { width: 14 }, { width: 14 }, { width: 14 },
      { width: 4 },
      { width: 8 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 },
    ];
    styleLogoRow(ws2, userName, planDate, 'Investment Planning');

    const sipAmt      = Number(p.sip_amount || 0);
    const sipRate     = Number(p.sip_growth_rate || 0.12);
    const sipStartAge = Number(p.sip_start_age || 22);
    const oneTime     = Number(p.one_time_invest || 0);
    const swpWithd    = Number(p.swp_withdrawal || 0);
    const swpCorpus   = Number(p.swp_corpus || 0);
    const swpRate     = Number(p.swp_growth_rate || 0.12);

    // Params row
    const ipParams = ws2.addRow([
      `Investment Plan for ${userName}`, '', '',
      'SIP Investment', '', '', '', '',
      '', 'One Time Investment', '', '', '',
      '', 'SWP', '', '', ''
    ]);
    ipParams.getCell(1).font = { bold: true, size: 11, color: { argb: C_BLUE }, name: 'Arial' };

    ws2.addRow(['Dated', planDate, '', 'YR', 'Age', 'Open', 'Add', 'Growth', 'Close', '',
               'YR', 'Open', 'Growth', 'Close', '',
               'Yr', 'Open', 'Withdrawal', 'Growth', 'Close']);
    // style that header row
    const ipHead = ws2.lastRow;
    [4,5,6,7,8,9, 11,12,13,14, 16,17,18,19,20].forEach(c => styleHeader(ipHead.getCell(c)));

    ws2.addRow(['SIP AMT',      inr(sipAmt)]);
    ws2.addRow(['Growth Rate',  `${(sipRate * 100).toFixed(1)}%`]);
    ws2.addRow(['One Time Invest', inr(oneTime)]);
    ws2.addRow(['Withdrawal',   inr(swpWithd)]);
    ws2.addRow([]);

    // Taxation note
    ws2.addRow(['Taxation:']);
    ws2.addRow(['Long Term Capital Gains (LTCG)', '1.25 lacs of profit Exempt']);
    ws2.addRow(['More than 365 days', 'Above 1.25 lacs 12.5%']);
    ws2.addRow(['Short Term Capital Gains (STCG)', '20%']);
    ws2.addRow(['Less than 365 days']);
    ws2.addRow([]);
    ws2.addRow(['Income - Expenses = Saving']).getCell(1).font = { italic: true, size: 9, name: 'Arial' };
    ws2.addRow(['Income - Investment = Expenses']).getCell(1).font = { bold: true, size: 9, color: { argb: C_BLUE }, name: 'Arial' };

    // Now generate 20-yr projection tables side by side (data rows start at a fixed row)
    // We'll write them to the ws2 starting fresh sections
    ws2.addRow([]);
    const projHead = ws2.addRow(['', '', '', 'SIP Projection', '', '', '', '', '',
      '', 'One-Time Projection', '', '', '', '', 'SWP Projection', '', '', '', '']);
    [4,11,16].forEach(c => {
      projHead.getCell(c).font = { bold: true, color: { argb: C_BLUE }, name: 'Arial' };
      projHead.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C_LIGHT } };
    });

    let sipOpen = 0;
    let otOpen  = oneTime;
    let swpOpen = swpCorpus;

    for (let yr = 1; yr <= 20; yr++) {
      // SIP
      const sipAdd    = sipAmt * 12;
      const sipGrowth = (sipOpen + sipAdd) * sipRate;
      const sipClose  = sipOpen + sipAdd + sipGrowth;

      // One-time
      const otGrowth  = otOpen * 0.12;
      const otClose   = otOpen + otGrowth;

      // SWP
      const swpWithdAnn = swpWithd * 12;
      const swpRemaining = swpOpen - swpWithdAnn;
      const swpGrowth   = swpRemaining > 0 ? swpRemaining * swpRate : 0;
      const swpClose    = Math.max(0, swpRemaining + swpGrowth);

      const r = ws2.addRow([
        '', '', '',
        yr, sipStartAge + yr - 1, sipOpen, sipAdd, sipGrowth, sipClose,
        '',
        yr, otOpen, otGrowth, otClose,
        '',
        yr, swpOpen, -swpWithdAnn, swpGrowth, swpClose,
      ]);
      [6,7,8,9, 12,13,14, 17,18,19,20].forEach(c => numFmt(r.getCell(c)));

      sipOpen = sipClose;
      otOpen  = otClose;
      swpOpen = swpClose;
    }

    // Summary rows
    ws2.addRow([]);
    ws2.addRow(['', '', '', '', '', '', sipAmt * 12 * 20, '', sipOpen]).tap && null;
    const sipSumRow = ws2.addRow(['', '', '', 'Total SIP Invested', '', '', `₹${(sipAmt * 12 * 20).toLocaleString('en-IN')}`, '', `Final Corpus: ₹${Math.round(sipOpen).toLocaleString('en-IN')}`]);
    sipSumRow.getCell(4).font = { bold: true, name: 'Arial' };

    addDisclaimer(ws2);

    // ══════════════════════════════════════════════════════════
    // SHEET 3: Home Loan Interest Free
    // ══════════════════════════════════════════════════════════
    const ws3 = wb.addWorksheet('Home Loan Interest Free');
    ws3.columns = [
      { width: 22 }, { width: 16 }, { width: 4 },
      { width: 6 }, { width: 16 }, { width: 14 }, { width: 14 }, { width: 16 },
    ];
    styleLogoRow(ws3, userName, planDate, 'Home Loan — Interest Free Plan');

    const hlAmt    = Number(p.home_loan_amount || 0);
    const hlEmi    = Number(p.home_loan_emi || 0);
    const hlTenure = Number(p.home_loan_tenure || 20);
    const hlRate   = Number(p.home_loan_rate || 0.071);

    const totalPaid     = hlEmi * hlTenure * 12;
    const totalInterest = Math.max(0, totalPaid - hlAmt);

    // Annual compounding factor (beginning of period, matches template table)
    const annualFactor = ((Math.pow(1.12, hlTenure) - 1) / 0.12) * 1.12;
    // Monthly SIP — ceil so corpus always >= interest (never negative net benefit)
    const sipMonthly = totalInterest > 0 ? Math.ceil(totalInterest / annualFactor / 12) : 0;
    const annualSip  = sipMonthly * 12;

    const n   = hlTenure * 12;           // months
    const r_m = hlRate / 12;             // use actual loan rate for interest calc
    // Correct SIP formula: PMT = FV * r / ((1+r)^n - 1)
    // This gives the monthly SIP needed so that corpus = totalInterest after n months at 12% CAGR
    const sipR = 0.12 / 12;             // SIP growth rate (12% p.a.)
    const sipNeeded = (n > 0 && totalInterest > 0)
      ? Math.ceil((totalInterest * sipR) / (Math.pow(1 + sipR, n) - 1))
      : 0;

    ws3.addRow(['Loan Amount',   inr(hlAmt)]).getCell(1).font = { bold: true, name: 'Arial' };
    ws3.addRow(['EMI',           inr(hlEmi)]).getCell(1).font = { bold: true, name: 'Arial' };
    ws3.addRow(['Tenure',        `${hlTenure} Years`]).getCell(1).font = { bold: true, name: 'Arial' };
    ws3.addRow(['Interest Rate', `${(hlRate * 100).toFixed(2)}% p.a.`]).getCell(1).font = { bold: true, name: 'Arial' };
    ws3.addRow(['Total Interest', inr(totalInterest)]).getCell(1).font = { bold: true, color: { argb: C_RED }, name: 'Arial' };
    ws3.addRow(['Monthly SIP Amount', inr(sipMonthly)]).getCell(1).font = { bold: true, color: { argb: C_GREEN }, name: 'Arial' };
    ws3.addRow(['Growth Rate',   '12% p.a.']);
    ws3.addRow([]);

    // Table headers
    const hlHead = ws3.addRow(['', '', '', 'Yr', 'Open', 'Add (SIP/yr)', 'Growth', 'Close']);
    [4,5,6,7,8].forEach(c => styleHeader(hlHead.getCell(c)));

    // SIP growth table (the "interest-free" concept: SIP corpus offsets interest paid)
    let hlSipOpen = 0;
    for (let yr = 1; yr <= hlTenure; yr++) {
      const add    = annualSip;
      const growth = (hlSipOpen + add) * 0.12;
      const close  = hlSipOpen + add + growth;
      const r2 = ws3.addRow(['', '', '', yr, hlSipOpen, add, growth, close]);
      [5,6,7,8].forEach(c => numFmt(r2.getCell(c)));
      hlSipOpen = close;
    }

    ws3.addRow([]);
    const hlSumRow = ws3.addRow([`Final SIP Corpus`, '', '', '', '', '', '', hlSipOpen]);
    styleBold(hlSumRow.getCell(1));
    numFmt(hlSumRow.getCell(8));
    const hlVsRow = ws3.addRow([`Total Interest Payable`, '', '', '', '', '', '', totalInterest]);
    numFmt(hlVsRow.getCell(8));
    const hlNetRow = ws3.addRow([`Net Benefit (Corpus − Interest)`, '', '', '', '', '', '', hlSipOpen - totalInterest]);
    styleBold(hlNetRow.getCell(1));
    numFmt(hlNetRow.getCell(8));
    hlNetRow.getCell(8).font = {
      bold: true,
      color: { argb: (hlSipOpen - totalInterest) >= 0 ? C_GREEN : C_RED },
      name: 'Arial',
    };

    addDisclaimer(ws3);

    // ══════════════════════════════════════════════════════════
    // SHEET 4: Net Worth
    // ══════════════════════════════════════════════════════════
    const ws4 = wb.addWorksheet('Networth');
    ws4.columns = [{ width: 30 }, { width: 35 }, { width: 18 }];
    styleLogoRow(ws4, userName, planDate, 'Net Worth Statement');

    const nwTitle = ws4.addRow(['NET WORTH STATEMENT']);
    nwTitle.getCell(1).font = { bold: true, size: 13, color: { argb: C_BLUE }, name: 'Arial' };
    ws4.addRow(['Client Name', userName]);
    ws4.addRow(['As on Date',  planDate]);
    ws4.addRow([]);

    // Assets header
    const nwAssHead = ws4.addRow(['ASSETS', 'Details', 'Value (₹)']);
    [1,2,3].forEach(c => styleHeader(nwAssHead.getCell(c)));

    const finAssSection = ws4.addRow(['Financial Assets']);
    finAssSection.getCell(1).font = { bold: true, size: 11, name: 'Arial' };

    financialAssets.forEach(a => {
      const r = ws4.addRow(['  ' + (a.label || a.investment_type), '', Number(a.current_value || 0)]);
      numFmt(r.getCell(3));
    });
    const totFinRow = ws4.addRow(['Total Financial Assets', '', totalFinancial]);
    styleBold(totFinRow.getCell(1)); numFmt(totFinRow.getCell(3));
    totFinRow.getCell(3).font = { bold: true, name: 'Arial' };
    ws4.addRow([]);

    const physSection = ws4.addRow(['Physical Assets']);
    physSection.getCell(1).font = { bold: true, size: 11, name: 'Arial' };
    physicalAssets.forEach(a => {
      const r = ws4.addRow(['  ' + (a.label || a.investment_type), '', Number(a.current_value || 0)]);
      numFmt(r.getCell(3));
    });
    const totPhysRow = ws4.addRow(['Total Physical Assets', '', totalPhysical]);
    styleBold(totPhysRow.getCell(1)); numFmt(totPhysRow.getCell(3));
    totPhysRow.getCell(3).font = { bold: true, name: 'Arial' };
    ws4.addRow([]);

    const totAssRow = ws4.addRow(['TOTAL ASSETS', '', totalFinancial + totalPhysical]);
    totAssRow.getCell(1).font = { bold: true, size: 11, color: { argb: C_BLUE }, name: 'Arial' };
    numFmt(totAssRow.getCell(3)); totAssRow.getCell(3).font = { bold: true, size: 11, name: 'Arial' };
    ws4.addRow([]);

    // Liabilities
    const nwLiabHead = ws4.addRow(['LIABILITIES', 'Details', 'Outstanding (₹)']);
    [1,2,3].forEach(c => styleHeader(nwLiabHead.getCell(c)));

    data.liabilities.forEach(l => {
      const r = ws4.addRow([
        '  ' + l.label,
        `${l.loan_type.charAt(0).toUpperCase() + l.loan_type.slice(1)} Loan | EMI: ${inr(l.emi)}/mo`,
        Number(l.outstanding_amount || 0)
      ]);
      numFmt(r.getCell(3));
    });
    const totLiabRow = ws4.addRow(['Total Liabilities', '', totalLiab]);
    styleBold(totLiabRow.getCell(1)); numFmt(totLiabRow.getCell(3));
    totLiabRow.getCell(3).font = { bold: true, name: 'Arial' };
    ws4.addRow([]);

    const netWorth = (totalFinancial + totalPhysical) - totalLiab;
    const nwRow = ws4.addRow(['NET WORTH', '', netWorth]);
    nwRow.getCell(1).font = { bold: true, size: 13, color: { argb: C_BLUE }, name: 'Arial' };
    numFmt(nwRow.getCell(3));
    nwRow.getCell(3).font = { bold: true, size: 13, color: { argb: netWorth >= 0 ? C_GREEN : C_RED }, name: 'Arial' };

    addDisclaimer(ws4);

    // ══════════════════════════════════════════════════════════
    // SHEET 5: Term Insurance
    // ══════════════════════════════════════════════════════════
    const ws5 = wb.addWorksheet('Term_Insurance');
    ws5.columns = [
      { width: 6 }, { width: 14 }, { width: 16 }, { width: 14 }, { width: 14 }, { width: 18 },
      { width: 4 }, { width: 10 }, { width: 4 }, { width: 12 }, { width: 10 },
    ];
    styleLogoRow(ws5, userName, planDate, 'Term Insurance Planning');

    const termPrem    = Number(p.term_insurance_premium || 0);
    const termSip     = Number(p.term_insurance_sip || 0);
    const termTenure  = Number(p.term_insurance_tenure || 12);
    const termRate    = Number(p.term_growth_rate || 0.12);

    // Params
    const tiParamRow = ws5.addRow(['Yr', 'Premium', 'Open', 'Add', 'Growth', 'Close', '', 'SIP Amt', '', 'Growth Rate', '']);
    [1,2,3,4,5,6,8,10].forEach(c => styleHeader(tiParamRow.getCell(c)));
    tiParamRow.getCell(8).value = termSip;
    tiParamRow.getCell(10).value = termRate;
    tiParamRow.getCell(11).value = `${(termRate * 100).toFixed(0)}%`;

    let tiCorpus = 0;
    for (let yr = 1; yr <= termTenure; yr++) {
      const add    = termSip * 12;
      const growth = (tiCorpus + add) * termRate;
      const open   = tiCorpus;
      tiCorpus     = tiCorpus + add + growth;
      const r = ws5.addRow([yr, termPrem, open, add, growth, tiCorpus]);
      [2,3,4,5,6].forEach(c => numFmt(r.getCell(c)));
    }

    ws5.addRow([]);
    const tiTotPrem = ws5.addRow(['', termPrem * termTenure, '', termSip * 12 * termTenure, '', tiCorpus]);
    [2,4,6].forEach(c => {
      numFmt(tiTotPrem.getCell(c));
      styleBold(tiTotPrem.getCell(c));
    });

    ws5.addRow([]);
    const tiSummary = ws5.addRow(['Summary']);
    tiSummary.getCell(1).font = { bold: true, size: 11, color: { argb: C_BLUE }, name: 'Arial' };
    ws5.addRow(['Total Premiums Paid',    '', inr(termPrem * termTenure)]);
    ws5.addRow(['Total SIP Invested',     '', inr(termSip * 12 * termTenure)]);
    ws5.addRow(['Final SIP Corpus',       '', inr(tiCorpus)]);
    const tiNetRow = ws5.addRow(['Net Benefit (Corpus − Premiums)', '', inr(tiCorpus - termPrem * termTenure)]);
    styleBold(tiNetRow.getCell(1));
    tiNetRow.getCell(3).font = {
      bold: true,
      color: { argb: (tiCorpus - termPrem * termTenure) >= 0 ? C_GREEN : C_RED },
      name: 'Arial',
    };

    addDisclaimer(ws5);

    // ── Stream response ──────────────────────────────────────────────
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition',
      `attachment; filename=radds_${userName.replace(/\s+/g,'_')}_${Date.now()}.xlsx`);
    await wb.xlsx.write(res);

    await supabaseAdmin.from('export_reports').insert({
      user_id: req.userId, export_type: 'xlsx', calculator_type: null,
    }).then(() => {}).catch?.(() => {}) || Promise.resolve();

    res.end();
  } catch (err) {
    console.error('XLSX export error:', err);
    if (!res.headersSent) res.status(500).json({ error: 'Export failed' });
  }
});

// ============================================================
// POST /api/exports/pdf
// ============================================================
router.post('/pdf', async (req, res) => {
  try {
    const { calculator_type, inputs } = req.body || {};
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

    // ── Header bar ──────────────────────────────────────────────
    doc.rect(0, 0, 595, 60).fill('#22568f');
    doc.fillColor('white').fontSize(16).font('Helvetica-Bold').text('Radds Capital', 50, 15);
    doc.fontSize(9).font('Helvetica').text('AMFI-Registered Mutual Fund Distributor | ARN-XXXXXX', 50, 35);
    doc.fontSize(9).text(`Generated: ${new Date().toLocaleString('en-IN')}`, 400, 35, { align: 'right' });
    doc.fillColor('#1a1a2e').moveDown(3);

    // ── Title ────────────────────────────────────────────────────
    doc.fontSize(18).font('Helvetica-Bold').fillColor('#22568f').text('Financial Profile Report', 50, 80);
    doc.fontSize(11).font('Helvetica').fillColor('#555')
      .text(`${data.user?.display_name || ''} | ${data.user?.email || ''}`, 50, 106);
    doc.moveDown(1.5);

    function sectionHeader(title) {
      doc.fontSize(12).font('Helvetica-Bold').fillColor('#22568f').text(title);
      doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#e2ebf5').lineWidth(1).stroke();
      doc.moveDown(0.4);
    }
    function kv(label, value) {
      doc.fontSize(10).font('Helvetica').fillColor('#333')
        .text(label, 50, doc.y, { continued: true, width: 260 })
        .font('Helvetica-Bold').text(String(value || '-'), { align: 'right', width: 235 });
      doc.moveDown(0.25);
    }

    const p = data.profile || {};
    sectionHeader('Personal Details');
    kv('Name', data.user?.display_name || '-');
    kv('Age', p.age ? `${p.age} years` : '-');
    kv('Risk Preference', p.risk_preference || '-');
    doc.moveDown(0.5);

    const totalIncome = data.income.reduce((s, r) => s + Number(r.amount || 0), 0);
    sectionHeader('Income Sources');
    data.income.forEach(r => kv(r.label, inr(r.amount) + '/mo'));
    kv('Total Monthly Income', inr(totalIncome));
    doc.moveDown(0.5);

    const totalExpense = data.expenses.reduce((s, r) => s + Number(r.amount || 0), 0);
    sectionHeader('Monthly Expenses');
    data.expenses.forEach(r => kv(r.label, inr(r.amount) + '/mo'));
    kv('Total Monthly Expenses', inr(totalExpense));
    kv('Net Monthly Surplus', inr(totalIncome - totalExpense));
    doc.moveDown(0.5);

    if (data.liabilities.length) {
      sectionHeader('Liabilities');
      data.liabilities.forEach(r => kv(r.label, `EMI ${inr(r.emi)}/mo | Outstanding: ${inr(r.outstanding_amount)}`));
      doc.moveDown(0.5);
    }

    if (data.investments.length) {
      sectionHeader('Existing Investments & Assets');
      data.investments.forEach(r => kv(r.label, inr(r.current_value)));
      doc.moveDown(0.5);
    }

    if (data.insurance.length) {
      sectionHeader('Insurance Policies');
      data.insurance.forEach(r => kv(r.provider || r.policy_type, `Cover: ${inr(r.cover_amount)} | Premium: ${inr(r.premium)}/yr`));
      doc.moveDown(0.5);
    }

    if (calcResult) {
      sectionHeader(`Calculator: ${calculator_type?.toUpperCase()}`);
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#333').text('Summary:');
      doc.moveDown(0.2);
      Object.entries(calcResult.summary).forEach(([k, v]) => kv(k.replace(/_/g, ' '), inr(v)));
      if (calcResult.yearly_table?.length) {
        doc.moveDown(0.5);
        doc.fontSize(10).font('Helvetica-Bold').fillColor('#333').text('Year-wise Projection (first 10 years):');
        doc.moveDown(0.3);
        calcResult.yearly_table.slice(0, 10).forEach(row => {
          const headers = Object.keys(row);
          doc.fontSize(9).font('Helvetica').fillColor('#333')
            .text(headers.map(h => h === 'year' ? `Yr ${row[h]}` : inr(row[h])).join('   '));
          doc.moveDown(0.15);
        });
      }
    }

    // ── Disclaimer ────────────────────────────────────────────────
    doc.moveDown(1);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#eee').stroke();
    doc.moveDown(0.5);
    doc.fontSize(8).font('Helvetica').fillColor('#999').text(DISCLAIMER, 50, doc.y, { width: 495 });

    doc.end();

    await supabaseAdmin.from('export_reports').insert({
      user_id: req.userId, export_type: 'pdf', calculator_type: calculator_type || null,
    }).then(() => {}).catch?.(() => {}) || Promise.resolve();
  } catch (err) {
    console.error('PDF export error:', err);
    if (!res.headersSent) res.status(500).json({ error: 'Export failed' });
  }
});

module.exports = router;
