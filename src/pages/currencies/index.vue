<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import TheSidebar from '@/features/links/ui/TheSidebar.vue';
import TheNavigation from '@/features/navigation/ui/TheNavigation.vue';
import { AppButton } from '@/shared/ui';
import { currenciesService } from '@/shared/api';

const fetchers = {
  usd: currenciesService.fetchUsd,
  ecurrency: currenciesService.fetchEcurrency,
};

const currencies = reactive({
  usd: {
    id: 'usd',
    label: 'Доллар',
    unit: 'RUB',
    rate: null,
    previous: null,
    change: null,
    changePercent: null,
    fetchedAt: null,
    error: null,
    isLoading: false,
  },
  ecurrency: {
    id: 'ecurrency',
    label: 'Ecurrency',
    unit: 'USDT',
    rate: null,
    previous: null,
    change: null,
    changePercent: null,
    fetchedAt: null,
    error: null,
    isLoading: false,
  },
});

const ecurrencyAmount = ref('1');
const usdAmount = ref('');
const rubAmount = ref('');
const lastEdited = ref('ecurrency');

const currencyList = computed(() => Object.values(currencies));

const isAnyLoading = computed(() => currencyList.value.some((item) => item.isLoading));

// Ecurrency в USDT ≈ USD → в рублях через курс ЦБ
const rubPerEcurrency = computed(() => {
  const usdRate = currencies.usd.rate;
  const ecurrencyRate = currencies.ecurrency.rate;

  if (usdRate == null || ecurrencyRate == null) {
    return null;
  }

  return ecurrencyRate * usdRate;
});

const canCompare = computed(() => {
  return currencies.usd.rate != null && currencies.ecurrency.rate != null;
});

const parseAmount = (value) => {
  const normalized = String(value).replace(/\s/g, '').replace(',', '.');
  const number = Number(normalized);

  return Number.isFinite(number) ? number : null;
};

const formatInputAmount = (rate) => {
  if (rate == null) {
    return '';
  }

  return new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 8,
  }).format(rate);
};

const clearAmounts = (except) => {
  if (except !== 'ecurrency') ecurrencyAmount.value = '';
  if (except !== 'usd') usdAmount.value = '';
  if (except !== 'rub') rubAmount.value = '';
};

const syncFromEcurrency = () => {
  const amount = parseAmount(ecurrencyAmount.value);
  const usdRate = currencies.usd.rate;
  const ecurrencyRate = currencies.ecurrency.rate;

  if (amount == null || usdRate == null || ecurrencyRate == null) {
    clearAmounts('ecurrency');
    return;
  }

  usdAmount.value = formatInputAmount(amount * ecurrencyRate);
  rubAmount.value = formatInputAmount(amount * ecurrencyRate * usdRate);
};

const syncFromUsd = () => {
  const amount = parseAmount(usdAmount.value);
  const usdRate = currencies.usd.rate;
  const ecurrencyRate = currencies.ecurrency.rate;

  if (amount == null || usdRate == null || ecurrencyRate == null || ecurrencyRate === 0) {
    clearAmounts('usd');
    return;
  }

  ecurrencyAmount.value = formatInputAmount(amount / ecurrencyRate);
  rubAmount.value = formatInputAmount(amount * usdRate);
};

const syncFromRub = () => {
  const amount = parseAmount(rubAmount.value);
  const usdRate = currencies.usd.rate;
  const ecurrencyRate = currencies.ecurrency.rate;

  if (amount == null || usdRate == null || ecurrencyRate == null || usdRate === 0) {
    clearAmounts('rub');
    return;
  }

  usdAmount.value = formatInputAmount(amount / usdRate);
  ecurrencyAmount.value = formatInputAmount(amount / (ecurrencyRate * usdRate));
};

const onEcurrencyInput = () => {
  lastEdited.value = 'ecurrency';
  syncFromEcurrency();
};

const onUsdInput = () => {
  lastEdited.value = 'usd';
  syncFromUsd();
};

const onRubInput = () => {
  lastEdited.value = 'rub';
  syncFromRub();
};

const resetConverter = () => {
  lastEdited.value = 'ecurrency';
  ecurrencyAmount.value = '1';
  syncCompare('ecurrency');
};

const syncCompare = (fromSide = 'ecurrency') => {
  if (!canCompare.value) {
    clearAmounts(fromSide);
    return;
  }

  if (fromSide === 'usd') {
    syncFromUsd();
    return;
  }

  if (fromSide === 'rub') {
    syncFromRub();
    return;
  }

  if (parseAmount(ecurrencyAmount.value) == null) {
    ecurrencyAmount.value = '1';
  }

  syncFromEcurrency();
};

watch(
  () => [currencies.usd.rate, currencies.ecurrency.rate],
  ([usdRate, ecurrencyRate]) => {
    if (usdRate == null || ecurrencyRate == null) {
      clearAmounts(lastEdited.value);
      return;
    }

    syncCompare(lastEdited.value);
  },
);
const formatRate = (rate) => {
  if (rate == null) {
    return '—';
  }

  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  }).format(rate);
};

