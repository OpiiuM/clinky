export const formatRate = (rate) => {
  if (rate == null) {
    return '—';
  }

  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  }).format(rate);
};

export const formatChange = (change, changePercent) => {
  if (change == null || changePercent == null) {
    return '';
  }

  const sign = change > 0 ? '+' : '';
  const changeText = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(change);
  const percentText = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(changePercent);

  return `${sign}${changeText} (${sign}${percentText}%)`;
};

export const formatTime = (date) => {
  if (!date) {
    return '';
  }

  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
};
