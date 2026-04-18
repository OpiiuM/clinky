<script setup>
import { ref, watch } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import AppLayout from '@/app/layouts/AppLayout.vue';
import { getToken } from '@/shared/api';

const router = useRouter();

const token = ref(getToken());

watch(token, (value) => {
  if (!value) {
    router.push('/');
  }
}, {
  immediate: true,
});
</script>

<template>
  <app-layout>
    <router-view />
  </app-layout>
  <div id="popup" />
</template>
