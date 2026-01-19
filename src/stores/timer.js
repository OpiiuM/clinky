import { defineStore } from 'pinia';
import { getToken } from '@/services/token-manager';
import timerService from '@/services/timer-service';

export const useTimerStore = defineStore('timer', {
  state: () => ({
    timer: '03-01-2026',
  }),

  actions: {
    async fetchTimer() {
      const userId = getToken();
      const data = await timerService.fetchTimer(userId);

      this.timer = data;
    },

    async updateTimer(dateString) {
      const userId = getToken();

      await timerService.createTimer(userId, dateString);

      this.timer = dateString;
    },

    async removeTimer() {
      const userId = getToken();

      await timerService.removeTimer(userId);

      this.timer = '';
    },
  },
});
