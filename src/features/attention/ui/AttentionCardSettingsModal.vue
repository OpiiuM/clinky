<script setup>
import { ref, watch } from 'vue';
import AppModal from '@/common/components/AppModal.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  cardTitle: {
    type: String,
    default: '',
  },
  goal: {
    type: Number,
    default: 6,
  },
  reward: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['close', 'save']);

const goalDraft = ref(6);
const rewardDraft = ref('');

const syncDrafts = () => {
  goalDraft.value = props.goal;
  rewardDraft.value = props.reward;
};

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    syncDrafts();
  }
});

const handleSave = () => {
  emit('save', {
    goal: goalDraft.value,
    reward: rewardDraft.value.trim(),
  });
  emit('close');
};
</script>

<template>
  <app-modal :is-open="isOpen" @close="emit('close')">
    <div class="card-settings">
      <h2 class="card-settings__title">Настройки карточки</h2>
      <p v-if="cardTitle" class="card-settings__subtitle">{{ cardTitle }}</p>

      <div class="card-settings__field">
        <label class="card-settings__label" for="card-settings-reward">Награда</label>
        <input
          id="card-settings-reward"
          v-model="rewardDraft"
          type="text"
          class="card-settings__input"
          placeholder="Что получите за выполнение..."
          maxlength="80"
        />
      </div>

      <div class="card-settings__field">
        <span class="card-settings__label">Количество штампов</span>
        <div class="card-settings__goal-options">
          <button
            type="button"
            class="card-settings__goal-btn"
            :class="{ 'card-settings__goal-btn--active': goalDraft === 3 }"
            @click="goalDraft = 3"
          >
            3
          </button>
          <button
            type="button"
            class="card-settings__goal-btn"
            :class="{ 'card-settings__goal-btn--active': goalDraft === 6 }"
            @click="goalDraft = 6"
          >
            6
          </button>
        </div>
      </div>

      <div class="card-settings__actions">
        <button
          type="button"
          class="card-settings__btn card-settings__btn--secondary"
          @click="emit('close')"
        >
          Отмена
        </button>
        <button
          type="button"
          class="card-settings__btn card-settings__btn--primary"
          @click="handleSave"
        >
          Сохранить
        </button>
      </div>
    </div>
  </app-modal>
</template>

<style lang="scss" scoped>
.card-settings {
  min-width: rem(280px);

  @media #{$screen-tablet} {
    min-width: rem(360px);
  }

  &__title {
    margin: 0 0 rem(8px);
    font-size: rem(20px);
    font-weight: $font-weight-bold;
    color: $white;
  }

  &__subtitle {
    margin: 0 0 rem(20px);
    font-size: rem(14px);
    color: $silver-chalice;
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: rem(8px);
    margin-bottom: rem(20px);
  }

  &__label {
    font-size: rem(13px);
    color: $silver-chalice;
  }

  &__input {
    padding: rem(12px) rem(14px);
    border: rem(1px) solid rgba($white, 0.15);
    border-radius: $border-radius-micro;
    background: $mine-shaft-3;
    color: $white;
    font-family: inherit;
    font-size: rem(14px);
    transition: border-color $transition-duration $transition-function,
                box-shadow $transition-duration $transition-function;

    &::placeholder {
      color: $scorpion;
    }

    &:focus {
      outline: none;
      border-color: $accent;
      box-shadow: 0 0 0 rem(2px) rgba($accent, 0.2);
    }
  }

  &__goal-options {
    display: flex;
    gap: rem(8px);
  }

  &__goal-btn {
    flex: 1;
    padding: rem(10px);
    border: rem(1px) solid rgba($white, 0.15);
    border-radius: $border-radius-micro;
    background: $mine-shaft-3;
    color: $silver-chalice;
    font-family: inherit;
    font-size: rem(14px);
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition: border-color $transition-duration $transition-function,
                background $transition-duration $transition-function,
                color $transition-duration $transition-function;

    &:hover {
      border-color: rgba($accent, 0.5);
      color: $white;
    }

    &--active {
      border-color: rgba($accent, 0.6);
      background: rgba($accent, 0.2);
      color: lighten($accent, 15%);
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: rem(10px);
    margin-top: rem(8px);
  }

  &__btn {
    padding: rem(10px) rem(20px);
    border: none;
    border-radius: $border-radius-micro;
    font-family: inherit;
    font-size: rem(14px);
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition: background $transition-duration $transition-function,
                transform $transition-duration $transition-function;

    &:hover {
      transform: translateY(-1px);
    }

    &--secondary {
      background: $mine-shaft-4;
      color: $white;
      border: rem(1px) solid rgba($white, 0.15);

      &:hover {
        background: $tundora;
      }
    }

    &--primary {
      background: linear-gradient(145deg, $accent 0%, darken($accent, 10%) 100%);
      color: $white;

      &:hover {
        box-shadow: 0 rem(4px) rem(12px) rgba($accent, 0.3);
      }
    }
  }
}
</style>
