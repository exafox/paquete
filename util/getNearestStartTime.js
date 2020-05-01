import getMinutes from 'date-fns/getMinutes';

/**
 * Returns a time rounded down to the nearest half hour block.
 * @param {Date} startTime
 * @returns {Date}
 */
const getNearestStartTime = (startTime) => {
  const time = new Date(startTime);
  const minutes = getMinutes(time);
  if (minutes >= 0) {
    time.setMinutes(0);
  }
  if (minutes >= 30) {
    time.setMinutes(30);
  }
  return time;
};

export default getNearestStartTime;
