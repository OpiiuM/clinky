<script setup>
import { computed, ref } from 'vue';
import IconPlus from '@/assets/icons/plus.svg';
import IconClose from '@/assets/icons/close.svg';
import IconStar from '@/assets/icons/star.svg';
import IconStarChecked from '@/assets/icons/star-checked.svg';
import IconEdit from '@/assets/icons/edit.svg';
import IconGift from '@/assets/icons/gift.svg';
import AttentionStampGrid from './AttentionStampGrid.vue';
import AttentionCardSettingsModal from './AttentionCardSettingsModal.vue';

const props = defineProps({
  card: {
    type: Object,
    required: true,
  },
  canIncrement: {
    type: Boolean,
    default: true,
  },
  canTogglePriorityFocus: {
    type: Boolean,
    default: false,
  },
  canEditGoal: {
    type: Boolean,
    default: false,
  },
  isReadyToClaim: {
    type: Boolean,
    default: false,
  },
  isArchivedView: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  'increment',
  'claim-reward',
  'delete',
  'toggle-priority',
  'archive',
  'restore',
  'update-settings',
]);

const rewardPulse = ref(false);
const isSettingsOpen = ref(false);
let rewardPulseTimer = null;

const isDisabled = computed(() => !props.canIncrement);
const isPriorityFocus = computed(() => Boolean(props.card?.isPriorityFocus));
const goal = computed(() => props.card?.goal || 6);
const stamps = computed(() => props.card?.stamps || 0);
const count = computed(() => props.card?.count || 0);
const reward = computed(() => props.card?.reward || '');

const triggerRewardPulse = () => {
  rewardPulse.value = true;
  clearTimeout(rewardPulseTimer);
  rewardPulseTimer = setTimeout(() => {
    rewardPulse.value = false;
  }, 600);
};

const claimMessage = computed(() => {
  if (reward.value) {
    return `Пора забрать награду: ${reward.value}`;
  }
  return 'Все штампы собраны! Заберите вознаграждение';
});

const handleIncrement = () => {
  emit('increment', props.card.id);
};

const handleClaimReward = () => {
  emit('claim-reward', props.card.id);
  triggerRewardPulse();
};

const openSettings = () => {
  if (!props.canEditGoal || props.isArchivedView) return;
  isSettingsOpen.value = true;
};

const handleSettingsSave = (settings) => {
  emit('update-settings', props.card.id, settings);
};
</script>

<template>
  <div
    class="attention-card"
    :class="{
      'attention-card--disabled': isDisabled && !isReadyToClaim,
      'attention-card--priority': isPriorityFocus,
      'attention-card--ready-claim': isReadyToClaim,
    }"
  >
    <button
      v-if="canTogglePriorityFocus && !isArchivedView"
      type="button"
      class="attention-card__priority"
      :class="{ 'attention-card__priority--active': isPriorityFocus }"
      :title="isPriorityFocus ? 'Убрать из приоритетного фокуса' : 'Добавить в приоритетный фокус'"
      @click="emit('toggle-priority', card.id)"
    >
      <component :is="isPriorityFocus ? IconStarChecked : IconStar" class="icon icon--small" />
    </button>

    <button
      type="button"
      class="attention-card__archive"
      :title="isArchivedView ? 'Удалить карточку навсегда' : 'Перенести в архив'"
      @click="emit(isArchivedView ? 'delete' : 'archive', card.id)"
    >
      <icon-close class="icon icon--small" />
    </button>

    <div class="attention-card__content">
      <h3 class="attention-card__title">{{ card.title }}</h3>
      <p class="attention-card__completed">Выполнено: {{ count }}</p>

      <attention-stamp-grid
        :goal="goal"
        :stamps="stamps"
        :reward="reward"
        :disabled="isDisabled || isReadyToClaim"
        :reward-pulse="rewardPulse"
      />

      <p v-if="isReadyToClaim" class="attention-card__claim-message">
        {{ claimMessage }}
      </p>

      <p v-else-if="reward" class="attention-card__reward">
        Награда: <span>{{ reward }}</span>
      </p>

      <button
        v-if="canEditGoal && !isArchivedView"
        type="button"
        class="attention-card__settings"
        title="Настроить награду и количество штампов"
        @click="openSettings"
      >
        <icon-edit class="icon icon--small" />
        <span>Настроить</span>
      </button>
    </div>

    <button
      v-if="!isArchivedView && isReadyToClaim"
      type="button"
      class="attention-card__claim"
      @click="handleClaimReward"
    >
      <icon-gift class="icon" />
      <span>Забрать награду</span>
    </button>

    <button
      v-else-if="!isArchivedView"
      type="button"
      class="attention-card__increment"
      :disabled="isDisabled"
      :title="isDisabled ? 'Уже добавлено сегодня' : 'Добавить +1'"
      @click="handleIncrement"
    >
      <icon-plus class="icon" />
      <span v-if="!isDisabled">+1</span>
      <span v-else class="attention-card__done">Готово</span>
    </button>

    <button
      v-else
      type="button"
      class="attention-card__restore"
      title="Вернуть карточку в активный список"
      @click="emit('restore', card.id)"
    >
      Восстановить
    </button>

    <attention-card-settings-modal
      :is-open="isSettingsOpen"
      :card-title="card.title"
      :goal="goal"
      :reward="reward"
      @close="isSettingsOpen = false"
      @save="handleSettingsSave"
    />
  </div>
</template>

