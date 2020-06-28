import axios from 'axios';
import get from 'lodash/get';

const apiKey = process.env.GOOGLE_API_KEY;
const baseURL = 'https://www.googleapis.com/youtube/v3/videos';
const headers = {
  'X-Requested-With': 'XMLHttpRequest',
  'Content-Type': 'application/json',
};

const api = axios.create({
  baseURL,
  headers,
});

export const fetchEmbeddableStatus = async (videoId) => {
  const { data } = await api.get(
    `?id=${videoId}&key=${apiKey}&part=status&fields=items(status(embeddable))`
  );
  return get(data, 'items.0.status.embeddable', false);
};

export default {
  fetchEmbeddableStatus,
};
