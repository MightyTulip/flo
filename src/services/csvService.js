const csv = require('csv-parser');
const fs = require('fs');
const timestampService = require('./timestampService');

const INTERVAL_CONSTANT = 1440;
const NMI_DATA_DETAIL_RECORD = '200';
const INTERVAL_DATA_RECORD = '300';

const parse = (csvFile) => {
  return new Promise((resolve, reject) => {
    let nmiNumber;
    let intervalLength;
    const cache  = {};
    fs.createReadStream(csvFile)
      .pipe(csv({
        headers: false
      }))
      .on('data', (row) => {
        if (row[0] === NMI_DATA_DETAIL_RECORD) {
          nmiNumber = row[1].replace(/\D/g, '');
          intervalLength = row[8];
        } else if (row[0] === INTERVAL_DATA_RECORD) { 
          let intervalCounter = 0;
          let timeStamp = timestampService.toMidnightTimestamp(row[1]);

          for (let i = 2; i < Object.keys(row).length - 5; i++) {
            timeStamp = timestampService.addIntervalToDate(timeStamp, parseInt(intervalLength));
            const uniqueConstraint = nmiNumber + timeStamp;
            cache[uniqueConstraint] = [nmiNumber, timeStamp, row[i]];
            intervalCounter += 1;
          }
          if (intervalCounter !== (INTERVAL_CONSTANT / intervalLength)) {
            reject('Invalid interval count');
          }
        }
      })
      .on('end', () => {
        resolve(Object.values(cache));
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

module.exports = { parse };
