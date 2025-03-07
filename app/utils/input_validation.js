/**
 * Validates the arrival time. Arrival time must be a string of length 4, containing only numbers
 * and be between 0000 and 2359.
 * @param {string} arrivalTime - The arrival time to validate.
 * @throws {Error} - If the arrival time is invalid.
 * @returns {boolean} - True if the arrival time is valid.
 */
function validateArrivalTime(arrivalTime){
        const checks = [
            {condition: arrivalTime.length === 4, errorMessage: Errors.INVALID_ARRIVAL_TIME},
            {condition: arrivalTime.match(/^[0-9]+$/), errorMessage: Errors.INVALID_ARRIVAL_TIME},
            {condition: parseInt(arrivalTime) >= 0 && parseInt(arrivalTime) <= 2359, errorMessage: Errors.INVALID_ARRIVAL_TIME}
        ];
        checks.forEach(check => {
            if (!check.condition) {
                throw new Error(check.errorMessage);
            }
        });
        return true;
}
module.exports = {validateArrivalTime};