import Commute from '../Commute';
import { getDateYYYYMMDD } from '../helperFunctions';
const exampleApiCall = require('./exampleApiCall.json');

jest.setTimeout(30000);


it('getCommuteDuration works', async () => {
  expect(Commute.getCommuteDuration("e162aj", "w1d1au", "0900", getDateYYYYMMDD(new Date()))).resolves.toBeGreaterThanOrEqual(0);}
);

it('buildJourneyID works', async () => {
  const result = Commute.buildJourneyID(exampleApiCall["journeys"][0]);
  expect(result).toBe("fa82b09ba4db3f8478fff46cee5ffbdd");
});

it('getAverageCommuteDuration works', async () => {
  const result = await Commute.getAverageCommuteDuration("e162aj", "w1d1au", "0900", 20);
  expect(result).toBeGreaterThan(35);
  expect(result).toBeLessThan(50);
});

//CHECK ARRIVAL TIMES
it('Arrival Time out of 24hr range', () => {
  expect(() => {Commute.validateArrivalTime("2400")}).toThrow("Invalid arrival time");
});

//CHECK LOCATION
it('Location found', async () => {
  const result = await Commute.validateLocation("E162FD");
  expect(result).toBeGreaterThan(0); 
});


