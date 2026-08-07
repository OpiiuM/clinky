<script setup>
import { computed } from 'vue';
import IconPlus from '@/assets/icons/plus.svg';
import IconClose from '@/assets/icons/close.svg';

const props = defineProps({
  card: {
    type: Object,
    required: true,
  },
  canIncrement: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['increment', 'delete']);

const isDisabled = computed(() => !props.canIncrement);
</script>

<template>
  <div class="attention-card" :class="{ 'attention-card--disabled': isDisabled }">
    <button
      type="button"
      class="attention-card__delete"
      title="Удалить карточку"
      @click="emit('delete', card.id)"
    >
      <icon-close class="icon icon--small" />
    </button>

    <div class="attention-card__content">
      <h3 class="attention-card__title">{{ card.title }}</h3>
      <div class="attention-card__counter">{{ card.count || 0 }}</div>
    </div>

    <button
      type="button"
      class="attention-card__increment"
      :disabled="isDisabled"
      :title="isDisabled ? 'Уже добавлено сегодня' : 'Добавить +1'"
      @click="emit('increment', card.id)"
    >
      <icon-plus class="icon" />
      <span v-if="!isDisabled">+1</span>
      <span v-else class="attention-card__done">Готово</span>
    </button>
  </div>
</template>

<style lang="scss" scoped>
.attention-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: rem(12px);
  padding: rem(14px);
  background: linear-gradient(145deg, $mine-shaft-3 0%, $mine-shaft 100%);
  border-radius: $border-radius;
  border: rem(1px) solid rgba($white, 0.08);
  transition: transform $transition-duration $transition-function,
              box-shadow $transition-duration $transition-function;

  @media #{$screen-tablet} {
    gap: rem(16px);
    padding: rem(20px);
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 rem(8px) rem(24px) rgba($black, 0.3);
  }

  &--disabled {
    .attention-card__increment {
      background: linear-gradient(145deg, $green 0%, darken($green, 10%) 100%);
      cursor: default;

      &:hover {
        transform: none;
      }
    }
  }

  &__delete {
    position: absolute;
    top: rem(6px);
    right: rem(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    width: rem(22px);
    height: rem(22px);
    padding: 0;
    border: none;
    border-radius: 50%;
    background: rgba($red, 0.25);
    color: lighten($red, 15%);
    cursor: pointer;
    opacity: 1;
    transition: opacity $transition-duration $transition-function,
                background $transition-duration $transition-function;

    @media #{$screen-tablet} {
      top: rem(8px);
      right: rem(8px);
      width: rem(24px);
      height: rem(24px);
      opacity: 0;
    }

    &:hover {
      background: rgba($red, 0.4);
    }
  }

  &:hover &__delete {
    opacity: 1;
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: rem(8px);
    flex: 1;

    @media #{$screen-tablet} {
      gap: rem(12px);
    }
  }

  &__title {
    margin: 0;
    font-size: rem(12px);
    font-weight: $font-weight-medium;
    color: $white;
    text-align: center;
    word-break: break-word;
    height: 100%;

    @media #{$screen-tablet} {
      font-size: rem(14px);
    }
  }

  &__counter {
    font-size: rem(36px);
    font-weight: $font-weight-bold;
    color: $white;
    line-height: 1;
    background: linear-gradient(135deg, lighten($accent, 10%) 0%, lighten($purple, 10%) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    flex-grow: 1;

    @media #{$screen-tablet} {
      font-size: rem(48px);
    }
  }

  &__increment {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: rem(6px);
    width: 100%;
    padding: rem(10px);
    border: none;
    border-radius: $border-radius-micro;
    background: linear-gradient(145deg, $accent 0%, darken($accent, 10%) 100%);
    color: $white;
    font-family: inherit;
    font-size: rem(13px);
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition: transform $transition-duration $transition-function,
                box-shadow $transition-duration $transition-function;

    @media #{$screen-tablet} {
      padding: rem(12px);
      font-size: rem(14px);
    }

    &:not(:disabled):hover {
      transform: scale(1.02);
      box-shadow: 0 rem(4px) rem(12px) rgba($accent, 0.3);
    }

    &:disabled {
      opacity: 1;
    }

    .icon {
      width: rem(14px);
      height: rem(14px);

      @media #{$screen-tablet} {
        width: rem(16px);
        height: rem(16px);
      }
    }
  }

  &__done {
    font-size: rem(11px);
    text-transform: uppercase;
    letter-spacing: 0.5px;

    @media #{$screen-tablet} {
      font-size: rem(12px);
    }
  }
}
</style>
