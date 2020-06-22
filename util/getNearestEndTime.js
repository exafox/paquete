import getHours from 'date-fns/getHours';
import getMinutes from 'date-fns/getMinutes';

/**
 * Returns a time rounded up to the nearest quarter hour block.
 * @param {Date} endTime
 * @returns {Date}
 */
const getNearestEndTime = (endTime, toHalfHour = false) => {
  const time = new Date(endTime);
  const minutes = getMinutes(time);
  if (minutes > 0) {
    time.setMinutes(toHalfHour ? 30 : 15);
  }
  if (minutes > 15) {
    time.setMinutes(30);
  }
  if (minutes > 30) {
    if (toHalfHour) {
      time.setMinutes(0);
      time.setHours(getHours(time) + 1);
    } else {
      time.setMinutes(45);
    }
  }
  if (minutes > 45) {
    time.setMinutes(0);
    time.setHours(getHours(time) + 1);
  }
  return time;
};

export default getNearestEndTime;
