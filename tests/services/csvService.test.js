const csvService = require('../../src/services/csvService');
const { singleMeterReadingSql } = require('../fixtures/sql');
const path = require('path');

describe('service:csvService', () => {
  it('should parse correctly', async () => {
    const fixturePath = path.resolve(__dirname, '../fixtures/singleMeterReading.csv');

    const dataToBeInserted = await csvService.parse(fixturePath);
    expect(dataToBeInserted).toEqual(singleMeterReadingSql);
  });

  it('should throw error if file is null or undefined', async () => {
    await expect(csvService.parse(null)).rejects.toThrow();
    await expect(csvService.parse(undefined)).rejects.toThrow();
  });

  it('should throw error when value does not equal 1440/intervalLength', async () => {
    const fixturePath = path.resolve(__dirname, '../fixtures/invalidIntervalReading.csv');

    await expect(csvService.parse(fixturePath)).rejects.toBe('Invalid interval count');
  });
})