
/** 
 * Converts a date object to a string in the format YYYYMMDD.
 * @param {Date} inputDate - The date object to convert.
 * @returns {string} - The date in YYYYMMDD format.
 */
function getDateYYYYMMDD(inputDate) {
  const yyyy = inputDate.getFullYear();
  const mm = String(inputDate.getMonth() + 1).padStart(2, "0");
  const dd = String(inputDate.getDate()).padStart(2, "0");

  return `${yyyy}${mm}${dd}`;
}

/**
 * Fetches the latitude and longitude of a given location using the Nominatim API.
 * @param {string} location - The location to search for.
 * @returns {Promise<string|null>} - A promise that resolves to a string containing the latitude and longitude, or null if not found.
 */
async function getLatLong(location) {
  location = encodeURIComponent(location);
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${location}&format=json`,
      {
        headers: {
          "User-Agent": "Commuty/0.1 bradleyj9834@hotmail.com",
        },
      }
    );
    const data = await response.json();
    if (!data || data.length === 0) {
      console.log("No results found for " + location);
      return null;
    }
    return data[0]["lat"] + "," + data[0]["lon"];
  } catch (error) {
    console.log(error);
    console.log("couldnt get anything from " + location);
    return null;
  }
}
module.exports = { getDateYYYYMMDD, getLatLong };
