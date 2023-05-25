/* eslint-disable valid-typeof */
import { DEFAULT_CATEGORY } from '@/common/constants';

const ERROR = {
  date: 'Invalid Date',
};

export const useDates = () => ({
  convert(date) {
    return date.toISOString().slice(0, 10);
  },
});

export const useData = () => ({
  normalizeLinks(links) {
    return Object.keys(links).map((key) => ({
      id: key,
      ...links[key],
    }));
  },

  removeProperty(data, callback) {
    const result = {};

    for (const key in data) {
      const iterator = data[key];

      if (typeof iterator === 'Object') {
        result[key] = this.removeProperty(iterator, callback);
      } else if (!callback(key, data[key])) {
        result[key] = data[key];
      }
    }

    return result;
  },
});

export const useSort = () => ({
  sortDates(a, b) {
    const firstDate = new Date(a.dateCreate);
    const secondDate = new Date(b.dateCreate);

    if ([firstDate, secondDate].includes(ERROR.date)) {
      return false;
    }

    return firstDate - secondDate;
  },

  sortAlphabetic(a, b) {
    return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
  },
});

export const useCategory = () => ({
  setCategory(cats = []) {
    return cats.length ? cats : DEFAULT_CATEGORY;
  },
});
