const REG_SPECIAL = /["£!$%^&*()_+={};:@#~<`¬>,-.?/|]/;
/**
 * Validates the passed in value against the provided checks.
 * @param {string} value - The arrival time to validate.
 * @param {Array} checks - An array of validation checks to perform.
 * @returns {Object} - object containing a boolean indicating if the validation passed and an error message if it failed.
 */
function performValidation(value, checks) {
  for (const check of checks) {
    if (!check.condition) {
      return { valid: false, errorMessage: check.errorMessage };
    }
  }
  return { valid: true };
}
/**
 * Validates the arrival time format.
 * @param {string} value - The arrival time to validate.
 * @returns {Object} - object containing a boolean indicating if the validation passed and an error message if it failed.
 */
function validateArrivalTime(value) {
  const checks = [
    { condition: value.length === 4, errorMessage: "Not enough digits" },
    { condition: /^[0-9]+$/.test(value), errorMessage: "Not a number" },
    {
      condition: parseInt(value) >= 0 && parseInt(value) <= 2359,
      errorMessage: "Not a valid time",
    },
  ];
  return performValidation(value, checks);
}
/**
 * Validates the commute name.
 * @param {string} value - The commute name to validate.
 * @returns {Object} - object containing a boolean indicating if the validation passed and an error message if it failed.
 */
function validateCommuteName(value) {
  const checks = [
    { condition: value.length > 0, errorMessage: "Name is empty" },
    { condition: value.length < 20, errorMessage: "Name is too long" },
    {
      condition: !REG_SPECIAL.test(value),
      errorMessage: "Name contains special characters",
    },
  ];
  return performValidation(value, checks);
}
/**
 * Validates the average duration.
 * @param {string} value - The average duration to validate.
 * @returns {Object} - object containing a boolean indicating if the validation passed and an error message if it failed.
 */
function validateAverageDuration(value) {
  const checks = [
    { condition: value > 1, errorMessage: "Duration is less than 1 minute." },
    {
      condition: /^[0-9]+$/.test(value),
      errorMessage: "Duration is not a number.",
    },
  ];
  return performValidation(value, checks);
}
/**
 * Validates the latitude and longitude.
 * @param {string} value - The latitude and longitude to validate.
 * @returns {Object} - object containing a boolean indicating if the validation passed and an error message if it failed.
 */
function validateLatLong(value) {
  const checks = [
    { condition: value.length > 0, errorMessage: "Location is empty" },
    {
      condition: (() => {
        const [lat, long] = value.split(",").map(Number);
        return lat >= 49.9 && lat <= 60.9 && long >= -8.6 && long <= 1.8;
      })(),
      errorMessage: "Not a valid uk location",
    },
  ];
  return performValidation(value, checks);
}
module.exports = {
  validateArrivalTime,
  validateCommuteName,
  validateAverageDuration,
  validateLatLong,
};
