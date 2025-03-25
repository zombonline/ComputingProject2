const Errors = {
    INVALID_ARRIVAL_TIME: "Invalid arrival time",
    INVALID_ORIGIN: "Invalid origin",
    INVALID_DESTINATION: "Invalid destination",
}
const REG_SPECIAL = /[!"£!$%^&*()_+={};:@#~<`¬>,-.?/|]/;

/**
 * Validates the arrival time. Arrival time must be a string of length 4, containing only numbers
 * and be between 0000 and 2359.
 * @param {string} arrivalTime - The arrival time to validate.
 * @throws {Error} - If the arrival time is invalid.
 * @returns {boolean} - True if the arrival time is valid.
 */
function validateArrivalTime(arrivalTime){
    const checks = [
        {condition: arrivalTime.length === 4, errorMessage: "Not enough digits"},
        {condition: /^[0-9]+$/.test(arrivalTime), errorMessage: "Not a number"},
        {condition: parseInt(arrivalTime) >= 0 && parseInt(arrivalTime) <= 2359, errorMessage: "Not a valid time"}
    ];
    for (const check of checks) {
        console.log("Condition ("+check.errorMessage+") met: " + check.condition)
        if (!check.condition) {
            return false;
        }
    }
    return true;
}
function validateCommuteName(name){
    const checks = [
        {condition: name.length > 0, errorMessage: "Name is empty"},
        {condition: name.length < 20, errorMessage: "Name is too long"},
        { condition: () => REG_SPECIAL.test(name.replace(/[ -]/g, '')), errorMessage: "Name contains special characters" },
    ];
    for (const check of checks) {
        console.log("Condition ("+check.errorMessage+") met: " + check.condition)
        if (!check.condition) {
            return false;
        }
    }
    return true;
}

module.exports = {validateArrivalTime, validateCommuteName};