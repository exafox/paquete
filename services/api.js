import axios from 'axios';

const baseURL = process.env.API_URL || '';
const headers = {
  'X-Requested-With': 'XMLHttpRequest',
  'Content-Type': 'application/json',
};

const api = axios.create({ baseURL, headers });

export const fetchData = async (params) => {
  const { data } = await api.get('/events.json');
  return data.map((item) => {
    const copyOfItem = {
      ...item,
      startTime: new Date(item['start-time']),
      endTime: new Date(item['end-time']),
    };
    delete copyOfItem['start-time'];
    delete copyOfItem['end-time'];
    return copyOfItem;
  });
};

export default {
  fetchData,
};
