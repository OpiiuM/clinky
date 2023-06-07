<script setup>
import ItemGoal from '@/modules/goals/ItemGoal.vue';

const goals = [
  {
    name: 'HomePage',
    status: false,
  },
  {
    name: 'internalization',
    status: false,
  },
  {
    name: 'Count item\'s of tag',
    status: false,
  },
  {
    name: 'Error/Warning Notifier',
    status: false,
  },
  {
    name: 'Perfect-scrollbar',
    status: false,
  },
  {
    name: 'Captcha',
    status: false,
  },
  {
    name: 'History of tags',
    status: false,
  },
];
</script>

<template>
  <ul class="goals__list">
    <item-goal
      v-for="(goal, index) in goals"
      :key="index"
      :index="index"
      :status="goal.status"
      class="goals__list-item"
    >
      {{ goal.name }}
    </item-goal>
  </ul>
</template>

<style lang="scss" scoped>
.goals {
  &__list {
    &-item {
      margin-bottom: rem($gap-small);

      @include resetting-vertical-indentation-of-last;
    }
  }
}
</style>
