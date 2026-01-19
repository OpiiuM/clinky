<script setup>
import { onMounted } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import AppLayout from '@/layouts/AppLayout.vue';

const router = useRouter();

onMounted(() => {
  router.push('/signin');
});
</script>

<template>
  <app-layout>
    <router-view />
  </app-layout>
  <div id="popup" />
</template>
