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

async function validateLocation(location) {
    location = encodeURIComponent(location);
    testPoints = ["HA04AP", "E16DB"];
    for(let i = 0; i < testPoints.length; i++){
        const url = `https://api.tfl.gov.uk/Journey/JourneyResults/${location}/to/${testPoints[i]}`;
        console.log(url); // Debugging URL
        const response = await fetch(url);
        if (!response.ok) continue; // API call failed (invalid location)
        const data = await response.json();
        return data.journeys && data.journeys.length > 0; // True if journeys exist

    }
    return false;
}

module.exports = {validateArrivalTime, validateLocation};