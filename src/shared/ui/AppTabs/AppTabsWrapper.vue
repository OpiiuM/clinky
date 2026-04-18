<script setup>
import { ref, useSlots, provide } from 'vue';

const slots = useSlots();

const tabTitles = ref(slots.default().map((tab) => tab.props.title));
const selectedTitle = ref(tabTitles.value[0]);

provide('selectedTitle', selectedTitle);
</script>

<template>
  <div class="tabs">
    <ul class="tabs__header">
      <li
        v-for="title in tabTitles"
        :key="title"
        class="tabs__header-item"
        :class="{ 'tabs__header-item--selected': title === selectedTitle }"
        @click="selectedTitle = title"
      >
        {{ title }}
      </li>
    </ul>
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.tabs {
  &__header {
    display: flex;
    flex-wrap: wrap;

    margin-top: rem(-$gap-micro);
    margin-right: rem(-$gap-micro);
    margin-bottom: rem($gap-medium);

    &-item {
      @include text-size(20px, 26px);

      display: inline-flex;
      align-items: center;
      justify-content: center;

      margin-top: rem($gap-micro);
      margin-right: rem($gap-micro);
      padding: rem($gap-micro) rem(12px);

      cursor: pointer;
      transition: color $transition-duration $transition-function,
        background-color $transition-duration $transition-function;

      border: rem(1px) solid $accent;
      border-radius: rem($border-radius-micro);

      &:hover,
      &--selected {
        color: $white;
        background-color: $accent;
      }
    }
  }
}
</style>
