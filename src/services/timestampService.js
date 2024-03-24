const toMidnightTimestamp = (dateString) => {
  const year = dateString.slice(0, 4);
  const month = dateString.slice(4, 6) - 1;
  const day = dateString.slice(6, 8);

  const date = new Date(year, month, day);
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
}

const addIntervalToDate = (timestamp, interval) => {
  const date = new Date(timestamp);
  date.setMinutes(date.getMinutes() + interval);
  return date.toISOString();
}

module.exports = { toMidnightTimestamp, addIntervalToDate };
