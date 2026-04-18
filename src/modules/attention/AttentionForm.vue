<script setup>
import { ref } from 'vue';
import IconPlus from '@/assets/icons/plus.svg';

const emit = defineEmits(['submit']);

const title = ref('');
const isSubmitting = ref(false);

const handleSubmit = async () => {
  const trimmedTitle = title.value.trim();
  if (!trimmedTitle || isSubmitting.value) return;

  isSubmitting.value = true;

  try {
    await emit('submit', trimmedTitle);
    title.value = '';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <form class="attention-form" @submit.prevent="handleSubmit">
    <input
      v-model="title"
      type="text"
      class="attention-form__input"
      placeholder="Название карточки..."
      maxlength="50"
    />
    <button
      type="submit"
      class="attention-form__button"
      :disabled="!title.trim() || isSubmitting"
    >
      <icon-plus class="icon" />
      <span>Добавить</span>
    </button>
  </form>
</template>

<style lang="scss" scoped>
.attention-form {
  display: flex;
  flex-direction: column;
  gap: rem(10px);

  @media #{$screen-tablet} {
    flex-direction: row;
    gap: rem(12px);
  }

  &__input {
    flex: 1;
    min-width: 0;
    padding: rem(12px) rem(14px);
    border: rem(1px) solid rgba($white, 0.15);
    border-radius: $border-radius-micro;
    background: $mine-shaft-3;
    color: $white;
    font-family: inherit;
    font-size: rem(14px);
    transition: border-color $transition-duration $transition-function,
                box-shadow $transition-duration $transition-function;

    @media #{$screen-tablet} {
      padding: rem(12px) rem(16px);
    }

    &::placeholder {
      color: $silver-chalice;
    }

    &:focus {
      outline: none;
      border-color: $accent;
      box-shadow: 0 0 0 rem(2px) rgba($accent, 0.2);
    }
  }

  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: rem(8px);
    padding: rem(12px) rem(16px);
    border: none;
    border-radius: $border-radius-micro;
    background: linear-gradient(145deg, $accent 0%, darken($accent, 10%) 100%);
    color: $white;
    font-family: inherit;
    font-size: rem(14px);
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition: transform $transition-duration $transition-function,
                box-shadow $transition-duration $transition-function,
                opacity $transition-duration $transition-function;

    @media #{$screen-tablet} {
      padding: rem(12px) rem(20px);
    }

    &:not(:disabled):hover {
      transform: translateY(-2px);
      box-shadow: 0 rem(4px) rem(12px) rgba($accent, 0.3);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .icon {
      width: rem(16px);
      height: rem(16px);
    }
  }
}
</style>
