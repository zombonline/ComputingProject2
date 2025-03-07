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

it('get lat long', async () => {
const result = extractFloatLatLong(await Commute.getLatLong("E16 2FD"));
expect(parseFloat(values[0].toFixed(3))).toBeCloseTo(51.506);
expect(parseFloat(values[1].toFixed(3))).toBeCloseTo(0.073);
});

it('get lat long', async () => {
const result = extractFloatLatLong(await Commute.getLatLong("east ferry road, e14"));
expect(parseFloat(values[0].toFixed(3))).toBeCloseTo(51.493);
expect(parseFloat(values[1].toFixed(3))).toBeCloseTo(-0.014);
});

it('get lat long', async () => {
const result = extractFloatLatLong(await Commute.getLatLong("richard hoggart building"));
expect(parseFloat(values[0].toFixed(3))).toBeCloseTo(51.474);
expect(parseFloat(values[1].toFixed(3))).toBeCloseTo(-0.035);
});

it('get lat long', async () => {
const result = extractFloatLatLong(await Commute.getLatLong("Wembley Central Station"));
expect(parseFloat(values[0].toFixed(3))).toBeCloseTo(51.552);
expect(parseFloat(values[1].toFixed(3))).toBeCloseTo(-0.297);
});



function extractFloatLatLong(str) {
parts = str.split(",");
values = [];
parts.forEach(part => {
  values.push(parseFloat(part))
});
return values;
}



