<script setup>
import { ref, watch, computed } from 'vue';
import AppModal from '@/common/components/AppModal.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  months: {
    type: Array,
    default: () => [],
  },
  historyData: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close', 'selectMonth']);

const selectedMonth = ref(null);

// Форматирование месяца для отображения
const formatMonth = (monthKey) => {
  if (!monthKey) return '';
  const [year, month] = monthKey.split('-');
  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
};

// Карточки из истории
const historyCards = computed(() => {
  if (!props.historyData?.cards) return [];
  return Object.entries(props.historyData.cards)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.count - a.count);
});

// Общая сумма
const totalCount = computed(() => {
  return historyCards.value.reduce((sum, card) => sum + (card.count || 0), 0);
});

// При открытии выбираем первый месяц
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && props.months.length && !selectedMonth.value) {
    selectedMonth.value = props.months[0];
    emit('selectMonth', selectedMonth.value);
  }
});

const handleSelectMonth = (month) => {
  selectedMonth.value = month;
  emit('selectMonth', month);
};
</script>

<template>
  <app-modal :is-open="isOpen" @close="emit('close')">
    <div class="history">
      <h2 class="history__title">История внимания</h2>

      <div v-if="!months.length" class="history__empty">
        Нет сохраненной истории
      </div>

      <template v-else>
        <div class="history__months">
          <button
            v-for="month in months"
            :key="month"
            type="button"
            class="history__month"
            :class="{ 'history__month--active': selectedMonth === month }"
            @click="handleSelectMonth(month)"
          >
            {{ formatMonth(month) }}
          </button>
        </div>

        <div v-if="historyData" class="history__content">
          <div class="history__total">
            <span class="history__total-label">Всего:</span>
            <span class="history__total-value">{{ totalCount }}</span>
          </div>

          <div class="history__cards">
            <div
              v-for="card in historyCards"
              :key="card.id"
              class="history__card"
            >
              <span class="history__card-title">{{ card.title }}</span>
              <span class="history__card-count">{{ card.count }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </app-modal>
</template>

<style lang="scss" scoped>
.history {
  min-width: rem(400px);

  &__title {
    margin: 0 0 rem(24px);
    font-size: rem(24px);
    font-weight: $font-weight-bold;
    color: $white;
  }

  &__empty {
    padding: rem(40px);
    text-align: center;
    color: $scorpion;
    font-size: rem(14px);
  }

  &__months {
    display: flex;
    flex-wrap: wrap;
    gap: rem(8px);
    margin-bottom: rem(24px);
  }

  &__month {
    padding: rem(8px) rem(16px);
    border: rem(1px) solid rgba($white, 0.1);
    border-radius: $border-radius-micro;
    background: transparent;
    color: $silver-chalice;
    font-family: inherit;
    font-size: rem(13px);
    cursor: pointer;
    transition: all $transition-duration $transition-function;

    &:hover {
      border-color: $accent;
      color: $white;
    }

    &--active {
      background: linear-gradient(145deg, $accent 0%, darken($accent, 10%) 100%);
      border-color: transparent;
      color: $white;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: rem(20px);
  }

  &__total {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: rem(16px);
    background: rgba($accent, 0.1);
    border-radius: $border-radius-micro;
    border: rem(1px) solid rgba($accent, 0.2);

    &-label {
      font-size: rem(14px);
      color: $silver-chalice;
    }

    &-value {
      font-size: rem(24px);
      font-weight: $font-weight-bold;
      color: $accent;
    }
  }

  &__cards {
    display: flex;
    flex-direction: column;
    gap: rem(8px);
    max-height: rem(300px);
    overflow-y: auto;
  }

  &__card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: rem(12px) rem(16px);
    background: $mine-shaft-3;
    border-radius: $border-radius-micro;
    border: rem(1px) solid rgba($white, 0.05);

    &-title {
      font-size: rem(14px);
      color: $white;
    }

    &-count {
      font-size: rem(18px);
      font-weight: $font-weight-bold;
      color: $mustard;
    }
  }
}
</style>
