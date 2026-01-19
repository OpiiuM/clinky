import { defineStore } from 'pinia';

export const useModalStore = defineStore('modal', {
  state: () => ({
    modalCreate: false,
    modalEdit: false,
    modalMultipleEdit: false,
    modalTimerEdit: false,
    modalConfirmRemoveLinks: false,
  }),

  actions: {
    handleOpenModal(key) {
      this.$state[key] = true;
    },

    handleCloseModal(key) {
      this.$state[key] = false;
    },

    handleToggleModal(key) {
      this.$state[key] = !this.$state[key];
    },
  },
});
