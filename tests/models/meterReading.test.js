const { singleMeterReadingSql, extraField } = require('../fixtures/sql');
const db = require('../../src/postgres/db');
const MeterReading = require('../../src/models/meterReading');

jest.mock('../../src/postgres/db', () => {
  const mockPool = {
    connect: jest.fn(),
  };
  return mockPool;
});

describe('model:MeterReading', () => {
  let mockClient;

  beforeEach(() => {
    mockClient = createMockClient();
    db.connect.mockResolvedValue(mockClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should insert correctly', async () => {
    jest.spyOn(mockClient, 'query').mockResolvedValue();
    await MeterReading.insertData(singleMeterReadingSql);
    expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
    expect(mockClient.release).toHaveBeenCalled();
    expect(mockClient.query).not.toHaveBeenCalledWith('ROLLBACK');
  });

  it('should rollback if query is rejected', async () => {
    jest.spyOn(mockClient, 'query').mockRejectedValue(new Error('Query Rejected'));
    await expect(MeterReading.insertData(extraField)).rejects.toThrow();
    expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
    expect(mockClient.release).toHaveBeenCalled();
  });
});

function createMockClient() {
  return {
    query: jest.fn().mockImplementation((queryString, values) => {
      if (queryString === 'COMMIT') return Promise.resolve();
      if (queryString === 'ROLLBACK') return Promise.resolve();
      if (queryString === 'RELEASE') return Promise.resolve();
      return { insertId: 123 };
    }),
    release: jest.fn(),
  };
}
