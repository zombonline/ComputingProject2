function getDateYYYYMMDD(inputDate){
    const yyyy = inputDate.getFullYear();
    const mm = String(inputDate.getMonth() + 1).padStart(2, "0");
    const dd = String(inputDate.getDate()).padStart(2, "0");

    return `${yyyy}${mm}${dd}`;
}
export async function getLatLong(location){
    console.log("Getting lat long for " + location)
    location = encodeURIComponent(location);
    try{
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${location}&format=json`,
        {
            headers: {
                'User-Agent': 'Commuty/0.1 bradleyj9834@hotmail.com'
            }
        });
        data = await response.json();
        return data[0]["lat"] + "," + data[0]["lon"];
    } catch (error) {
        console.log(error)
        console.log("couldnt get anything from " + location);
        return null;
    }
}
