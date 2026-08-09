import { FirebaseClient } from './FirebaseClient';

// Cloudflare Worker → blackbit.exchange (работает и в dev, и в prod)
const ECURRENCY_URL =
  'https://white-butterfly-78d2.nnmamaenko.workers.dev/site/v2/orders/book?currency_pair=6&depth=100';

const CBR_URL = 'https://www.cbr-xml-daily.ru/daily_json.js';

class CurrenciesService extends FirebaseClient {
  getMonthKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  async listMonthlyKeys() {
    try {
      const data = await this.$get('currencies/ecurrency/monthly');
      const current = this.getMonthKey();
      const keys = Object.keys(data || {}).filter((key) => /^\d{4}-\d{2}$/.test(key));

      if (!keys.includes(current)) {
        keys.push(current);
      }

      return keys.sort((a, b) => b.localeCompare(a));
    } catch (error) {
      console.error(error);
      return [this.getMonthKey()];
    }
  }

  async getMonthlyStats(monthKey = this.getMonthKey()) {
    try {
      const data = await this.$get(`currencies/ecurrency/monthly/${monthKey}`);

      if (typeof data?.max !== 'number' || typeof data?.min !== 'number') {
        return null;
      }

      return {
        max: data.max,
        min: data.min,
        maxAt: data.maxAt || null,
        minAt: data.minAt || null,
        updatedAt: data.updatedAt || null,
        monthKey,
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async updateMonthlyStats(rate) {
    if (typeof rate !== 'number' || !Number.isFinite(rate)) {
      return null;
    }

    const monthKey = this.getMonthKey();
    const now = new Date().toISOString();
    const current = await this.$get(`currencies/ecurrency/monthly/${monthKey}`);
    const hasStats = typeof current?.max === 'number' && typeof current?.min === 'number';

    const next = {
      max: hasStats ? Math.max(current.max, rate) : rate,
      min: hasStats ? Math.min(current.min, rate) : rate,
      maxAt: !hasStats || rate > current.max ? now : current.maxAt || now,
      minAt: !hasStats || rate < current.min ? now : current.minAt || now,
      updatedAt: now,
    };

    await this.$create(`currencies/ecurrency/monthly/${monthKey}`, next);

    return {
      ...next,
      monthKey,
    };
  }

  async fetchEcurrency() {
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

  async fetchUsd() {
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
}

export default new CurrenciesService();
