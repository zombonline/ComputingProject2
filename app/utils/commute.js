import fetch from "node-fetch";
import { getDateYYYYMMDD } from "./helperFunctions";
import CryptoJS from "crypto-js";
import { saveCommute, saveCommuteToFirestore } from "./accountStorage";
import * as Notifications from "expo-notifications";
export class Commute {
  constructor(
    name,
    origin,
    originLatLong,
    destination,
    destinationLatLong,
    arrivalTime,
    days,
    journeyId,
    duration,
    commuteId
  ) {
    this.name = name;
    this.origin = origin;
    this.originLatLong = originLatLong;
    this.destination = destination;
    this.destinationLatLong = destinationLatLong;
    this.arrivalTime = arrivalTime;
    this.days = days;
    this.journeyId = journeyId;
    this.duration = duration;
    this.commuteId = commuteId;
  }
  async init() {
    if (isNaN(this.duration) || this.duration < 1) {
      this.duration = await Commute.getAverageJourneyDuration(
        this.originLatLong,
        this.destinationLatLong,
        this.arrivalTime,
        20,
        this.journeyId
      );
    }
    this.commuteId = this.generateCommuteId();
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
    const dataString = `${this.journeyId}_${this.arrivalTime}_${this.days
      .sort()
      .join("")}`;
    return CryptoJS.MD5(dataString).toString();
  }
  /**
   * Returns the duration of the journey in minutes.
   * @param {Date} date - The date to check.
   * @returns {number} - The duration of the journey in minutes.
   */
  async checkJourneyDuration(date) {
    const journeys = await Commute.getUniqueJourneys(
      this.origin,
      this.destination,
      this.arrivalTime,
      getDateYYYYMMDD(date)
    );
    if (journeys == null) {
      return null;
    }
    for (let i = 0; i < journeys.length; i++) {
      if (Commute.buildJourneyId(journeys[i]) != this.journeyId) { continue; }
      return journeys[i]["duration"];
    }
  }
  /**
   * Checks if the commute is delayed by comparing the average duration with today's duration.
   * If the delay is greater than 0, it sends a notification. If the duration is not found, it sends a notification.
   * @param {Date} date - The date to check.
   */
  async checkForDelay(date) {
    const todaysDuration = await Commute.getJourneyDuration(
      this.originLatLong,
      this.destinationLatLong,
      this.arrivalTime,
      getDateYYYYMMDD(date),
      this.journeyId
    );
    journeyParams = {
      origin: this.origin,
      originLatLong: this.originLatLong,
      destination: this.destination,
      destinationLatLong: this.destinationLatLong,
      arrivalTime: this.arrivalTime,
      days: JSON.stringify(this.days),
      journeyId: this.journeyId,
      commuteId: this.commuteId,
      duration: this.duration
    }
    if (todaysDuration == null) {
      await Notifications.presentNotificationAsync({
        title: "Your commute might be disrupted!",
        body: "Your usual commute might be disrupted. Press for alternate journeys.",
        data: {
          screen: "altJourneys",
          params: journeyParams
        },
      });
    }
    if (delay > 0) {
      await Notifications.presentNotificationAsync({
        title: "Your commute is delayed!",
        body:
          "Your usual commute is delayed by " +
          delay +
          " minutes. Press for alternate journeys.",
        data: {
          screen: "altJourneys",
          params: journeyParams
        },
      });
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
    journey.legs.forEach((leg) => {
      const depNaptanId = leg["departurePoint"]["naptanId"];
      const arrNaptanId = leg["arrivalPoint"]["naptanId"];
      const mode = leg["mode"]["id"];
      if (depNaptanId != prevNaptanId && depNaptanId != undefined) {
        journeyId += depNaptanId;
        prevNaptanId = depNaptanId;
      }
      if (depNaptanId != undefined && arrNaptanId != undefined) {
        journeyId += mode;
      }
      if (arrNaptanId != prevNaptanId && arrNaptanId != undefined) {
        journeyId += arrNaptanId;
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
  static async getAverageJourneyDuration(
    origin,
    destination,
    arrivalTime,
    iterations,
    journeyId
  ) {
    console.log("Getting average commute duration");
    let promises = [];
    let dateToCheck = new Date();
    for (let i = 0; i < iterations; i++) {
      promises.push(
        Commute.getJourneyDuration(
          origin,
          destination,
          arrivalTime,
          getDateYYYYMMDD(dateToCheck),
          journeyId
        )
      );
      dateToCheck.setDate(dateToCheck.getDate() + 1);
    }
    const results = await Promise.allSettled(promises);
    const successfulDurations = results
      .filter((r) => r.status === "fulfilled")
      .filter((r) => r.value !== null)
      .map((r) => r.value);

    return successfulDurations.sort()[
      Math.floor(successfulDurations.length / 2)
    ];
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
  static async getAllUniqueJourneys(
    origin,
    destination,
    arrivalTime,
    daysList
  ) {
    daysList.sort();
    let promises = [];
    let dateToCheck = new Date();
    dateToCheck.setDate(dateToCheck.getDate() - dateToCheck.getDay()); //set to Sunday
    let uniqueJourneys = [];
    let uniqueJourneyIds = [];
    let allJourneys = [];
    for (let i = 0; i < 7; i++) {
      if (!daysList.includes(i)) { continue; }
      promises.push(
        Commute.getUniqueJourneys(
          origin,
          destination,
          arrivalTime,
          getDateYYYYMMDD(dateToCheck)
        )
      );
      dateToCheck.setDate(dateToCheck.getDate() + 1);
    }
    const results = await Promise.allSettled(promises);
    for (let i = 0; i < results.length; i++) {
      if (results[i].status != "fulfilled") { continue; }
      allJourneys = allJourneys.concat(results[i].value);
    }
    for (let i = 0; i < allJourneys.length; i++) {
      const id = Commute.buildJourneyId(allJourneys[i]);
      if (uniqueJourneyIds.includes(id)) { continue; }
      uniqueJourneyIds.push(id);
      uniqueJourneys.push(allJourneys[i]);
    }
    return uniqueJourneys;
  }

  static async getUniqueJourneys(origin, destination, arrivalTime, date) {
    origin = encodeURIComponent(origin);
    destination = encodeURIComponent(destination);
    const params = new URLSearchParams({
      time: arrivalTime,
      timeIs: "Arriving",
      date: date,
    });
    const response = await fetch(
      `https://api.tfl.gov.uk/Journey/JourneyResults/${origin}/to/${destination}?${params}`
    );
    const data = await response.json();
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
  static async getJourneyDuration(
    origin,
    destination,
    arrivalTime,
    arrivalDate,
    journeyId
  ) {
    const params = new URLSearchParams({
      time: arrivalTime,
      timeIs: "Arriving",
      date: arrivalDate,
    });
    const response = await fetch(
      `https://api.tfl.gov.uk/Journey/JourneyResults/${origin}/to/${destination}?${params}`
    );
    data = await response.json();
    for (let i = 0; i < data["journeys"].length; i++) {
      let id = Commute.buildJourneyId(data["journeys"][i]);
      if (id == journeyId) {
        return data["journeys"][i]["duration"];
      }
    }
    return null;
  }
}

module.exports = Commute;
