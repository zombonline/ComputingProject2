import fetch from 'node-fetch';

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
        // this.duration = this.getCommuteDuration();
        this.journeyID;
    }

    buildJourneyID(journey) {
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
        this.journeyID = id;
    }

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
    }

    async getCommuteDuration() {
        const params = new URLSearchParams({
            time: this.arrivalTime,        
            timeIs: "Arriving",
        });
        const response = await fetch(`https://api.tfl.gov.uk/Journey/JourneyResults/${this.origin}/to/${this.destination}?${params}`);
        data = await response.json();
        try{
            this.buildJourneyID(data["journeys"][0]);
            console.log("Journey ID: " + this.journeyID);
        }       
        catch (error) {
            console.log("Error: " + error);
            return -1;
        }
        return await data["journeys"][0]["duration"];
    }
}

module.exports = Commute;