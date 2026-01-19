import { defineStore } from 'pinia';

export const useTempStorage = defineStore('tempStorage', {
  state: () => ({
    storage: [],
  }),

  getters: {
    isSomeoneStorage: ({ storage }) => storage.length > 0,
  },

  actions: {
    fetchTempStorage() {},

    addLinkToTempStorage(link) {
      if (this.storage.some((tempLink) => tempLink.id === link.id)) return;

      this.storage.push(link);
    },

    removeLinkFromTempStorage(linkId) {
      this.storage = this.storage.filter((item) => item.id !== linkId);
    },

    openTempStorageLinks() {
      this.storage.forEach(async (link) => {
        setTimeout(() => {
          window.open(link.href, '_blank');
        }, 100);
      });
    },
  },
});
