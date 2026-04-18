<script setup>
import { computed, onMounted } from 'vue';
import VueCountdown from '@chenfengyuan/vue-countdown';
import { storeToRefs } from 'pinia';

import FormEditTimer from '@/modules/app/form/FormEditTimer.vue';
import { useTimerStore, useModalStore } from '@/stores';
import AppButton from '@/common/components/AppButton.vue';

const timerStore = useTimerStore();
const { timer } = storeToRefs(timerStore);
const { fetchTimer } = timerStore;

onMounted(async () => {
  await fetchTimer();
});

const modalStore = useModalStore();
const { modalTimerEdit } = storeToRefs(modalStore);
const { handleOpenModal, handleCloseModal } = modalStore;

const diff = computed(() => {
  if (!timer.value) {
    return 0;
  }

  return new Date(timer.value).getTime() - Date.now();
});

const displayTime = (time) => time >= 10 ? time : `0${time}`;
</script>

<template>
  <AppButton
    v-bind="$attrs"
    outline
    class="countdown-timer"
    @click="handleOpenModal('modalTimerEdit')"
  >
    <vue-countdown
      v-if="diff > 0"
      :time="diff"
      v-slot="{ days, hours, minutes, seconds }"
    >
      <span>{{ days }}</span>
      :
      <span>{{ displayTime(hours) }}</span>
      :
      <span>{{ displayTime(minutes) }}</span>
      :
      <span>{{ displayTime(seconds) }}</span>
    </vue-countdown>

    <span v-else>
      Создать таймер
    </span>
  </AppButton>

  <app-modal
    :is-open="modalTimerEdit"
    @close="handleCloseModal('modalTimerEdit')"
  >
    <form-edit-timer @submit="handleCloseModal('modalTimerEdit')" />
  </app-modal>
</template>

<style lang="scss" scoped>
.countdown-timer {
    width: 100%;

    text-align: center;
}

:deep(.button__text) {
  @include text-size(18px, 24px, 700);
}
</style>
