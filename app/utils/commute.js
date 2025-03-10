import fetch from 'node-fetch';
import { getDateYYYYMMDD } from './helperFunctions';
import CryptoJS from "crypto-js";
base_url = "https://api.tfl.gov.uk/Journey/JourneyResults"
const Errors = {
    INVALID_ARRIVAL_TIME: "Invalid arrival time",
    INVALID_ORIGIN: "Invalid origin",
    INVALID_DESTINATION: "Invalid destination",
}

export class Commute {
    constructor(origin, destination, arrivalTime, days, journeyID) {
        this.origin = origin;
        this.destination = destination;
        this.arrivalTime = arrivalTime;
        this.days = days;
        this.duration = null;
        this.journeyID = journeyID;
        console.log("Commute created. " + origin + " to " + destination + " at " + arrivalTime + " on " + days + " with ID" + journeyID)
    }
    /**
     * Returns a journeyID using MD5 hash of the journey details. Journey Details are made up of
     * departure and arrival naptanIDs and modes of transport between them.
     * @param {object} journey - The journey object from the TFL API.
     * @returns {string} - The MD5 hash of the journey details.
     */
    static buildJourneyID(journey) {
        id = "";
        prevNaptainID = "";
        journey.legs.forEach(leg => {
            depNaptanID = leg["departurePoint"]["naptanId"];
            arrNaptanID = leg["arrivalPoint"]["naptanId"];
            mode = leg["mode"]["id"];
            if(depNaptanID != prevNaptainID && depNaptanID != undefined){
                id += depNaptanID
                prevNaptainID = depNaptanID;
            }
            if(depNaptanID !=undefined && arrNaptanID != undefined){
                id += mode;
            }
            if(arrNaptanID != prevNaptainID && arrNaptanID != undefined){
                id += arrNaptanID
                prevNaptainID = arrNaptanID;
            }
        });
        const hash = CryptoJS.MD5(id).toString();
        return hash;
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
     * Returns all unique commutes between two locations at a given arrival time that occur on days listed in daysList.
     * @param {string} origin - The origin
     * @param {string} destination - The destination
     * @param {string} arrivalTime - The arrival time (HHMM)
     * @param {string} daysList - List of days of the week for the commute [0, 1, 4] would be Sunday, Monday, Thursday
     * @returns {Array} - An array of unique commutes.
     * @throws {Error} - If the API call fails.
     **/
    static async getAllUniqueCommutes(origin, destination, arrivalTime, daysList){
        console.log("Getting all unique commutes");
        daysList.sort();
        promises = []
        dateToCheck = new Date();
        dateToCheck.setDate(dateToCheck.getDate() - dateToCheck.getDay()); //set to Sunday
        uniqueJourneys = [];
        uniqueJourneyIDs = [];
        allJourneys = [];
        for(let i = 0; i < 7; i++) {
            if(daysList.includes(i)){
                promises.push(Commute.getUniqueCommutes(origin, destination, arrivalTime, getDateYYYYMMDD(dateToCheck)));
            }
            dateToCheck.setDate(dateToCheck.getDate() + 1);
        }
        try{
            const results = await Promise.allSettled(promises);        
            for(let i = 0; i < results.length; i++){
                if(results[i].status === "fulfilled"){
                    allJourneys = allJourneys.concat(results[i].value);
                }
            }    
        } catch (error) {
            throw new Error(error);
        }
        for(let i = 0; i < allJourneys.length; i++){
            const id = Commute.buildJourneyID(allJourneys[i]);
            if(!uniqueJourneyIDs.includes(id)){
                uniqueJourneyIDs.push(id);
                uniqueJourneys.push(allJourneys[i]);
            }
        }
        return uniqueJourneys;
    }
    static async getUniqueCommutes(origin, destination, arrivalTime, date){
        origin = encodeURIComponent(origin);
        console.log(destination)
        destination = encodeURIComponent(destination);
        const params = new URLSearchParams({
            time: arrivalTime,        
            timeIs: "Arriving",
            date: date,
        });
        console.log(`https://api.tfl.gov.uk/Journey/JourneyResults/${origin}/to/${destination}?${params}`);
        const response = await fetch(`https://api.tfl.gov.uk/Journey/JourneyResults/${origin}/to/${destination}?${params}`);
        data = await response.json();
        return data["journeys"];
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
    static async getCommuteDuration(origin, destination, arrivalTime, arrivalDate){
        const params = new URLSearchParams({
            time: arrivalTime,        
            timeIs: "Arriving",
            date: arrivalDate,
        });
        const response = await fetch(`https://api.tfl.gov.uk/Journey/JourneyResults/${origin}/to/${destination}?${params}`);
        data = await response.json();
        return await data["journeys"][0]["duration"];
    }
}
