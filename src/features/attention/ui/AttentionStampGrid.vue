<script setup>
import { computed } from 'vue';
import IconGift from '@/assets/icons/gift.svg';

const props = defineProps({
  goal: {
    type: Number,
    default: 6,
  },
  stamps: {
    type: Number,
    default: 0,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  rewardPulse: {
    type: Boolean,
    default: false,
  },
  reward: {
    type: String,
    default: '',
  },
});

const slots = computed(() => {
  return Array.from({ length: props.goal }, (_, index) => ({
    index,
    isReward: index === props.goal - 1,
    label: index + 1,
  }));
});

const gridClass = computed(() => ({
  'stamp-grid--goal-3': props.goal === 3,
  'stamp-grid--goal-6': props.goal === 6,
}));

const getSlotClass = (slot) => {
  const isFilled = slot.index < props.stamps;
  const isCurrent = slot.index === props.stamps && !props.disabled;

  return {
    'stamp-grid__slot--filled': isFilled,
    'stamp-grid__slot--current': isCurrent,
    'stamp-grid__slot--reward': slot.isReward,
    'stamp-grid__slot--pulse': slot.isReward && props.rewardPulse,
  };
};
</script>

<template>
  <div class="stamp-grid" :class="gridClass">
    <div
      v-for="slot in slots"
      :key="slot.index"
      class="stamp-grid__slot"
      :class="getSlotClass(slot)"
    >
      <div class="stamp-grid__ring" :title="slot.isReward && reward ? reward : undefined">
        <icon-gift v-if="slot.isReward" class="stamp-grid__gift icon" />
        <span v-else class="stamp-grid__number">{{ slot.label }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.stamp-grid {
  display: grid;
  gap: rem(8px);
  width: 100%;

  &--goal-3 {
    grid-template-columns: repeat(3, 1fr);
  }

  &--goal-6 {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
  }

  &__slot {
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1;
  }

  &__ring {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: rem(52px);
    aspect-ratio: 1;
    border-radius: 50%;
    border: rem(2px) solid rgba($silver-chalice, 0.35);
    background: rgba($mine-shaft-4, 0.5);
    box-shadow: inset 0 0 0 rem(3px) rgba($black, 0.2);
    transition: border-color $transition-duration $transition-function,
                background $transition-duration $transition-function,
                box-shadow $transition-duration $transition-function,
                transform $transition-duration $transition-function;

    @media #{$screen-tablet} {
      max-width: rem(56px);
    }
  }

  &__number {
    font-size: rem(16px);
    font-weight: $font-weight-bold;
    color: rgba($silver-chalice, 0.6);
    line-height: 1;
    transition: color $transition-duration $transition-function;

    @media #{$screen-tablet} {
      font-size: rem(18px);
    }
  }

  &__gift {
    width: rem(18px);
    height: rem(18px);
    color: rgba($silver-chalice, 0.5);
    transition: color $transition-duration $transition-function;

    @media #{$screen-tablet} {
      width: rem(20px);
      height: rem(20px);
    }
  }

  &__slot--reward &__ring {
    border-color: rgba($red, 0.45);
    box-shadow: inset 0 0 0 rem(3px) rgba($red, 0.1);
  }

  &__slot--filled &__ring {
    border-color: rgba($accent, 0.7);
    background: rgba($accent, 0.15);
    box-shadow: inset 0 0 0 rem(3px) rgba($accent, 0.1),
                0 0 rem(8px) rgba($accent, 0.2);
  }

  &__slot--filled &__number {
    color: lighten($accent, 15%);
  }

  &__slot--reward.stamp-grid__slot--filled &__ring {
    border-color: rgba($mustard, 0.8);
    background: rgba($mustard, 0.15);
    box-shadow: inset 0 0 0 rem(3px) rgba($mustard, 0.1),
                0 0 rem(8px) rgba($mustard, 0.25);
  }

  &__slot--reward.stamp-grid__slot--filled &__gift {
    color: $mustard;
  }

  &__slot--current &__ring {
    border-color: rgba($accent, 0.9);
    box-shadow: inset 0 0 0 rem(3px) rgba($accent, 0.15),
                0 0 rem(10px) rgba($accent, 0.35);
    transform: scale(1.05);
  }

  &__slot--current &__number {
    color: lighten($accent, 20%);
  }

  &__slot--current.stamp-grid__slot--reward &__ring {
    border-color: rgba($red, 0.85);
    box-shadow: inset 0 0 0 rem(3px) rgba($red, 0.15),
                0 0 rem(10px) rgba($red, 0.35);
  }

  &__slot--current.stamp-grid__slot--reward &__gift {
    color: lighten($red, 15%);
  }

  &__slot--pulse &__ring {
    animation: reward-pulse 0.6s ease-out;
  }

  &__slot--pulse &__gift {
    color: $mustard;
  }
}

@keyframes reward-pulse {
  0% {
    transform: scale(1);
    box-shadow: inset 0 0 0 rem(3px) rgba($mustard, 0.1),
                0 0 rem(4px) rgba($mustard, 0.2);
  }

  50% {
    transform: scale(1.15);
    box-shadow: inset 0 0 0 rem(3px) rgba($mustard, 0.2),
                0 0 rem(16px) rgba($mustard, 0.5);
  }

  100% {
    transform: scale(1);
    box-shadow: inset 0 0 0 rem(3px) rgba($mustard, 0.1),
                0 0 rem(8px) rgba($mustard, 0.25);
  }
}
</style>
