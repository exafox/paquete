import getHours from 'date-fns/getHours';
import getMinutes from 'date-fns/getMinutes';

/**
 * Returns a time rounded up to the nearest half hour block.
 * @param {Date} endTime
 * @returns {Date}
 */
const getNearestEndTime = (endTime) => {
  const time = new Date(endTime);
  const minutes = getMinutes(time);
  if (minutes > 0) {
    time.setMinutes(30);
  }
  if (minutes > 30) {
    time.setMinutes(0);
    time.setHours(getHours(time) + 1);
  }
  return time;
};

export default getNearestEndTime;
