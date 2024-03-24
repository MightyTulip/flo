const { toMidnightTimestamp, addIntervalToDate } = require('../../src/services/timestampService');

describe('timestampService', () => {
  describe('toMidnightTimestamp', () => {
    it('should convert date string to midnight timestamp', () => {
      const dateString = '20240323';
      const expectedTimestamp = '2024-03-22T13:00:00.000Z'; // To AEST
      expect(toMidnightTimestamp(dateString)).toEqual(expectedTimestamp);
    });

    it('should handle leading zeroes in date string', () => {
      const dateString = '20240101'; 
      const expectedTimestamp = '2023-12-31T13:00:00.000Z'; // To AEST
      expect(toMidnightTimestamp(dateString)).toEqual(expectedTimestamp);
    });
  });

  describe('addIntervalToDate', () => {
    it('should add interval to timestamp', () => {
      const timestamp = '2024-03-23T00:00:00.000Z'; 
      const interval = 60; 
      const expectedTimestamp = '2024-03-23T01:00:00.000Z'; 
      expect(addIntervalToDate(timestamp, interval)).toEqual(expectedTimestamp);
    });

    it('should handle negative intervals', () => {
      const timestamp = '2024-03-23T00:00:00.000Z'; 
      const interval = -30; 
      const expectedTimestamp = '2024-03-22T23:30:00.000Z'; 
      expect(addIntervalToDate(timestamp, interval)).toEqual(expectedTimestamp);
    });
  });
});
