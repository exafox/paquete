import axios from 'axios';
import get from 'lodash/get';

const apiKey = process.env.GOOGLE_API_KEY;
const baseURL = 'https://www.googleapis.com/youtube/v3';
const headers = {
  'X-Requested-With': 'XMLHttpRequest',
  'Content-Type': 'application/json',
};

const api = axios.create({
  baseURL,
  headers,
});

export const fetchChannelLatestUploads = async (channelUsername) => {
  const { data } = await api.get(
    `/channels?key=${apiKey}&part=contentDetails&forUsername=${channelUsername}`
  );
  return data;
};

const BOSTON_GLOBE_UPLOADS_PLAYLIST = 'UUcNkwfTQuXAxAFwoAUHweJA';
export const fetchLatestPlaylistVideos = async (
  playlistId = BOSTON_GLOBE_UPLOADS_PLAYLIST,
  maxResults = 1
) => {
  const { data } = await api.get(
    `/playlistItems?key=${apiKey}&playlistId=${playlistId}` +
      `&maxResults=${maxResults}&part=snippet,contentDetails` +
      `&fields=items(contentDetails(videoId),snippet(description,title))`
  );
  return get(data, 'items', []);
};

export const fetchEmbeddableStatus = async (videoId) => {
  const { data } = await api.get(
    `/videos?id=${videoId}&key=${apiKey}&part=status&fields=items(status(embeddable))`
  );
  return get(data, 'items.0.status.embeddable', false);
};

export default {
  fetchChannelLatestUploads,
  fetchEmbeddableStatus,
  fetchLatestPlaylistVideos,
};
