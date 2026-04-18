export const FILTERS = 'filters';

function getFilters() {
  const fitlers = localStorage.getItem(FILTERS);

  if (fitlers === 'undefined') return {};

  return JSON.parse(fitlers);
}

function setFilters(filters) {
  localStorage.setItem(FILTERS, JSON.stringify(filters));
}

function removeFilters() {
  localStorage.removeItem(FILTERS);
}

export default {
  getFilters,
  setFilters,
  removeFilters,
};
