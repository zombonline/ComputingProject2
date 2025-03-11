import Commute from '../Commute';
import { getDateYYYYMMDD } from '../helperFunctions';
const exampleApiCall = require('./exampleApiCall.json');
const exampleCommuteFields = require('./exampleCommute.json')
let testCommute = null;
jest.setTimeout(30000);

it('Create a commute', () => {
    testCommute = new Commute(exampleCommuteFields.origin,
        exampleCommuteFields.destination,
        exampleCommuteFields.arrivalTime,
        exampleCommuteFields.days,
        exampleCommuteFields.journeyID);
    expect(testCommute).not.toBeNull();
})
it('Initialize a commute', async () => {
    await testCommute.init();
    expect(testCommute.duration).toBeDefined();
})
it('Check Journey Duration works', async () => {
    expect(await testCommute.checkJourneyDuration(new Date())).toBeGreaterThan(0);
})

//
//it('getCommuteDuration works', async () => {
//  expect(Commute.getJourneyDuration("e162aj", "w1d1au", "0900", getDateYYYYMMDD(new Date()))).resolves.toBeGreaterThanOrEqual(0);}
//);

it('buildJourneyID works', async () => {
  const result = Commute.buildJourneyID(exampleApiCall["journeys"][0]);
  expect(result).toBe("fa82b09ba4db3f8478fff46cee5ffbdd");
});

//it('getAverageCommuteDuration works', async () => {
//  const result = await Commute.getAverageCommuteDuration("e162aj", "w1d1au", "0900", 20, );
//  expect(result).toBeGreaterThan(35);
//  expect(result).toBeLessThan(50);
//});




