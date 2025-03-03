import fetch from 'node-fetch';
import { getDateYYYYMMDD } from './helperFunctions';
import CryptoJS from "crypto-js";

base_url = "https://api.tfl.gov.uk/Journey/JourneyResults"


const Errors = {
    INVALID_ARRIVAL_TIME: "Invalid arrival time",
    INVALID_ORIGIN: "Invalid origin",
    INVALID_DESTINATION: "Invalid destination",
}

class Commute {
    constructor(origin, destination, arrivalTime) {
        this.origin = origin;
        this.destination = destination;
        this.arrivalTime = arrivalTime;
        this.duration;
        this.journeyID;
    }


    /**
     * Returns a journeyID using MD5 hash of the journey details. Journey Details are made up of
     * departure and arrival naptanIDs and modes of transport between them.
     * @param {object} journey - The journey object from the TFL API.
     * @returns {string} - The MD5 hash of the journey details.
     */
    static buildJourneyID(journey) {
        id = "";
        prevNaptanID = "";
        journey.legs.forEach(leg => {
            depNaptanID = leg["departurePoint"]["naptanId"];
            arrNaptanID = leg["arrivalPoint"]["naptanId"];
            mode = leg["mode"]["id"];
            if(depNaptanID != prevNaptanID && depNaptanID != undefined){
                id += depNaptanID
                prevNaptanID = depNaptanID;
            }
            if(depNaptanID !=undefined && arrNaptanID != undefined){
                id += mode;
            }
            if(arrNaptanID != prevNaptanID && arrNaptanID != undefined){
                id += arrNaptanID
                prevNaptanID = arrNaptanID;
            }
        });
        const hash = CryptoJS.MD5(id).toString();
        return hash;
    }

    /**
     * Validates the arrival time. Arrival time must be a string of length 4, containing only numbers
     * and be between 0000 and 2359.
     * @param {string} arrivalTime - The arrival time to validate.
     * @throws {Error} - If the arrival time is invalid.
     * @returns {boolean} - True if the arrival time is valid.
     */
    static validateArrivalTime(arrivalTime){
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

    static async validateLocation(location){
        location = encodeURIComponent(location);
        console.log(`https://api.tfl.gov.uk/StopPoint/Search/${location}`);
        const response = await fetch(`https://api.tfl.gov.uk/StopPoint/Search/${location}`);
        data = await response.json();
        return data["total"];
    }

    /**
     * Returns the standard commute duration between two locations at a given arrival time.
     * Standard commute duration is the median of the commute durations at the given time over a number of days.
     * @param {string} origin - The origin
     * @param {string} destination - The destination
     * @param {string} arrivalTime - The arrival time
     * @param {number} iterations - The number of days to check
     * @returns {number} - The median of the commute durations.
     * @throws {Error} - If the API call fails.
     */
    static async getAverageCommuteDuration(origin, destination, arrivalTime, iterations){
        promises = []
        dateToCheck = new Date();
        for(let i = 0; i < iterations; i++) {
            promises.push(Commute.getCommuteDuration(origin, destination, arrivalTime, getDateYYYYMMDD(dateToCheck)));
            dateToCheck.setDate(dateToCheck.getDate() + 1);
        }
        try{
            const results = await Promise.allSettled(promises);            
            const successfulDurations = results
                .filter(r => r.status === "fulfilled")
                .map(r => r.value);
            return successfulDurations.sort()[Math.floor(successfulDurations.length/2)];
        } catch (error) {
            throw new Error(error);
        }

    }

    /**
     * Returns the commute duration between two locations at a given arrival time and date.
     * @param {string} origin - The origin
     * @param {string} destination - The destination
     * @param {string} arrivalTime - The arrival time (HHMM)
     * @param {string} arrivalDate - The arrival date (YYYYMMDD)
     * @returns {number} - The commute duration in minutes.
     * @throws {Error} - If the API call fails. 
     */
    static async getCommuteDuration(origin, destination, arrivalTime, arrivialDate){
        const params = new URLSearchParams({
            time: arrivalTime,        
            timeIs: "Arriving",
            date: arrivialDate,
        });
        const response = await fetch(`https://api.tfl.gov.uk/Journey/JourneyResults/${origin}/to/${destination}?${params}`);
        data = await response.json();
        return await data["journeys"][0]["duration"]; //FIX HERE (WE SHOULDNT JUST BE CHECKING THE FIRST JOURNEY) (USE NAPTAN IDS)
    }
    static async testFunctionForReactButton(){
        console.log("CALLING FUNCTION FROM COMMUTE.JS FILE");
    }
}

module.exports = Commute;