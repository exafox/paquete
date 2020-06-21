import addMinutes from 'date-fns/addMinutes';
import axios from 'axios';
import get from 'lodash/get';
import { toDate } from 'date-fns-tz';
import hashString from '~/util/hashString';

const url = process.env.SHEETS_URL;

// const baseURL = process.env.API_URL || '';
const headers = {
  'X-Requested-With': 'XMLHttpRequest',
  'Content-Type': 'application/json',
};

const api = axios.create({
  // baseURL,
  headers,
});

const durationToMinutes = (str) => {
  const [hoursStr, minutesStr] = str.split(':');
  const hours = parseInt(hoursStr, 10);
  return hours * 60 + parseInt(minutesStr, 10);
};

const mapEntry = (entry) => {
  const title = get(entry, 'title.$t');
  const startTimeStr = get(entry, 'gsx$starttime.$t', null);
  if (!title || !startTimeStr) return null;

  const id = `${hashString(get(entry, 'id.$t', title))}`;
  const link = get(entry, 'gsx$streamlink.$t', '');
  const channel = get(entry, 'gsx$channel.$t', '');
  const description = get(entry, 'gsx$descriptionoptional.$t', '');
  const descriptionLink = get(entry, 'gsx$descriptionpagelinkoptional.$t', '');
  const donationLink = get(entry, 'gsx$donationpagelinkoptional.$t', '');
  const embedLink = get(entry, 'gsx$embedlink.$t', '');
  const handle = get(entry, 'gsx$handle.$t', '');
  const isFeatured = get(entry, 'gsx$featured.$t') === '1';
  const isAdult = get(entry, 'gsx$adult.$t') === '1';
  const isAudio = get(entry, 'gsx$audio.$t') === '1';
  const isPaywall = get(entry, 'gsx$paywall.$t') === '1';
  const isCharity = get(entry, 'gsx$charity.$t') === '1';
  const isSponsored = get(entry, 'gsx$sponsored.$t') === '1';
  const requiresRegistration = get(entry, 'gsx$registration.$t') === '1';
  const startTime = toDate(new Date(startTimeStr + ' EDT'), {
    timeZone: 'America/New_York',
  });
  const endTimeStr = get(entry, 'gsx$endtime.$t', null);
  const duration = durationToMinutes(
    get(entry, 'gsx$durationoptional.$t') || '1:00'
  );
  const endTime = endTimeStr
    ? toDate(new Date(endTimeStr + ' EDT'), { timeZone: 'America/New_York' })
    : addMinutes(startTime, duration);

  return {
    title,
    id,
    link,
    channel,
    description,
    descriptionLink,
    donationLink,
    embedLink,
    handle,
    startTime,
    endTime,
    isFeatured,
    isAdult,
    isAudio,
    isPaywall,
    isCharity,
    isSponsored,
    requiresRegistration,
  };
};

export const fetchData = async (params) => {
  const { data } = await api.get(url);
  const entries = get(data, 'feed.entry', []);
  return entries.map(mapEntry).filter((item) => item);
};

export default {
  fetchData,
};
