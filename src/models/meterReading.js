const pool = require('../postgres/db');
const format = require('pg-format');

const QUERY_INSERT_STATEMENT = `
  INSERT INTO meter_readings (nmi, timestamp, consumption) 
  VALUES %L 
  ON CONFLICT (nmi, timestamp) 
  DO UPDATE SET 
    consumption = EXCLUDED.consumption
  WHERE meter_readings.consumption <> EXCLUDED.consumption`;

class MeterReading {
  static async insertData(data) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const query = format(QUERY_INSERT_STATEMENT, data);
      await client.query(query);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = MeterReading;
