<script setup>
import { inject } from 'vue';

defineProps({
  title: {
    type: String,
    required: true,
  },
});

const selectedTitle = inject('selectedTitle');
</script>

<template>
  <div
    v-show="title === selectedTitle"
    class="tab"
  >
    <slot />
  </div>
</template>
