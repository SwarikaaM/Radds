// calculators/oneTimeInvestment.js — same as lumpsum but named separately for frontend mapping
const { calculateLumpsum } = require('./lumpsum');
function calculateOneTimeInvestment(inputs) { return calculateLumpsum(inputs); }
module.exports = { calculateOneTimeInvestment };