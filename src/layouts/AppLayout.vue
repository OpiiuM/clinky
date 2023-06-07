<script setup>
import { ref, watch, markRaw } from 'vue';
import { useRoute } from 'vue-router';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

const route = useRoute();
const layout = ref(null);

watch(
  () => route.meta?.layout,
  async (metaLayout) => {
    try {
      const component = metaLayout && await import(`./${metaLayout}Layout.vue`);
      layout.value = markRaw(component?.default || DefaultLayout);
    } catch (e) {
      layout.value = markRaw(DefaultLayout);  
    }
  },
  { immediate: true },
);
</script>

<template>
  <component :is="layout">
    <slot />
  </component>
</template>