const formatChange = (change, changePercent) => {
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

const formatTime = (date) => {
  if (!date) {
    return '';
  }

  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
};

const changeClass = (change) => {
  if (change == null || change === 0) {
    return '';
  }

  return change > 0 ? 'currency-card__change--up' : 'currency-card__change--down';
};

const fetchCurrency = async (id) => {
  const item = currencies[id];
  const fetcher = fetchers[id];

  if (!item || !fetcher || item.isLoading) {
    return;
  }

  item.isLoading = true;
  item.error = null;

  try {
    const data = await fetcher();
    item.rate = data.rate;
    item.previous = data.previous ?? null;
    item.change = data.change ?? null;
    item.changePercent = data.changePercent ?? null;
    item.fetchedAt = data.fetchedAt;

    if (id === 'ecurrency') {
      lastEdited.value = 'ecurrency';
      syncCompare('ecurrency');
    } else if (id === 'usd') {
      syncCompare(lastEdited.value);
    }
  } catch (error) {
    item.error = error?.message || 'Ошибка запроса';
  } finally {
    item.isLoading = false;
  }
};

const fetchAll = async () => {
  await Promise.all(currencyList.value.map((item) => fetchCurrency(item.id)));
};

onMounted(() => {
  fetchAll();
});
</script>

<template>
  <div class="page__container">
    <the-sidebar class="page__sidebar">
      <div class="currencies-compare">
        <div class="currencies-compare__header">
          <h2 class="currencies-compare__title">Сравнение</h2>
          <button
            type="button"
            class="currencies-compare__reset"
            title="Reset"
            aria-label="Reset"
            :disabled="!canCompare"
            @click="resetConverter"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
          </button>
        </div>
        <p class="currencies-compare__pair">Ecurrency — Доллар — Рубль</p>

        <div class="currencies-compare__converter">
          <label class="currencies-compare__row">
            <input
              v-model="ecurrencyAmount"
              type="text"
              inputmode="decimal"
              class="currencies-compare__input"
              :disabled="!canCompare"
              placeholder="0"
              @input="onEcurrencyInput"
            >
            <span class="currencies-compare__currency">Ecurrency</span>
          </label>

          <div
            class="currencies-compare__swap"
            aria-hidden="true"
          >
            ⇄
          </div>

          <label class="currencies-compare__row">
            <input
              v-model="usdAmount"
              type="text"
              inputmode="decimal"
              class="currencies-compare__input"
              :disabled="!canCompare"
              placeholder="0"
              @input="onUsdInput"
            >
            <span class="currencies-compare__currency">Доллар</span>
          </label>

          <div
            class="currencies-compare__swap"
            aria-hidden="true"
          >
            ⇄
          </div>

          <label class="currencies-compare__row">
            <input
              v-model="rubAmount"
              type="text"
              inputmode="decimal"
              class="currencies-compare__input"
              :disabled="!canCompare"
              placeholder="0"
              @input="onRubInput"
            >
            <span class="currencies-compare__currency">RUB</span>
          </label>
        </div>

        <p
          v-if="canCompare"
          class="currencies-compare__rate"
        >
          1 Ecurrency =
          <strong>{{ formatRate(currencies.ecurrency.rate) }}</strong> $
          <br>
          USD =
          <strong>{{ formatRate(rubPerEcurrency) }}</strong> RUB
        </p>

        <p
          v-else
          class="currencies-compare__hint"
        >
          Запросите доллар и ecurrency, чтобы увидеть курс
        </p>
      </div>

      <the-navigation />
    </the-sidebar>

    <main class="page__content">
      <div class="currencies-page">
        <header class="currencies-page__header">
          <div class="currencies-page__heading">
            <h1 class="currencies-page__title">Валюты</h1>
            <p class="currencies-page__subtitle">
              Курсы запрашиваются вручную. Доступны доллар (ЦБ) и ecurrency.
            </p>
          </div>

          <app-button
            color="green"
            :disabled="isAnyLoading"
            @click="fetchAll"
          >
            {{ isAnyLoading ? 'Загрузка...' : 'Обновить все' }}
          </app-button>
        </header>

        <div class="currencies-page__grid">
          <article
            v-for="item in currencyList"
            :key="item.id"
            class="currency-card"
          >
            <div class="currency-card__top">
              <h2 class="currency-card__title">{{ item.label }}</h2>
              <app-button
                color="blue"
                outline
                :disabled="item.isLoading"
                @click="fetchCurrency(item.id)"
              >
                {{ item.isLoading ? 'Запрос...' : 'Обновить' }}
              </app-button>
            </div>

            <p class="currency-card__rate">
              {{ formatRate(item.rate) }}
              <span
                v-if="item.rate != null && item.unit"
                class="currency-card__unit"
              >
                {{ item.unit }}
              </span>
            </p>

            <p
              v-if="item.change != null"
              class="currency-card__change"
              :class="changeClass(item.change)"
            >
              За сутки: {{ formatChange(item.change, item.changePercent) }}
            </p>

            <p
              v-if="item.fetchedAt"
              class="currency-card__meta"
            >
              Обновлено: {{ formatTime(item.fetchedAt) }}
            </p>

            <p
              v-else-if="!item.isLoading && !item.error"
              class="currency-card__meta"
            >
              Нажмите «Обновить», чтобы получить курс
            </p>

            <p
              v-if="item.error"
              class="currency-card__error"
            >
              {{ item.error }}
            </p>
          </article>
        </div>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.currencies-compare {
  display: flex;
  flex-direction: column;
  gap: rem(12px);
  margin-bottom: auto;
  padding: rem(16px);
  border-radius: $border-radius;
  background: linear-gradient(135deg, $mine-shaft-3 0%, $mine-shaft 100%);
  border: rem(1px) solid rgba($white, 0.06);

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: rem(8px);
  }

  &__title {
    margin: 0;
    font-size: rem(14px);
    font-weight: $font-weight-bold;
    color: $white;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  &__reset {
    display: flex;
    align-items: center;
    justify-content: center;
    width: rem(24px);
    height: rem(24px);
    padding: 0;
    border: none;
    border-radius: rem(6px);
    background: transparent;
    color: $silver-chalice;
    cursor: pointer;
    transition: color 0.15s ease, background-color 0.15s ease;

    svg {
      width: rem(14px);
      height: rem(14px);
    }

    &:hover:not(:disabled) {
      color: $white;
      background-color: rgba($white, 0.08);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  &__pair {
    margin: 0;
    font-size: rem(13px);
    color: $silver-chalice;
  }

  &__converter {
    display: flex;
    flex-direction: column;
    gap: rem(8px);
  }

  &__row {
    display: flex;
    align-items: center;
    gap: rem(8px);
    padding: rem(4px) rem(4px) rem(4px) rem(12px);
    border: rem(1px) solid rgba($white, 0.12);
    border-radius: $border-radius;
    background-color: $mine-shaft-1;
  }

  &__input {
    flex: 1;
    min-width: 0;
    padding: rem(8px) 0;
    border: none;
    background: transparent;
    color: $white;
    font-family: inherit;
    font-size: rem(18px);
    font-weight: $font-weight-bold;
    outline: none;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__currency {
    flex-shrink: 0;
    padding: rem(8px) rem(10px);
    border-radius: rem(6px);
    background-color: rgba($white, 0.06);
    color: $silver-chalice;
    font-size: rem(12px);
    font-weight: $font-weight-medium;
    letter-spacing: 0.02em;
  }

  &__swap {
    display: flex;
    align-items: center;
    justify-content: center;
    color: $silver-chalice;
    font-size: rem(16px);
    line-height: 1;
  }

  &__rate {
    margin: 0;
    font-size: rem(13px);
    color: $silver-chalice;
    line-height: 1.4;

    strong {
      color: $white;
      font-weight: $font-weight-bold;
    }
  }

  &__hint {
    margin: 0;
    font-size: rem(12px);
    color: $silver-chalice;
    line-height: 1.4;
  }
}

.currencies-page {
  display: flex;
  flex-direction: column;
  gap: rem(16px);
  padding: rem(16px);

  @media #{$screen-tablet} {
    gap: rem(24px);
    padding: rem(32px);
  }

  &__header {
    display: flex;
    flex-direction: column;
    gap: rem(16px);
    align-items: flex-start;

    @media #{$screen-tablet} {
      flex-direction: row;
      align-items: flex-start;
      justify-content: space-between;
    }
  }

  &__title {
    margin: 0 0 rem(8px);
    font-size: rem(22px);
    font-weight: $font-weight-bold;
    color: $white;

    @media #{$screen-tablet} {
      font-size: rem(28px);
    }
  }

  &__subtitle {
    margin: 0;
    font-size: rem(13px);
    color: $silver-chalice;
    line-height: 1.5;

    @media #{$screen-tablet} {
      font-size: rem(14px);
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: rem(16px);

    @media #{$screen-tablet} {
      grid-template-columns: repeat(2, 1fr);
    }

    @media #{$screen-desktop} {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}

.currency-card {
  display: flex;
  flex-direction: column;
  gap: rem(12px);
  padding: rem(20px);
  border-radius: $border-radius;
  background: linear-gradient(135deg, $mine-shaft-3 0%, $mine-shaft 100%);
  border: rem(1px) solid rgba($white, 0.06);

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: rem(12px);
  }

  &__title {
    margin: 0;
    font-size: rem(16px);
    font-weight: $font-weight-medium;
    color: $white;
  }

  &__rate {
    margin: 0;
    font-size: rem(32px);
    font-weight: $font-weight-bold;
    color: $white;
    letter-spacing: 0.02em;
  }

  &__unit {
    margin-left: rem(8px);
    font-size: rem(14px);
    font-weight: $font-weight-medium;
    color: $silver-chalice;
    letter-spacing: 0.04em;
  }

  &__change {
    margin: 0;
    font-size: rem(13px);
    color: $silver-chalice;

    &--up {
      color: $green;
    }

    &--down {
      color: $red;
    }
  }

  &__meta {
    margin: 0;
    font-size: rem(12px);
    color: $silver-chalice;
  }

  &__error {
    margin: 0;
    font-size: rem(12px);
    color: $red;
  }
}
</style>
