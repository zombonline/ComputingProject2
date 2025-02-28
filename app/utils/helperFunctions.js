function getDateYYYYMMDD(inputDate){
    const yyyy = inputDate.getFullYear();
    const mm = String(inputDate.getMonth() + 1).padStart(2, "0");
    const dd = String(inputDate.getDate()).padStart(2, "0");

    return `${yyyy}${mm}${dd}`;
}

module.exports = {getDateYYYYMMDD};