import { format } from 'date-fns-tz';

/**
 * Takes a date object and returns it as a formatted string.
 * @param {Date} date
 * @returns {string}
 */
function formatDate(date) {
  return format(date, 'h:mm a', { timeZone: 'America/New_York' });
}

export default formatDate;
