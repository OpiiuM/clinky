<script setup>
import { ref, computed } from 'vue';
import { useMediaQuery } from '@vueuse/core';
import { useRouter } from 'vue-router';
import { useLinksStore, useFilterStore, useAuthStore } from '@/stores';
import { COUNTDOWN_DATE } from '@/common/constants';

import TheFilter from '@/modules/app/TheFilter.vue';
import TheCardBox from '@/modules/app/TheCardBox.vue';
import CountdownTimer from '@/modules/app/CountdownTimer.vue';

import IconAngle from '@/assets/icons/angle-down.svg';

const router = useRouter();

const { fetchLinks } = useLinksStore();
const filterStore = useFilterStore();
const { logout } = useAuthStore();

const notTablet = useMediaQuery('(max-width: 1023px)');

const isOpenMobileMenu = ref(false);

void fetchLinks();

const handleLogout = async () => {
  const responce = await logout();

  if (responce === 'Error') {
    router.push('/');
    filterStore.$reset();
  } else {
    console.error('logout Error');
  }
};

const handleReset = () => {
  filterStore.$reset();
};

const now = Date.now(); 
const date = new Date(COUNTDOWN_DATE).getTime();
const diff = computed(() => date - now);
</script>

<template>
  <div class="page__container">
    <div
      class="page__sidebar sidebar"
      :class="{ 'sidebar--open': notTablet && isOpenMobileMenu }"
    >
      <div
        v-if="notTablet"
        class="sidebar__toggle"
      >
        <icon-angle
          class="sidebar__icon icon icon--button"
          @click="isOpenMobileMenu = !isOpenMobileMenu"
        />
      </div>
      <div class="sidebar__content">
        <the-filter class="sidebar__filter" />

        <countdown-timer
          v-if="diff > 0"
          :time="diff"
          class="sidebar__countdown"
        />

        <div class="sidebar__actions">
          <app-button
            class="sidebar__actions-item"
            color="orange"
            @click="handleReset"
          >
            Сбросить фильтры
          </app-button>
          <app-button
            class="sidebar__actions-item"
            color="green"
            @click="handleLogout"
          >
            Разлогиниться
          </app-button>
        </div>
      </div>
    </div>
    <div class="page__content">
      <the-card-box />
    </div>
  </div>
</template>
