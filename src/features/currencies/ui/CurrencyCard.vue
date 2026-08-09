<script setup>
import { AppButton } from '@/shared/ui';
import { formatChange, formatRate, formatTime } from '../lib/format';

defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['refresh']);

const changeClass = (change) => {
  if (change == null || change === 0) {
    return '';
  }

  return change > 0 ? 'currency-card__change--up' : 'currency-card__change--down';
};
</script>

<template>
  <article class="currency-card">
    <div class="currency-card__top">
      <h2 class="currency-card__title">{{ item.label }}</h2>
      <app-button
        color="blue"
        outline
        :disabled="item.isLoading"
        @click="emit('refresh', item.id)"
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
</template>

<style lang="scss" scoped>
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
