import Commute from '../Commute';

it(`Constuctor works`, () => {
  const commute = new Commute();
  expect(commute instanceof Commute).toBe(true);
});

it('getCommuteDuration works', async () => {
  const commute = new Commute("e162aj", "w1d1au", "0800");

  expect(commute.getCommuteDuration()).resolves.toBeGreaterThanOrEqual(0);}
);


//CHECK ARRIVAL TIMES
it('Arrival Time out of 24hr range', () => {
  expect(() => {Commute.validateArrivalTime("2400")}).toThrow("Invalid arrival time");
});


