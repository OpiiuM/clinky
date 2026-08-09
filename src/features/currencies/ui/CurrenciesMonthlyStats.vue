<script setup>
import { computed, onMounted, ref } from 'vue';
import IconAngle from '@/assets/icons/angle-down.svg';
import { currenciesService } from '@/shared/api';
import { formatRate } from '../lib/format';

const monthlyStats = ref(null);
const selectedMonthKey = ref(currenciesService.getMonthKey());
const availableMonths = ref([selectedMonthKey.value]);

const monthLabel = computed(() => {
  const [year, month] = selectedMonthKey.value.split('-');
  const date = new Date(Number(year), Number(month) - 1, 1);

  return new Intl.DateTimeFormat('ru-RU', {
    month: 'long',
    year: 'numeric',
  }).format(date);
});

const hasMonthlyStats = computed(() => {
  return typeof monthlyStats.value?.max === 'number' && typeof monthlyStats.value?.min === 'number';
});

const selectedMonthIndex = computed(() => {
  return availableMonths.value.indexOf(selectedMonthKey.value);
});

const canGoPrevMonth = computed(() => {
  const index = selectedMonthIndex.value;
  return index === -1
    ? availableMonths.value.length > 0
    : index < availableMonths.value.length - 1;
});

const canGoNextMonth = computed(() => selectedMonthIndex.value > 0);

const isCurrentMonth = computed(() => {
  return selectedMonthKey.value === currenciesService.getMonthKey();
});

const loadMonthlyStats = async (monthKey = selectedMonthKey.value) => {
  selectedMonthKey.value = monthKey;
  monthlyStats.value = await currenciesService.getMonthlyStats(monthKey);
};

const goToPrevMonth = async () => {
  if (!canGoPrevMonth.value) {
    return;
  }

  const index = selectedMonthIndex.value;
  const nextIndex = index === -1 ? 0 : index + 1;
  await loadMonthlyStats(availableMonths.value[nextIndex]);
};

const goToNextMonth = async () => {
  if (!canGoNextMonth.value) {
    return;
  }

  await loadMonthlyStats(availableMonths.value[selectedMonthIndex.value - 1]);
};

const recordRate = async (rate) => {
  try {
    const stats = await currenciesService.updateMonthlyStats(rate);
    availableMonths.value = await currenciesService.listMonthlyKeys();

    if (selectedMonthKey.value === currenciesService.getMonthKey()) {
      monthlyStats.value = stats;
    }
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  availableMonths.value = await currenciesService.listMonthlyKeys();
  await loadMonthlyStats(currenciesService.getMonthKey());
});

defineExpose({ recordRate });

const emit = defineEmits(['select-rate']);

const selectRate = (rate) => {
  if (typeof rate !== 'number') {
    return;
  }

  emit('select-rate', rate);
};
</script>

<template>
  <div class="currencies-stats">
    <div class="currencies-stats__header">
      <h2 class="currencies-stats__title">За месяц</h2>

      <div class="currencies-stats__nav">
        <button
          type="button"
          class="currencies-stats__nav-btn"
          title="Предыдущий месяц"
          aria-label="Предыдущий месяц"
          :disabled="!canGoPrevMonth"
          @click="goToPrevMonth"
        >
          <icon-angle class="currencies-stats__nav-icon currencies-stats__nav-icon--prev" />
        </button>
        <button
          type="button"
          class="currencies-stats__nav-btn"
          title="Следующий месяц"
          aria-label="Следующий месяц"
          :disabled="!canGoNextMonth"
          @click="goToNextMonth"
        >
          <icon-angle class="currencies-stats__nav-icon currencies-stats__nav-icon--next" />
        </button>
      </div>
    </div>

    <p class="currencies-stats__month">{{ monthLabel }}</p>

    <template v-if="hasMonthlyStats">
      <div class="currencies-stats__row">
        <span class="currencies-stats__label">Max</span>
        <button
          type="button"
          class="currencies-stats__value currencies-stats__value--max"
          :title="`Подставить ${formatRate(monthlyStats.max)} USDT`"
          @click="selectRate(monthlyStats.max)"
        >
          {{ formatRate(monthlyStats.max) }}
          <span class="currencies-stats__unit">USDT</span>
        </button>
      </div>
      <div class="currencies-stats__row">
        <span class="currencies-stats__label">Min</span>
        <button
          type="button"
          class="currencies-stats__value currencies-stats__value--min"
          :title="`Подставить ${formatRate(monthlyStats.min)} USDT`"
          @click="selectRate(monthlyStats.min)"
        >
          {{ formatRate(monthlyStats.min) }}
          <span class="currencies-stats__unit">USDT</span>
        </button>
      </div>
    </template>

    <p
      v-else
      class="currencies-stats__hint"
    >
      {{ isCurrentMonth
        ? 'Появится после запроса курса'
        : 'Нет данных за этот месяц' }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.currencies-stats {
  display: flex;
  flex-direction: column;
  gap: rem(10px);
  margin-top: rem(12px);
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

  &__nav {
    display: flex;
    align-items: center;
    gap: rem(8px);
  }

  &__nav-btn {
    $size: rem(24px);

    display: flex;
    align-items: center;
    justify-content: center;

    width: $size;
    height: $size;
    padding: 0;

    cursor: pointer;
    transition: color 0.15s ease, background-color 0.15s ease, border-color 0.15s ease;

    color: $silver-chalice;
    border: rem(1px) solid rgba($white, 0.12);
    border-radius: 50%;
    background-color: $mine-shaft-1;

    &:hover:not(:disabled) {
      color: $white;
      border-color: rgba($white, 0.24);
      background-color: rgba($white, 0.08);
    }

    &:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
  }

  &__nav-icon {
    $size: rem(24px);

    display: block;

    width: $size;
    height: $size;
    fill: currentColor;

    :deep(path) {
      fill: currentColor;
    }

    &--prev {
      transform: rotate(90deg);
    }

    &--next {
      transform: rotate(-90deg);
    }
  }

  &__month {
    margin: 0;
    font-size: rem(13px);
    color: $silver-chalice;
    text-transform: capitalize;
  }

  &__row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: rem(8px);
  }

  &__label {
    font-size: rem(13px);
    color: $silver-chalice;
  }

  &__value {
    margin: 0;
    padding: 0;
    border: none;
    background: transparent;
    font: inherit;
    font-size: rem(16px);
    font-weight: $font-weight-bold;
    cursor: pointer;

    &--max {
      color: #7dcea0;
    }

    &--min {
      color: #f1948a;
    }
  }

  &__unit {
    margin-left: rem(4px);
    font-size: rem(11px);
    font-weight: $font-weight-medium;
    color: $silver-chalice;
  }

  &__hint {
    margin: 0;
    font-size: rem(12px);
    color: $silver-chalice;
    line-height: 1.4;
  }
}
</style>
