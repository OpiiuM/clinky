<script setup>
import { computed } from 'vue';

const props = defineProps({
  tag: {
    type: String,
    default: 'button',
  },
  color: {
    type: String,
    default: 'blue',
    validator(value) {
      return ['blue', 'orange', 'green', 'red', 'purple', 'black'].includes(value);
    },
  },
  outline: {
    type: Boolean,
    default: false,
  },
});

const computedClass = computed(() => ({
  [`button--${props.color}`]: props.color,
  'button--outline': props.outline,
}));
</script>

<template>
  <component
    :is="tag"
    class="button"
    :class="computedClass"
  >
    <span
      v-if="$slots.prefix"
      class="button__prefix"
    >
      <slot name="prefix" />
    </span>

    <span class="button__text">
      <slot />
    </span>

    <span
      v-if="$slots.suffix"
      class="button__suffix"
    >
      <slot name="suffix" />
    </span>
  </component>
</template>

<style lang="scss" scoped>
.button {
  position: relative;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-width: rem(120px);
  padding: rem(10px) rem(12px);

  user-select: none;
  cursor: pointer;
  transition: background-color $transition-duration $transition-function;
  text-decoration: none;
  white-space: nowrap;

  color: $white;
  border: rem(1px) solid $mine-shaft;
  border-radius: rem($border-radius);

  &[disabled] {
    cursor: not-allowed;

    background-color: $dove-gray;

    &:hover {
      background-color: $dove-gray;
    }
  }

  &--blue {
    background-color: $dodger-blue;
  }

  &--blue:hover,
  &--blue#{&}--active {
    background-color: darken($dodger-blue, 10%);
  }

  &--orange {
    background-color: $orange;
  }

  &--orange:hover,
  &--orange#{&}--active {
    background-color: darken($orange, 10%);
  }

  &--green {
    background-color: $green;
  }

  &--green:hover,
  &--green#{&}--active {
    background-color: darken($green, 10%);
  }

  &--red {
    background-color: $red;
  }

  &--red:hover,
  &--red#{&}--active {
    background-color: darken($red, 10%);
  }

  &--purple {
    background-color: $purple;
  }

  &--purple:hover,
  &--purple#{&}--active {
    background-color: darken($purple, 10%);
  }

  &--black {
    color: $white;
    border-color: #444;
    background-color: $black;
  }

  &--black:hover,
  &--black#{&}--active {
    color: $white;
    background-color: lighten($black, 10%);
  }
  
  &--outline {
    border: rem(1px) solid $silver-chalice;
    background-color: transparent !important;
  }

  &__prefix {
    flex-shrink: 0;

    margin-right: rem($gap-micro);
  }

  &__text {
    @include text-size(16px, 20px, $font-weight-average);
  }

  &__suffix {
    flex-shrink: 0;

    margin-left: rem($gap-micro);
  }
}
</style>
