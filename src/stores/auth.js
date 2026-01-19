import { defineStore } from 'pinia';
import { authService } from '@/services';

// TODO: DRY
export const useAuthStore = defineStore('auth', {
  actions: {
    async login({ email, password }) {
      try {
        await authService.login({ email, password });
        const response = await authService.checkAuth();

        return response;
      } catch (error) {
        throw Error(error);
      }
    },

    async register({ email, password }) {
      try {
        await authService.register({ email, password });
        const response = await authService.checkAuth();

        return response;
      } catch (error) {
        throw Error(error);
      }
    },

    async logout() {
      try {
        await authService.logout();
        const response = await authService.checkAuth();

        return response;
      } catch (error) {
        throw Error(error);
      }
    },
  },
});
