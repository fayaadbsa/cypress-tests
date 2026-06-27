/**
 * Parses numeric values from formatted strings or numbers.
 * Strips non-digit characters (e.g. dots, letters) dynamically.
 * 
 * @param {string|number} val 
 * @returns {number}
 */
const parseNumber = (val) => {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const clean = val.replace(/[^\d]/g, '');
    return parseInt(clean, 10) || 0;
  }
  return 0;
};

module.exports = {
  parseNumber
};
