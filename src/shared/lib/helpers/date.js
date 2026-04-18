export const getLocaleDate = (date) => {
  if (!['string', 'Date'].includes(typeof date)) {
    return '';
  }

  const currentDate = new Date(date);

  return new Intl.DateTimeFormat('ru').format(currentDate);
};
