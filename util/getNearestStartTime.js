import getMinutes from 'date-fns/getMinutes';

/**
 * Returns a time rounded down to the nearest quarter half hour block.
 * @param {Date} startTime
 * @returns {Date}
 */
const getNearestStartTime = (startTime, toHalfHour = false) => {
  const time = new Date(startTime);
  const minutes = getMinutes(time);
  if (minutes >= 0) {
    time.setMinutes(0);
  }
  if (minutes >= 15 && !toHalfHour) {
    time.setMinutes(15);
  }
  if (minutes >= 30) {
    time.setMinutes(30);
  }
  if (minutes >= 45 && !toHalfHour) {
    time.setMinutes(45);
  }
  return time;
};

export default getNearestStartTime;
