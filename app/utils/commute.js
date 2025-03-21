import fetch from 'node-fetch';
import { getDateYYYYMMDD } from './helperFunctions';
import CryptoJS from "crypto-js";
import { saveCommute, saveCommuteToFirestore } from "./accountStorage";

base_url = "https://api.tfl.gov.uk/Journey/JourneyResults"
export class Commute {
    constructor(name, origin, originLatLong, destination, destinationLatLong, arrivalTime, days, journeyId) {
        this.name = name;
        this.origin = origin;
        this.originLatLong = originLatLong;
        this.destination = destination;
        this.destinationLatLong = destinationLatLong;
        this.arrivalTime = arrivalTime;
        this.days = days;
        this.journeyId = journeyId;
        this.duration = null;
        this.commuteId = this.generateCommuteId();
        console.log("Commute created. " + origin + " to " + destination + " at " + arrivalTime + " on " + days + " with ID " + journeyId)
    }
    async init(){
        this.duration = await Commute.getAverageJourneyDuration(this.origin, this.destination, this.arrivalTime, 20, this.journeyId);
        console.log("Commute duration: " + this.duration);
        this.save();
    }
    /**
     * Saves the commute instance to local storage.
     * @returns {Promise<void>}
     */
    async save() {
        try {
            await saveCommute(this);
            console.log(`Commute ${this.commuteId} saved successfully.`);
        } catch (error) {
            console.error("Error saving commute:", error);
        }
        try {
            await saveCommuteToFirestore(this);
            console.log(`Commute ${this.commuteId} saved successfully.`);
        } catch (error) {
            console.error("Error saving commute:", error);
        }
    }
    /**
     * Generates a unique commute ID based on journeyID, arrival time, and days.
     * @returns {string} - A unique commute identifier.
     */
    generateCommuteId() {
        const dataString = `${this.journeyId}_${this.arrivalTime}_${this.days.sort().join("")}`;
        return CryptoJS.MD5(dataString).toString();
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
            if(Commute.buildJourneyId(journeys[i]) == this.journeyId){
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
    static buildJourneyId(journey) {
        let journeyId = "";
        let prevNaptanId = "";
        journey.legs.forEach(leg => {
            const depNaptanId = leg["departurePoint"]["naptanId"];
            const arrNaptanId = leg["arrivalPoint"]["naptanId"];
            const mode = leg["mode"]["id"];
            if(depNaptanId != prevNaptanId && depNaptanId != undefined){
                journeyId += depNaptanId
                prevNaptanId = depNaptanId;
            }
            if(depNaptanId !=undefined && arrNaptanId != undefined){
                journeyId += mode;
            }
            if(arrNaptanId != prevNaptanId && arrNaptanId != undefined){
                journeyId += arrNaptanId
                prevNaptanId = arrNaptanId;
            }
        });
        const hash = CryptoJS.MD5(journeyId).toString();
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
    static async getAverageJourneyDuration(origin, destination, arrivalTime, iterations, journeyId){
        console.log("Getting average commute duration")
        let promises = []
        let dateToCheck = new Date();
        for(let i = 0; i < iterations; i++) {
            promises.push(Commute.getJourneyDuration(origin, destination, arrivalTime, getDateYYYYMMDD(dateToCheck), journeyId));
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
        console.log("Getting all unique journeys");
        daysList.sort();
        let promises = [];
        let dateToCheck = new Date();
        console.log(dateToCheck)
        dateToCheck.setDate(dateToCheck.getDate() - dateToCheck.getDay()); //set to Sunday
        let uniqueJourneys = [];
        let uniqueJourneyIds = [];
        let allJourneys = [];
        for(let i = 0; i < 7; i++) {
            if(daysList.includes(i)){
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
        console.log("finished getting all journeys, removing dupes")
        for(let i = 0; i < allJourneys.length; i++){
            const id = Commute.buildJourneyId(allJourneys[i]);
            console.log(id);
            if(!uniqueJourneyIds.includes(id)){
                uniqueJourneyIds.push(id);
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
    static async getJourneyDuration(origin, destination, arrivalTime, arrivalDate, journeyId){
        const params = new URLSearchParams({
            time: arrivalTime,        
            timeIs: "Arriving",
            date: arrivalDate,
        });
        const response = await fetch(`https://api.tfl.gov.uk/Journey/JourneyResults/${origin}/to/${destination}?${params}`);
        data = await response.json();
        for(let i = 0; i < data["journeys"].length; i++){
            let id = Commute.buildJourneyId(data["journeys"][i])
            if(id == journeyId)
            {
                return await data["journeys"][i]["duration"];
            }
        }
        return null;
    }
}

module.exports = Commute;
