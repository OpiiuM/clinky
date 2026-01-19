export const FILTERS = 'filters';

export function getFilters() {
  const fitlers = localStorage.getItem(FILTERS);

  if (fitlers === 'undefined') return {};

  return JSON.parse(fitlers);
}

export function setFilters(filters) {
  localStorage.setItem(FILTERS, JSON.stringify(filters));
}

export function removeFilters() {
  localStorage.removeItem(FILTERS);
}
