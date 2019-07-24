const MAX_TRUNCATE = 30;

export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const dateString = date.toLocaleTimeString();
  return dateString.split(':').slice(0, 2).join(':');
};

export const truncate = (text) => {
  if (!text) return;
  if (text.length <= MAX_TRUNCATE) return text;
  return `${text.substring(0, MAX_TRUNCATE - 4)} ...`;
};