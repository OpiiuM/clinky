<script setup>
import { RouterView } from 'vue-router';
import AppLayout from '@/layouts/AppLayout.vue';
</script>

<template>
  <app-layout>
    <router-view />
  </app-layout>
  <div id="popup"></div>
</template>