<style lang="scss" scoped>
$priority-color: $white;

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
              box-shadow $transition-duration $transition-function,
              border-color $transition-duration $transition-function;

  @media #{$screen-tablet} {
    gap: rem(16px);
    padding: rem(20px);
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 rem(8px) rem(24px) rgba($black, 0.3);
  }

  &--ready-claim {
    border-color: rgba($mustard, 0.5);
    box-shadow: 0 0 rem(12px) rgba($mustard, 0.15);
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

  &--priority {
    border-color: rgba($priority-color, 0.9);
    box-shadow: 0 0 rem(3px) rem(5px) rgba($priority-color, 0.3);

    &:hover {
      box-shadow: 0 0 rem(3px) rem(5px) rgba($priority-color, 0.3);
    }
  }

  &__priority,
  &__archive {
    position: absolute;
    top: rem(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    width: rem(22px);
    height: rem(22px);
    padding: 0;
    border-radius: 50%;
    cursor: pointer;
    transition: opacity $transition-duration $transition-function,
                background $transition-duration $transition-function;

    @media #{$screen-tablet} {
      top: rem(8px);
      width: rem(24px);
      height: rem(24px);
    }
  }

  &__priority {
    left: rem(6px);
    border: rem(1px) solid rgba($accent, 0.35);
    background: rgba($accent, 0.16);
    color: lighten($accent, 15%);
    opacity: 0;
    pointer-events: none;

    @media #{$screen-tablet} {
      left: rem(8px);
    }

    &:hover {
      background: rgba($accent, 0.28);
    }

    &--active {
      border-color: rgba($mustard, 0.45);
      background: rgba($mustard, 0.18);
      color: lighten($mustard, 10%);

      &:hover {
        background: rgba($mustard, 0.28);
      }
    }
  }

  &__archive {
    right: rem(6px);
    border: none;
    background: rgba($red, 0.25);
    color: lighten($red, 15%);
    opacity: 1;

    @media #{$screen-tablet} {
      right: rem(8px);
      opacity: 0;
    }

    &:hover {
      background: rgba($red, 0.4);
    }
  }

  &:hover &__priority,
  &:focus-within &__priority {
    opacity: 1;
    pointer-events: auto;
  }

  &:hover &__archive,
  &:focus-within &__archive {
    opacity: 1;
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: rem(10px);
    flex: 1;
    padding-top: rem(8px);
    width: 100%;

    @media #{$screen-tablet} {
      gap: rem(12px);
      padding-top: rem(4px);
    }
  }

  &__title {
    margin: 0;
    font-size: rem(12px);
    font-weight: $font-weight-medium;
    color: $white;
    text-align: center;
    word-break: break-word;

    @media #{$screen-tablet} {
      font-size: rem(14px);
    }
  }

  &__completed {
    margin: 0;
    font-size: rem(11px);
    color: $silver-chalice;

    @media #{$screen-tablet} {
      font-size: rem(12px);
    }
  }

  &__claim-message {
    margin: 0;
    font-size: rem(12px);
    font-weight: $font-weight-medium;
    color: lighten($mustard, 10%);
    text-align: center;
    line-height: 1.4;
    word-break: break-word;

    @media #{$screen-tablet} {
      font-size: rem(13px);
    }
  }

  &__reward {
    margin: 0;
    font-size: rem(11px);
    color: $scorpion;
    text-align: center;
    word-break: break-word;

    @media #{$screen-tablet} {
      font-size: rem(13px);
    }

    span {
      color: lighten($mustard, 10%);
    }
  }

  &__settings {
    display: inline-flex;
    align-items: center;
    gap: rem(6px);
    margin-top: auto;
    padding: rem(6px) rem(12px);
    border: rem(1px) solid rgba($white, 0.15);
    border-radius: $border-radius-micro;
    background: transparent;
    color: $silver-chalice;
    font-family: inherit;
    font-size: rem(11px);
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition: border-color $transition-duration $transition-function,
                color $transition-duration $transition-function,
                background $transition-duration $transition-function;

    @media #{$screen-tablet} {
      font-size: rem(12px);
    }

    &:hover {
      border-color: rgba($accent, 0.5);
      color: $white;
      background: rgba($accent, 0.1);
    }

    .icon {
      color: inherit;

      :deep(path) {
        fill: currentColor;
      }
    }
  }

  &__claim {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: rem(6px);
    width: 100%;
    padding: rem(10px);
    border: none;
    border-radius: $border-radius-micro;
    background: linear-gradient(145deg, $mustard 0%, darken($mustard, 12%) 100%);
    color: $mine-shaft;
    font-family: inherit;
    font-size: rem(13px);
    font-weight: $font-weight-bold;
    cursor: pointer;
    transition: transform $transition-duration $transition-function,
                box-shadow $transition-duration $transition-function;

    @media #{$screen-tablet} {
      padding: rem(12px);
      font-size: rem(14px);
    }

    &:hover {
      transform: scale(1.02);
      box-shadow: 0 rem(4px) rem(16px) rgba($mustard, 0.4);
    }

    .icon {
      width: rem(16px);
      height: rem(16px);
      color: inherit;
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

  &__restore {
    width: 100%;
    padding: rem(10px);
    border: rem(1px) solid rgba($white, 0.15);
    border-radius: $border-radius-micro;
    background: $mine-shaft-4;
    color: $white;
    font-family: inherit;
    font-size: rem(13px);
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition: transform $transition-duration $transition-function,
                border-color $transition-duration $transition-function,
                background $transition-duration $transition-function;

    @media #{$screen-tablet} {
      padding: rem(12px);
      font-size: rem(14px);
    }

    &:hover {
      transform: scale(1.02);
      border-color: rgba($white, 0.25);
      background: $tundora;
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
