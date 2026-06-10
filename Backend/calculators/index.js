const { calculateSIP } = require('./sip');
const { calculateSWP } = require('./swp');
const { calculateLumpsum } = require('./lumpsum');
const { calculateStepUpSIP } = require('./stepUpSip');
const { calculateCostOfDelaySIP } = require('./costOfDelaySip');
const { calculateOneTimeInvestment } = require('./oneTimeInvestment');

module.exports = {
  'sip': calculateSIP,
  'swp': calculateSWP,
  'lumpsum': calculateLumpsum,
  'step-up-sip': calculateStepUpSIP,
  'cost-of-delay-sip': calculateCostOfDelaySIP,
  'one-time-investment': calculateOneTimeInvestment,
};