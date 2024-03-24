const MeterReadingController = require('../../src/controllers/meterReadingController');
const fs = require('fs');
const path = require('path');
const { singleMeterReadingSql } = require('../fixtures/sql');

describe('controller:MeterReadingController', () => {
  let controller;
  let csvService;
  let meterReadingModel;
  let res;

  beforeEach(() => {
    csvService = {
      parse: jest.fn(),
    };
    meterReadingModel = {
      insertData: jest.fn(),
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    controller = new MeterReadingController(csvService, meterReadingModel);
  });

  it('should accept and insert csv correctly', async () => {
    const fixturePath = path.resolve(__dirname, '../fixtures/singleMeterReading.csv');
    const req = {
      files: [{
        path: fixturePath
      }]
    };

    csvService.parse.mockResolvedValue(singleMeterReadingSql);
    meterReadingModel.insertData.mockResolvedValue();
    await controller.uploadAndInsert(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'done' });

    expect(csvService.parse).toHaveBeenCalledWith(req.files[0].path);
    expect(meterReadingModel.insertData).toHaveBeenCalledWith(singleMeterReadingSql);
  });

  it('should throw error when no csv is uploaded', async () => {
    const req = {
      files: []
    };

    const errorResponse = { status: 400, data: { error: 'No file uploaded' } };
    const error = new Error('CSV parsing failed');
    error.response = errorResponse;

    csvService.parse.mockResolvedValue(singleMeterReadingSql);
    meterReadingModel.insertData.mockResolvedValue();
    await controller.uploadAndInsert(req, res);

    expect(csvService.parse).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(errorResponse.status);
    expect(res.json).toHaveBeenCalledWith(errorResponse.data);
    expect(meterReadingModel.insertData).not.toHaveBeenCalled();
  });

  it('should throw error when csv parsing fails and not continue to data insertion', async () => {
    const fixturePath = path.resolve(__dirname, '../fixtures/invalidIntervalReading.csv');
    const req = {
      files: [{
        path: fixturePath
      }]
    };

    const errorResponse = { status: 500, data: { error: 'Internal server error' }};
    const error = new Error('CSV parsing failed');
    error.response = errorResponse;
    jest.spyOn(csvService, 'parse').mockRejectedValueOnce(error)

    await controller.uploadAndInsert(req, res);

    expect(csvService.parse).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(errorResponse.status);
    expect(res.json).toHaveBeenCalledWith(errorResponse.data);
    expect(meterReadingModel.insertData).not.toHaveBeenCalled();
  });

  it('should throw error when csv parsing passes but model insertion fails', async () => {
    const fixturePath = path.resolve(__dirname, '../fixtures/singleMeterReading.csv');
    const req = {
      files: [{
        path: fixturePath
      }]
    };

    const errorResponse = { status: 500, data: { error: 'Internal server error' }};
    const error = new Error('CSV parsing failed');
    error.response = errorResponse;
    jest.spyOn(csvService, 'parse').mockResolvedValue()
    jest.spyOn(meterReadingModel, 'insertData').mockRejectedValueOnce(error);

    await controller.uploadAndInsert(req, res);

    expect(csvService.parse).toHaveBeenCalled();
    expect(meterReadingModel.insertData).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(errorResponse.status);
    expect(res.json).toHaveBeenCalledWith(errorResponse.data);
  });
});