const express = require('express');
const { body, validationResult } = require('express-validator');
const { supabaseAdmin } = require('../services/supabase');
const requireAuth = require('../middleware/auth');
const { exportLimiter } = require('../middleware/rateLimiter');
const { auditLog } = require('../middleware/audit');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const CALCULATORS = require('../calculators');
const path = require('path');

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
function inrPdf(n) {
  return 'Rs. ' + Number(n || 0).toLocaleString('en-IN');
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

    await Promise.resolve(
      supabaseAdmin.from('export_reports').insert({
        user_id: req.userId, export_type: 'xlsx', calculator_type: null,
      })
    ).catch(() => {});

    res.end();
  } catch (err) {
    console.error('XLSX export error:', err);
    if (!res.headersSent) res.status(500).json({ error: 'Export failed' });
  }
});

// ============================================================
// POST /api/exports/pdf  — 5-page financial report with logo
// ============================================================
router.post('/pdf', async (req, res) => {
  try {
    const { calculator_type, inputs } = req.body || {};
    const data = await getFullProfile(req.userId);
    const p    = data.profile || {};

    const userName  = data.user?.display_name || 'Client';
    const userEmail = data.user?.email || '';
    const userPhone = data.user?.phone || '';
    const planDate  = p.date_of_plan
      ? new Date(p.date_of_plan).toLocaleDateString('en-IN')
      : new Date().toLocaleDateString('en-IN');

    const LOGO_PATH = path.join(__dirname, '../assets/Logo.png');
    const PAGE_W    = 595;
    const PAGE_H    = 842;
    const MARGIN    = 44;
    const CONTENT_W = PAGE_W - MARGIN * 2;
    const BLUE      = '#22568F';
    const LIGHT_BG  = '#EAF2FF';
    const GREY      = '#6B7E99';
    const RED       = '#cc0000';
    const GREEN     = '#1a7f3c';

    const doc = new PDFDocument({
      margin: MARGIN,
      size: 'A4',
      bufferPages: true,
      autoFirstPage: false,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition',
      `attachment; filename=radds_${userName.replace(/\s+/g, '_')}_report_${Date.now()}.pdf`);
    doc.pipe(res);

    // ── Helpers ────────────────────────────────────────────────────────

    function addPage() {
      doc.addPage();
      drawPageHeader();
    }

    function drawPageHeader() {
      // White background strip
      doc.rect(0, 0, PAGE_W, 64).fill('#f8fafc');
      // Left: logo
      try {
        doc.image(LOGO_PATH, MARGIN, 8, { height: 48, fit: [160, 48] });
      } catch (_) {
        doc.fillColor(BLUE).fontSize(14).font('Helvetica-Bold').text('Radds Capital', MARGIN, 18);
      }
      // Right: tagline + date
      doc.fillColor(GREY).fontSize(8).font('Helvetica')
        .text('AMFI-Registered Mutual Fund Distributor', 0, 18, { align: 'right', width: PAGE_W - MARGIN })
        .text(`Report date: ${new Date().toLocaleDateString('en-IN')}`, 0, 30, { align: 'right', width: PAGE_W - MARGIN });
      // Bottom border
      doc.moveTo(MARGIN, 64).lineTo(PAGE_W - MARGIN, 64).strokeColor('#C8DCF5').lineWidth(1).stroke();
      doc.y = 74;
    }

    function pageTitle(title, subtitle) {
      doc.fillColor(BLUE).fontSize(16).font('Helvetica-Bold').text(title, MARGIN, doc.y);
      if (subtitle) {
        doc.fillColor(GREY).fontSize(9).font('Helvetica').text(subtitle).moveDown(0.3);
      }
      doc.fillColor(BLUE)
        .moveTo(MARGIN, doc.y).lineTo(PAGE_W - MARGIN, doc.y)
        .lineWidth(2).stroke();
      doc.moveDown(0.6);
    }

    function sectionLabel(title) {
      const y = doc.y + 4;
      doc.rect(MARGIN, y, CONTENT_W, 18).fill(LIGHT_BG);
      doc.fillColor(BLUE).fontSize(9).font('Helvetica-Bold')
        .text(title.toUpperCase(), MARGIN + 6, y + 4);
      doc.y = y + 22;
    }

    function row(label, value, opts = {}) {
      const y = doc.y;
      if (opts.shade) doc.rect(MARGIN, y, CONTENT_W, 15).fill('#f4f8fc');
      doc.fillColor(opts.labelColor || '#333').fontSize(9)
        .font(opts.bold ? 'Helvetica-Bold' : 'Helvetica')
        .text(label, MARGIN + 4, y + 2, { width: CONTENT_W * 0.65, lineBreak: false });
      doc.fillColor(opts.valueColor || (opts.bold ? '#0D1B2E' : '#444'))
        .fontSize(9).font(opts.bold ? 'Helvetica-Bold' : 'Helvetica')
        .text(String(value ?? '—'), MARGIN + 4, y + 2,
          { width: CONTENT_W - 8, align: 'right', lineBreak: false });
      doc.y = y + 17;
    }

    function divider() {
      doc.moveTo(MARGIN, doc.y).lineTo(PAGE_W - MARGIN, doc.y)
        .strokeColor('#E2EBF5').lineWidth(0.5).stroke();
      doc.y += 4;
    }

    function disclaimer() {
      // Push to near bottom
      const disclaimerY = PAGE_H - 70;
      if (doc.y < disclaimerY) doc.y = disclaimerY;
      doc.moveTo(MARGIN, doc.y).lineTo(PAGE_W - MARGIN, doc.y)
        .strokeColor('#E2EBF5').lineWidth(0.5).stroke();
      doc.y += 4;
      doc.fillColor('#aaa').fontSize(7).font('Helvetica')
        .text(DISCLAIMER, MARGIN, doc.y, { width: CONTENT_W, align: 'left' });
    }

    function needsPageBreak(height = 40) {
      return doc.y + height > PAGE_H - 90;
    }

    // ── Computed values ─────────────────────────────────────────────────
    const getExp = (key) => Number(data.expenses.find(e => e.key === key)?.amount || 0);
    const totalIncome   = data.income.reduce((s, r) => s + Number(r.amount || 0), 0);
    const totalExpenses = data.expenses.reduce((s, r) => s + Number(r.amount || 0), 0);
    const balance       = totalIncome - totalExpenses;

    const financialAssets = (data.investments || []).filter(i => !i.asset_class || i.asset_class === 'financial');
    const physicalAssets  = (data.investments || []).filter(i => i.asset_class === 'physical');
    const totalFinancial  = financialAssets.reduce((s, i) => s + Number(i.current_value || 0), 0);
    const totalPhysical   = physicalAssets.reduce((s, i)  => s + Number(i.current_value || 0), 0);
    const totalLiab       = data.liabilities.reduce((s, l) => s + Number(l.outstanding_amount || 0), 0);
    const netWorth        = totalFinancial + totalPhysical - totalLiab;

    const sipAmt     = Number(p.sip_amount || 0);
    const sipRate    = Number(p.sip_growth_rate || 0.12);
    const oneTime    = Number(p.one_time_invest || 0);
    const swpWithd   = Number(p.swp_withdrawal || 0);
    const swpCorpus  = Number(p.swp_corpus || 0);
    const swpRate    = Number(p.swp_growth_rate || 0.12);

    const hlAmt    = Number(p.home_loan_amount || 0);
    const hlEmi    = Number(p.home_loan_emi || 0);
    const hlTenure = Number(p.home_loan_tenure || 20);
    const hlRate   = Number(p.home_loan_rate || 0.071);
    const hlTotalPaid     = hlEmi * hlTenure * 12;
    const hlTotalInterest = Math.max(0, hlTotalPaid - hlAmt);

    // Same formula as XLSX — annual compounding, beginning of period
    const hlAnnualFactor = ((Math.pow(1.12, hlTenure) - 1) / 0.12) * 1.12;
    const hlSipMonthly   = hlTotalInterest > 0 ? Math.ceil(hlTotalInterest / hlAnnualFactor / 12) : 0;
    const hlAnnualSip    = hlSipMonthly * 12;

    const termPrem   = Number(p.term_insurance_premium || 0);
    const termSip    = Number(p.term_insurance_sip || 0);
    const termTenure = Number(p.term_insurance_tenure || 12);
    const termRate   = Number(p.term_growth_rate || 0.12);

    const riskLabel = { conservative: 'Conservative', moderate: 'Moderate', aggressive: 'Aggressive' };

    // ══════════════════════════════════════════════════════════
    // PAGE 1 — Financial Profile Summary
    // ══════════════════════════════════════════════════════════
    addPage();
    pageTitle('Financial Profile Summary', `${userName}  •  ${userEmail}${userPhone ? '  •  ' + userPhone : ''}  •  Plan Date: ${planDate}`);

    // Summary banner
    const bannerY = doc.y;
    doc.rect(MARGIN, bannerY, CONTENT_W, 44).fill(BLUE);
    const bannerItems = [
      { label: 'Monthly Income',      value: inrPdf(totalIncome),   x: MARGIN + 10 },
      { label: 'Monthly Expenses',    value: inrPdf(totalExpenses), x: MARGIN + 130 },
      { label: 'Investment Capacity', value: inrPdf(Math.max(0, balance)), x: MARGIN + 260 },
      { label: 'Net Worth',           value: inrPdf(netWorth),      x: MARGIN + 390 },
    ];
    bannerItems.forEach(({ label, value, x }) => {
      doc.fillColor('rgba(255,255,255,0.65)').fontSize(7).font('Helvetica').text(label, x, bannerY + 6, { lineBreak: false });
      doc.fillColor('white').fontSize(11).font('Helvetica-Bold').text(value, x, bannerY + 18, { lineBreak: false });
    });
    doc.y = bannerY + 54;

    // Personal details
    sectionLabel('Personal Details');
    const personal = [
      ['Name',             data.user?.display_name || '—'],
      ['Email',            userEmail || '—'],
      ['Phone',            userPhone || '—'],
      ['Age',              p.age ? `${p.age} years` : '—'],
      ['Risk Preference',  riskLabel[p.risk_preference] || '—'],
      ['Date of Plan',     planDate],
    ];
    personal.forEach(([l, v], i) => row(l, v, { shade: i % 2 === 0 }));
    doc.moveDown(0.5);

    // Income
    sectionLabel('Monthly Income');
    data.income.forEach((r, i) => row(r.label, inrPdf(r.amount) + '/mo', { shade: i % 2 === 0 }));
    row('Total Monthly Income', inrPdf(totalIncome) + '/mo', { bold: true, valueColor: BLUE });
    doc.moveDown(0.5);

    // Expenses
    if (needsPageBreak(60)) { addPage(); }
    sectionLabel('Monthly Expenses');
    const expLabels = {
      householdExp: 'House Hold Expenses', rent: 'Rent', emi: 'EMI',
      healthInsurance: 'Health Insurance', insurance: 'Insurance', bills: 'Bills',
      schoolFees: 'School Fees', fuel: 'Fuel', personal: 'Personal',
      existingSip: 'Existing SIP', addExpenses: 'Additional Expenses',
    };
    data.expenses.forEach((r, i) =>
      row(expLabels[r.key] || r.label, inrPdf(r.amount) + '/mo', { shade: i % 2 === 0 })
    );
    row('Total Monthly Expenses', inrPdf(totalExpenses) + '/mo', { bold: true, valueColor: RED });
    row('Net Monthly Balance', inrPdf(balance) + '/mo', {
      bold: true, valueColor: balance >= 0 ? GREEN : RED,
    });
    doc.moveDown(0.5);

    // Children
    if (data.children.length > 0) {
      if (needsPageBreak(50)) { addPage(); }
      sectionLabel('Children Expenses');
      data.children.forEach((child, i) => {
        const exp = (data.child_expenses || []).find(e => e.child_id === child.id) || {};
        const childTotal = Number(exp.education||0) + Number(exp.allowance||0) + Number(exp.holiday||0) + Number(exp.medical||0);
        row(`${child.name} (Age ${child.age})`, '', { bold: true });
        row('  Education',  inrPdf(exp.education || 0), { shade: true });
        row('  Allowance',  inrPdf(exp.allowance || 0));
        row('  Holiday',    inrPdf(exp.holiday || 0), { shade: true });
        row('  Medical',    inrPdf(exp.medical || 0));
        row('  Child Total/mo', inrPdf(childTotal), { bold: true });
        if (i < data.children.length - 1) divider();
      });
    }

    disclaimer();

    // ══════════════════════════════════════════════════════════
    // PAGE 2 — Net Worth
    // ══════════════════════════════════════════════════════════
    addPage();
    pageTitle('Net Worth Statement', `As on ${planDate}`);

    sectionLabel('Financial Assets');
    if (financialAssets.length === 0) {
      doc.fillColor(GREY).fontSize(9).font('Helvetica').text('No financial assets recorded.', MARGIN + 4, doc.y).moveDown(0.5);
    } else {
      financialAssets.forEach((a, i) =>
        row(a.label || a.investment_type, inrPdf(a.current_value), { shade: i % 2 === 0 })
      );
      row('Total Financial Assets', inrPdf(totalFinancial), { bold: true, valueColor: BLUE });
    }
    doc.moveDown(0.5);

    sectionLabel('Physical Assets');
    if (physicalAssets.length === 0) {
      doc.fillColor(GREY).fontSize(9).font('Helvetica').text('No physical assets recorded.', MARGIN + 4, doc.y).moveDown(0.5);
    } else {
      physicalAssets.forEach((a, i) =>
        row(a.label || a.investment_type, inrPdf(a.current_value), { shade: i % 2 === 0 })
      );
      row('Total Physical Assets', inrPdf(totalPhysical), { bold: true, valueColor: BLUE });
    }
    doc.moveDown(0.5);

    sectionLabel('Liabilities');
    if (data.liabilities.length === 0) {
      doc.fillColor(GREY).fontSize(9).font('Helvetica').text('No liabilities recorded.', MARGIN + 4, doc.y).moveDown(0.5);
    } else {
      data.liabilities.forEach((l, i) => {
        row(l.label, `EMI ${inrPdf(l.emi)}/mo | Outstanding: ${inrPdf(l.outstanding_amount)}`, { shade: i % 2 === 0 });
      });
      row('Total Liabilities', inrPdf(totalLiab), { bold: true, valueColor: RED });
    }
    doc.moveDown(0.5);

    // Net worth total box
    const nwY = doc.y + 4;
    doc.rect(MARGIN, nwY, CONTENT_W, 32).fill(netWorth >= 0 ? '#e6f4ea' : '#fdecea');
    doc.fillColor(netWorth >= 0 ? GREEN : RED).fontSize(11).font('Helvetica-Bold')
      .text('Net Worth (Assets − Liabilities)', MARGIN + 8, nwY + 9, { width: CONTENT_W * 0.6, lineBreak: false });
    doc.fontSize(13).text(inrPdf(netWorth), MARGIN + 8, nwY + 8,
      { width: CONTENT_W - 16, align: 'right', lineBreak: false });
    doc.y = nwY + 42;

    // Insurance
    if (data.insurance.length > 0) {
      doc.moveDown(0.5);
      sectionLabel('Insurance Policies');
      data.insurance.forEach((ins, i) => {
        row(
          `${ins.policy_type.charAt(0).toUpperCase() + ins.policy_type.slice(1)} — ${ins.provider || 'N/A'}`,
          `Cover: ${inrPdf(ins.cover_amount)} | Premium: ${inrPdf(ins.premium)}/yr`,
          { shade: i % 2 === 0 }
        );
      });
    }

    disclaimer();

    // ══════════════════════════════════════════════════════════
    // PAGE 3 — Investment Planning
    // ══════════════════════════════════════════════════════════
    addPage();
    pageTitle('Investment Planning', 'SIP, One-Time & SWP — 20-year projection at 12% p.a.');

    // Params
    sectionLabel('Parameters');
    row('Monthly SIP Amount',     inrPdf(sipAmt),          { shade: true });
    row('SIP Growth Rate',        `${(sipRate * 100).toFixed(1)}% p.a.`);
    row('One-Time Investment',    inrPdf(oneTime),          { shade: true });
    row('SWP Monthly Withdrawal', inrPdf(swpWithd));
    row('SWP Corpus',             inrPdf(swpCorpus),        { shade: true });
    doc.moveDown(0.6);

    // 20-yr table
    sectionLabel('20-Year Projection');

    // Table header
    const thY = doc.y;
    const colX = [MARGIN, MARGIN+22, MARGIN+72, MARGIN+122, MARGIN+172, MARGIN+228,
                  MARGIN+242, MARGIN+292, MARGIN+342, MARGIN+392, MARGIN+444];
    doc.rect(MARGIN, thY, CONTENT_W, 14).fill(BLUE);
    const hdrs = ['Yr','SIP Open','SIP Add','SIP Grow','SIP Close','|','1T Open','1T Grow','1T Close','|','SWP Close'];
    hdrs.forEach((h, i) => {
      doc.fillColor('white').fontSize(6.5).font('Helvetica-Bold')
        .text(h, colX[i], thY + 3, { width: 48, lineBreak: false });
    });
    doc.y = thY + 16;

    let sipOpen = 0, otOpen = oneTime, swpOpen = swpCorpus;
    for (let yr = 1; yr <= 20; yr++) {
      const sipAdd    = sipAmt * 12;
      const sipGrowth = (sipOpen + sipAdd) * sipRate;
      const sipClose  = sipOpen + sipAdd + sipGrowth;
      const otGrowth  = otOpen * 0.12;
      const otClose   = otOpen + otGrowth;
      const swpWithdAnn = swpWithd * 12;
      const swpRemaining = swpOpen - swpWithdAnn;
      const swpGrowth   = swpRemaining > 0 ? swpRemaining * swpRate : 0;
      const swpClose    = Math.max(0, swpRemaining + swpGrowth);

      const rowY = doc.y;
      if (needsPageBreak(12)) { addPage(); doc.y = 80; }
      if (yr % 2 === 0) doc.rect(MARGIN, rowY, CONTENT_W, 12).fill('#f4f8fc');

      const vals = [yr, sipOpen, sipAdd, sipGrowth, sipClose, '', otOpen, otGrowth, otClose, '', swpClose];
      vals.forEach((v, i) => {
        const txt = typeof v === 'number' && i !== 0 ? (v/100000).toFixed(1)+'L' : String(v);
        doc.fillColor(i === 5 || i === 9 ? GREY : '#333')
          .fontSize(6.5).font('Helvetica')
          .text(txt, colX[i], rowY + 2, { width: 48, lineBreak: false });
      });
      doc.y = rowY + 13;

      sipOpen = sipClose; otOpen = otClose; swpOpen = swpClose;
    }

    doc.moveDown(0.4);
    row('Final SIP Corpus (20 yr)',    inrPdf(Math.round(sipOpen)),  { bold: true, valueColor: BLUE });
    if (oneTime > 0) row('Final One-Time Corpus (20 yr)', inrPdf(Math.round(otOpen)), { bold: true, valueColor: BLUE });

    // Taxation note
    doc.moveDown(0.5);
    sectionLabel('Taxation Reference (Equity MF)');
    row('LTCG (held > 365 days)',  '₹1.25 lakh exempt; above that: 12.5%', { shade: true });
    row('STCG (held ≤ 365 days)',  '20%');

    doc.moveDown(0.3);
    doc.fillColor(BLUE).fontSize(8).font('Helvetica-Bold')
      .text('Radds Approach: Income − Investment = Lifestyle Expenses', MARGIN, doc.y, { width: CONTENT_W });

    disclaimer();

    // ══════════════════════════════════════════════════════════
    // PAGE 4 — Home Loan Interest Free Plan
    // ══════════════════════════════════════════════════════════
    addPage();
    pageTitle('Home Loan — Interest Free Plan',
      'Parallel SIP strategy to offset total interest paid on your home loan');

    sectionLabel('Loan Parameters');
    row('Loan Amount',            inrPdf(hlAmt),                            { shade: true });
    row('Monthly EMI',            inrPdf(hlEmi));
    row('Tenure',                 `${hlTenure} years`,                   { shade: true });
    row('Interest Rate',          `${(hlRate * 100).toFixed(2)}% p.a.`);
    row('Total Amount Paid',      inrPdf(hlTotalPaid),                      { shade: true });
    row('Total Interest Payable', inrPdf(hlTotalInterest), { bold: true, valueColor: RED });
    doc.moveDown(0.5);

    // Monthly SIP needed to offset interest
    const sipNeeded    = hlSipMonthly;
    const sipNeededAnn = hlAnnualSip;

    const sipBoxY = doc.y + 4;
    doc.rect(MARGIN, sipBoxY, CONTENT_W, 32).fill(LIGHT_BG);
    doc.fillColor(BLUE).fontSize(9).font('Helvetica-Bold')
      .text('Monthly SIP needed to cover total interest:', MARGIN + 8, sipBoxY + 6, { lineBreak: false });
    doc.fillColor(GREEN).fontSize(13).font('Helvetica-Bold')
      .text(inrPdf(sipNeeded) + '/mo', MARGIN + 8, sipBoxY + 5,
        { width: CONTENT_W - 16, align: 'right', lineBreak: false });
    doc.y = sipBoxY + 42;

    // Projection table
    sectionLabel(`SIP Growth vs Loan Tenure (${hlTenure} years @ 12% p.a.)`);
    const hlThY = doc.y;
    doc.rect(MARGIN, hlThY, CONTENT_W, 14).fill(BLUE);
    ['Yr', 'SIP Open', 'Annual Add', 'Growth', 'Closing Corpus'].forEach((h, i) => {
      doc.fillColor('white').fontSize(7.5).font('Helvetica-Bold')
        .text(h, MARGIN + i * 97, hlThY + 3, { width: 95, lineBreak: false });
    });
    doc.y = hlThY + 16;

    let hlSipOpen = 0;
    for (let yr = 1; yr <= hlTenure; yr++) {
      const add    = sipNeededAnn;
      const growth = (hlSipOpen + add) * 0.12;
      const close  = hlSipOpen + add + growth;
      const rY = doc.y;
      if (needsPageBreak(12)) { addPage(); doc.y = 80; }
      if (yr % 2 === 0) doc.rect(MARGIN, rY, CONTENT_W, 12).fill('#f4f8fc');
      [yr, inrPdf(Math.round(hlSipOpen)), inrPdf(add), inrPdf(Math.round(growth)), inrPdf(Math.round(close))].forEach((v, i) => {
        doc.fillColor('#333').fontSize(7.5).font('Helvetica')
          .text(String(v), MARGIN + i * 97, rY + 2, { width: 95, lineBreak: false });
      });
      doc.y = rY + 13;
      hlSipOpen = close;
    }

    doc.moveDown(0.5);
    row('Final SIP Corpus',                inrPdf(Math.round(hlSipOpen)), { bold: true, valueColor: BLUE });
    row('Total Interest Payable',          inrPdf(hlTotalInterest),       { bold: true, valueColor: RED });
    const net = hlSipOpen - hlTotalInterest;
    row('Net Benefit (Corpus − Interest)', inrPdf(Math.round(net)),
      { bold: true, valueColor: net >= 0 ? GREEN : RED });

    disclaimer();

    // ══════════════════════════════════════════════════════════
    // PAGE 5 — Term Insurance Planning
    // ══════════════════════════════════════════════════════════
    addPage();
    pageTitle('Term Insurance Planning',
      'SIP strategy to offset term insurance premiums over policy tenure');

    sectionLabel('Policy Parameters');
    row('Annual Premium',        inrPdf(termPrem),                      { shade: true });
    row('Monthly SIP to Offset', inrPdf(termSip));
    row('Policy Tenure',         `${termTenure} years`,              { shade: true });
    row('SIP Growth Rate',       `${(termRate * 100).toFixed(0)}% p.a.`);
    doc.moveDown(0.5);

    sectionLabel(`Year-wise Premium vs SIP Corpus (${termTenure} years)`);
    const tiThY = doc.y;
    doc.rect(MARGIN, tiThY, CONTENT_W, 14).fill(BLUE);
    ['Yr', 'Premium Paid', 'SIP Open', 'Annual SIP', 'Growth', 'SIP Close'].forEach((h, i) => {
      doc.fillColor('white').fontSize(7.5).font('Helvetica-Bold')
        .text(h, MARGIN + i * 82, tiThY + 3, { width: 80, lineBreak: false });
    });
    doc.y = tiThY + 16;

    let tiCorpus = 0;
    for (let yr = 1; yr <= termTenure; yr++) {
      const annSip = termSip * 12;
      const growth = (tiCorpus + annSip) * termRate;
      const open   = tiCorpus;
      tiCorpus     = tiCorpus + annSip + growth;
      const rY = doc.y;
      if (needsPageBreak(12)) { addPage(); doc.y = 80; }
      if (yr % 2 === 0) doc.rect(MARGIN, rY, CONTENT_W, 12).fill('#f4f8fc');
      [yr, inrPdf(termPrem), inrPdf(Math.round(open)), inrPdf(annSip), inrPdf(Math.round(growth)), inrPdf(Math.round(tiCorpus))].forEach((v, i) => {
        doc.fillColor('#333').fontSize(7.5).font('Helvetica')
          .text(String(v), MARGIN + i * 82, rY + 2, { width: 80, lineBreak: false });
      });
      doc.y = rY + 13;
    }

    doc.moveDown(0.5);
    row('Total Premiums Paid',              inrPdf(termPrem * termTenure),       { bold: true });
    row('Total SIP Invested',               inrPdf(termSip * 12 * termTenure),   { bold: true });
    row('Final SIP Corpus',                 inrPdf(Math.round(tiCorpus)),        { bold: true, valueColor: BLUE });
    const tiNet = tiCorpus - termPrem * termTenure;
    row('Net Benefit (Corpus − Premiums)',  inrPdf(Math.round(tiNet)),
      { bold: true, valueColor: tiNet >= 0 ? GREEN : RED });

    disclaimer();

    // ── Finalise ──────────────────────────────────────────────────────
    doc.end();

    // Supabase v2 returns PromiseLike — wrap in Promise.resolve() so .catch() works
    await Promise.resolve(
      supabaseAdmin.from('export_reports').insert({
        user_id: req.userId, export_type: 'pdf', calculator_type: calculator_type || null,
      })
    ).catch(() => {}); // non-fatal — don't block response

  } catch (err) {
    console.error('PDF export error:', err);
    // doc.pipe(res) may already have started — never write JSON after that
    // The frontend handleExport will catch the non-200 and show the error page
    if (!res.headersSent) {
      res.status(500).json({ error: 'Export failed', code: 'PDF_ERROR' });
    } else {
      res.destroy(); // abort the stream cleanly so browser sees a network error
    }
  }
});

module.exports = router;
