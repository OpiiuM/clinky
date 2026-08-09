// Cloudflare Worker → blackbit.exchange (работает и в dev, и в prod)
const ECURRENCY_URL =
  'https://white-butterfly-78d2.nnmamaenko.workers.dev/site/v2/orders/book?currency_pair=6&depth=100';

const CBR_URL = 'https://www.cbr-xml-daily.ru/daily_json.js';

async function fetchEcurrency() {
  const response = await fetch(ECURRENCY_URL);

  if (!response.ok) {
    throw new Error(`Не удалось получить курс ecurrency (${response.status})`);
  }

  const data = await response.json();

  if (data?.result !== 'ok' || typeof data.last_rate !== 'number') {
    throw new Error('Некорректный ответ BlackBit');
  }

  return {
    id: 'ecurrency',
    label: 'Ecurrency',
    rate: data.last_rate,
    fetchedAt: new Date(),
  };
}

async function fetchUsd() {
  const response = await fetch(CBR_URL);

  if (!response.ok) {
    throw new Error(`Не удалось получить курс доллара (${response.status})`);
  }

  const data = await response.json();
  const usd = data?.Valute?.USD;

  if (typeof usd?.Value !== 'number' || typeof usd?.Previous !== 'number') {
    throw new Error('Некорректный ответ ЦБ');
  }

  const change = usd.Value - usd.Previous;
  const changePercent = (change / usd.Previous) * 100;

  return {
    id: 'usd',
    label: 'Доллар',
    unit: 'RUB',
    rate: usd.Value,
    previous: usd.Previous,
    change,
    changePercent,
    fetchedAt: new Date(),
  };
}

export default {
  fetchEcurrency,
  fetchUsd,
};
