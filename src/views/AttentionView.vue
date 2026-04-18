<script setup>
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useAttentionStore } from '@/stores';

import TheSidebar from '@/modules/app/TheSidebar.vue';
import TheNavigation from '@/modules/navigation/TheNavigation.vue';
import AttentionCard from '@/modules/attention/AttentionCard.vue';
import AttentionForm from '@/modules/attention/AttentionForm.vue';
import AttentionHistory from '@/modules/attention/AttentionHistory.vue';

const attentionStore = useAttentionStore();
const { cards, isLoading, historyData, ascCards } = storeToRefs(attentionStore);

const isHistoryOpen = ref(false);
const historyMonths = ref([]);

onMounted(async () => {
  await attentionStore.fetchCards();
});

const handleAddCard = async (title) => {
  await attentionStore.addCard(title);
};

const handleIncrement = async (cardId) => {
  await attentionStore.incrementCard(cardId);
};

const handleDelete = async (cardId) => {
  await attentionStore.deleteCard(cardId);
};

const handleReset = async () => {
  await attentionStore.resetTodayChanges();
};

const handleOpenHistory = async () => {
  historyMonths.value = await attentionStore.getAllHistoryMonths();
  isHistoryOpen.value = true;
};

const handleSelectMonth = async (month) => {
  await attentionStore.loadHistory(month);
};
</script>

<template>
  <div class="page__container">
    <the-sidebar class="page__sidebar">
      <the-navigation />
    </the-sidebar>

    <main class="page__content attention-page">
      <header class="attention-page__header">
        <h1 class="attention-page__title">Распределение внимания</h1>
        <p class="attention-page__subtitle">
          Добавляйте +1 к карточкам каждый день, чтобы отслеживать куда уходит ваше внимание
        </p>
      </header>

      <attention-form
        class="attention-page__form"
        @submit="handleAddCard"
      />

      <div v-if="isLoading" class="attention-page__loading">
        Загрузка...
      </div>

      <div v-else-if="!cards.length" class="attention-page__empty">
        <p>Нет карточек внимания</p>
        <p>Создайте первую карточку выше</p>
      </div>

      <div v-else class="attention-page__grid">
        <attention-card
          v-for="card in ascCards"
          :key="card.id"
          :card="card"
          :can-increment="attentionStore.canIncrement(card)"
          @increment="handleIncrement"
          @delete="handleDelete"
        />
      </div>

      <footer class="attention-page__footer">
        <button
          type="button"
          class="attention-page__btn attention-page__btn--secondary"
          @click="handleOpenHistory"
        >
          История
        </button>
        <button
          type="button"
          class="attention-page__btn attention-page__btn--danger"
          @click="handleReset"
        >
          Обнулить
        </button>
      </footer>
    </main>

    <attention-history
      :is-open="isHistoryOpen"
      :months="historyMonths"
      :history-data="historyData"
      @close="isHistoryOpen = false"
      @select-month="handleSelectMonth"
    />
  </div>
</template>

<style lang="scss" scoped>
.attention-page {
  display: flex;
  flex-direction: column;
  gap: rem(16px);
  padding: rem(16px);

  @media #{$screen-tablet} {
    gap: rem(24px);
    padding: rem(32px);
  }

  &__header {
    margin-bottom: rem(4px);

    @media #{$screen-tablet} {
      margin-bottom: rem(8px);
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

  &__form {
    margin-bottom: rem(4px);

    @media #{$screen-tablet} {
      margin-bottom: rem(8px);
    }
  }

  &__loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: rem(40px) rem(20px);
    color: $silver-chalice;
    font-size: rem(14px);

    @media #{$screen-tablet} {
      padding: rem(60px);
    }
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: rem(8px);
    padding: rem(40px) rem(20px);
    background: $mine-shaft-3;
    border-radius: $border-radius;
    border: rem(1px) dashed rgba($white, 0.15);

    @media #{$screen-tablet} {
      padding: rem(60px);
    }

    p {
      margin: 0;
      color: $silver-chalice;
      font-size: rem(13px);
      text-align: center;

      &:first-child {
        color: $white;
        font-size: rem(15px);
      }

      @media #{$screen-tablet} {
        font-size: rem(14px);

        &:first-child {
          font-size: rem(16px);
        }
      }
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: rem(12px);

    @media #{$screen-tablet} {
      grid-template-columns: repeat(auto-fill, minmax(rem(180px), 1fr));
      gap: rem(16px);
    }
  }

  &__footer {
    display: flex;
    justify-content: center;
    gap: rem(12px);
    margin-top: auto;
    padding-top: rem(16px);
    border-top: rem(1px) solid rgba($white, 0.1);

    @media #{$screen-tablet} {
      justify-content: flex-end;
      padding-top: rem(24px);
    }
  }

  &__btn {
    flex: 1;
    padding: rem(12px) rem(16px);
    border: none;
    border-radius: $border-radius-micro;
    font-family: inherit;
    font-size: rem(14px);
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition: transform $transition-duration $transition-function,
                box-shadow $transition-duration $transition-function,
                opacity $transition-duration $transition-function;

    @media #{$screen-tablet} {
      flex: none;
      padding: rem(14px) rem(28px);
    }

    &:not(:disabled):hover {
      transform: translateY(-2px);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &--secondary {
      background: $mine-shaft-4;
      color: $white;
      border: rem(1px) solid rgba($white, 0.15);

      &:hover {
        background: $tundora;
        border-color: rgba($white, 0.25);
      }
    }

    &--danger {
      background: rgba($red, 0.15);
      color: lighten($red, 15%);
      border: rem(1px) solid rgba($red, 0.4);

      &:hover {
        background: rgba($red, 0.25);
        border-color: $red;
      }
    }
  }
}
</style>
