import fetch from 'node-fetch';
import { getDateYYYYMMDD } from './helperFunctions';
import CryptoJS from "crypto-js";
base_url = "https://api.tfl.gov.uk/Journey/JourneyResults"
export class Commute {
    constructor(origin, destination, arrivalTime, days, journeyID) {
        this.origin = origin;
        this.destination = destination;
        this.arrivalTime = arrivalTime;
        this.days = days;
        this.journeyID = journeyID;
        this.duration = null;
        console.log("Commute created. " + origin + " to " + destination + " at " + arrivalTime + " on " + days + " with ID " + journeyID)
    }
    async init(){
        this.duration = await Commute.getAverageJourneyDuration(this.origin, this.destination, this.arrivalTime, 20, this.journeyID);
        console.log("Commute duration: " + this.duration);
    }

    /**
    * Returns the duration of the journey in minutes.
    * @param {Date} date - The date to check.
    * @returns {number} - The duration of the journey in minutes.
    */
    async checkJourneyDuration(date){
        const journeys = await Commute.getUniqueJourneys(this.origin, this.destination, this.arrivalTime, getDateYYYYMMDD(date));
        if(journeys == null)
        {
            return null;
        }
        for(let i = 0; i < journeys.length; i++){
            if(Commute.buildJourneyID(journeys[i]) == this.journeyID){
                console.log("Average duration: " + this.duration + " Today's Duration: " + journeys[i]["duration"])
                return journeys[i]["duration"];
            }
        }
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
     * Returns the standard commute duration between two locations at a given arrival time.
     * Standard commute duration is the median of the commute durations at the given time over a number of days.
     * @param {string} origin - The origin
     * @param {string} destination - The destination
     * @param {string} arrivalTime - The arrival time
     * @param {number} iterations - The number of days to check
     * @returns {number} - The median of the commute durations.
     * @throws {Error} - If the API call fails.
     */
    static async getAverageJourneyDuration(origin, destination, arrivalTime, iterations, journeyID){
        console.log("Getting average commute duration")
        promises = []
        dateToCheck = new Date();
        for(let i = 0; i < iterations; i++) {
            promises.push(Commute.getJourneyDuration(origin, destination, arrivalTime, getDateYYYYMMDD(dateToCheck), journeyID));
            dateToCheck.setDate(dateToCheck.getDate() + 1);
        }
        try{
            console.log("Resolving " + promises.length + " promises")
            const results = await Promise.allSettled(promises);            
            const successfulDurations = results
                .filter(r => r.status === "fulfilled")
                .filter(r => r.value !== null)
                .map(r => r.value);
            console.log("returning median duration of " + successfulDurations.length + " successful results")
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
    static async getAllUniqueJourneys(origin, destination, arrivalTime, daysList){
        console.log("Getting all unique commutes");
        daysList.sort();
        promises = []
        dateToCheck = new Date();
        dateToCheck.setDate(dateToCheck.getDate() - dateToCheck.getDay()); //set to Sunday
        uniqueJourneys = [];
        uniqueJourneyIDs = [];
        allJourneys = [];
        console.log("set upr")
        for(let i = 0; i < 7; i++) {
            if(daysList.includes(i)){
                console.log("adding day promise")
                console.log(getDateYYYYMMDD(dateToCheck))
                promises.push(Commute.getUniqueJourneys(origin, destination, arrivalTime, getDateYYYYMMDD(dateToCheck)));
            }
            dateToCheck.setDate(dateToCheck.getDate() + 1);
        }
        try{
            console.log("attempting to resolve promises")
            const results = await Promise.allSettled(promises);
            console.log("finished resolving promises")

            for(let i = 0; i < results.length; i++){
                if(results[i].status === "fulfilled"){
                    allJourneys = allJourneys.concat(results[i].value);
                }
            }    
        } catch (error) {

            console.log("Error: " + error)
            throw new Error(error);
        }
        for(let i = 0; i < allJourneys.length; i++){
            const id = Commute.buildJourneyID(allJourneys[i]);
            if(!uniqueJourneyIDs.includes(id)){
                uniqueJourneyIDs.push(id);
                uniqueJourneys.push(allJourneys[i]);
            }
        }
        console.log("finished with " + uniqueJourneys.length + " results");
        return uniqueJourneys;
    }

    static async getUniqueJourneys(origin, destination, arrivalTime, date){
        origin = encodeURIComponent(origin);
        destination = encodeURIComponent(destination);
        const params = new URLSearchParams({
            time: arrivalTime,        
            timeIs: "Arriving",
            date: date,
        });
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
    static async getJourneyDuration(origin, destination, arrivalTime, arrivalDate, journeyID){
        const params = new URLSearchParams({
            time: arrivalTime,        
            timeIs: "Arriving",
            date: arrivalDate,
        });
        const response = await fetch(`https://api.tfl.gov.uk/Journey/JourneyResults/${origin}/to/${destination}?${params}`);
        data = await response.json();
        for(let i = 0; i < data["journeys"].length; i++){
            let id = Commute.buildJourneyID(data["journeys"][i])
            if(id == journeyID)
            {
                return await data["journeys"][i]["duration"];
            }
        }
        return null;
    }
}

module.exports = Commute;
