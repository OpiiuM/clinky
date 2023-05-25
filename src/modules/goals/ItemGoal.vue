<script setup>
import { computed } from 'vue';

import IconCheck from '@/assets/icons/check.svg';

const props = defineProps({
  index: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
});

const COLORS = ['blue', 'green', 'orange'];

const colorIndex = computed(() => {
  return props.index >= COLORS.length ? props.index % COLORS.length : props.index;
});
</script>

<template>
  <li
    class="goal"
    :class="`goal--${COLORS[colorIndex]}`"
  >
    <div class="goal__inner">
      <div class="goal__status">
        <icon-check
          v-if="status"
          class="goal__icon icon"
        />
      </div>
      <p class="goal__text">
        <slot />
      </p>
    </div>
  </li>
</template>

<style lang="scss" scoped>
.goal {
  &--blue & {
    &__inner {
      background-color: $blue;
    }
  }

  &--green & {
    &__inner {
      background-color: $green;
    }
  }

  &--orange & {
    &__inner {
      background-color: $orange;
    }
  }

  &__inner {
    display: flex;
    flex-wrap: nowrap;

    padding: rem($gap-small);

    border-radius: rem($border-radius-micro);
    background-color: $dove-gray;
  }

  &__status {
    $size: 20px;

    position: relative;

    display: flex;
    align-items: center;
    flex-shrink: 0;
    justify-content: center;

    width: rem($size);
    height: rem($size);
    margin-right: rem($gap-small);

    border: rem(1px) solid $white;
    border-radius: 50%;
  }

  &__icon {
    fill: none;
  }

  &__text {
    flex-grow: 1;
  }
}
</style>
