<script setup>
import { computed, ref, watch } from 'vue';
import { formatRate } from '../lib/format';

const props = defineProps({
  usdRate: {
    default: null,
  },
  ecurrencyRate: {
    default: null,
  },
});

const ecurrencyAmount = ref('1');
const usdAmount = ref('');
const rubAmount = ref('');
const lastEdited = ref('ecurrency');

const canCompare = computed(() => {
  return props.usdRate != null && props.ecurrencyRate != null;
});

const rubPerEcurrency = computed(() => {
  if (!canCompare.value) {
    return null;
  }

  return props.ecurrencyRate * props.usdRate;
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

  if (amount == null || !canCompare.value) {
    clearAmounts('ecurrency');
    return;
  }

  usdAmount.value = formatInputAmount(amount * props.ecurrencyRate);
  rubAmount.value = formatInputAmount(amount * props.ecurrencyRate * props.usdRate);
};

const syncFromUsd = () => {
  const amount = parseAmount(usdAmount.value);

  if (amount == null || !canCompare.value || props.ecurrencyRate === 0) {
    clearAmounts('usd');
    return;
  }

  ecurrencyAmount.value = formatInputAmount(amount / props.ecurrencyRate);
  rubAmount.value = formatInputAmount(amount * props.usdRate);
};

const syncFromRub = () => {
  const amount = parseAmount(rubAmount.value);

  if (amount == null || !canCompare.value || props.usdRate === 0) {
    clearAmounts('rub');
    return;
  }

  usdAmount.value = formatInputAmount(amount / props.usdRate);
  ecurrencyAmount.value = formatInputAmount(amount / (props.ecurrencyRate * props.usdRate));
};

const syncCompare = (fromSide = 'ecurrency') => {
  if (fromSide === 'price') {
    const price = parseAmount(usdAmount.value);

    if (price == null || props.usdRate == null) {
      return;
    }

    ecurrencyAmount.value = '1';
    rubAmount.value = formatInputAmount(price * props.usdRate);
    return;
  }

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

const applyEcurrencyPrice = (price) => {
  if (typeof price !== 'number' || !Number.isFinite(price)) {
    return;
  }

  lastEdited.value = 'price';
  ecurrencyAmount.value = '1';
  usdAmount.value = formatInputAmount(price);
  rubAmount.value = props.usdRate != null
    ? formatInputAmount(price * props.usdRate)
    : '';
};

defineExpose({ applyEcurrencyPrice });

watch(
  () => [props.usdRate, props.ecurrencyRate],
  ([usdRate, ecurrencyRate]) => {
    if (lastEdited.value === 'price') {
      syncCompare('price');
      return;
    }

    if (usdRate == null || ecurrencyRate == null) {
      clearAmounts(lastEdited.value);
      return;
    }

    syncCompare(lastEdited.value);
  },
);
</script>

<template>
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
      <strong>{{ formatRate(ecurrencyRate) }}</strong> $
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
</template>

<style lang="scss" scoped>
.currencies-compare {
  display: flex;
  flex-direction: column;
  gap: rem(12px);
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
</style>
