import { defineStore } from 'pinia';
import attentionService from '@/services/attention-service';
import { getToken } from '@/services/token-manager';

const MAX_PRIORITY_FOCUS_CARDS = 3;

const getCurrentMonthKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

const getTodayKey = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

const normalizeCard = (id, card) => ({
  id,
  ...card,
  isPriorityFocus: Boolean(card?.isPriorityFocus),
});

const normalizeCards = (data) => {
  return Object.entries(data).map(([id, card]) => normalizeCard(id, card));
};

export const useAttentionStore = defineStore('attention', {
  state: () => ({
    cards: [],
    currentMonth: null,
    historyData: null,
    isLoading: false,
  }),

  getters: {
    canIncrement: () => (card) => {
      const today = getTodayKey();
      return card.lastClickDate !== today;
    },

    getCardById: (state) => (id) => {
      return state.cards.find((card) => card.id === id);
    },

    hasUnsavedChanges: (state) => {
      return state.cards.some((card) => card.count > 0);
    },

    ascCards: (state) => {
      return state.cards.toSorted((a, b) => b.count - a.count);
    },

    priorityFocusCount: (state) => {
      return state.cards.filter((card) => card.isPriorityFocus).length;
    },

    canTogglePriorityFocus: (state) => (card) => {
      if (!card) return false;

      if (card.isPriorityFocus) {
        return true;
      }

      const priorityFocusCount = state.cards.filter((item) => item.isPriorityFocus).length;
      return priorityFocusCount < MAX_PRIORITY_FOCUS_CARDS;
    },
  },

  actions: {
    async fetchCards() {
      this.isLoading = true;
      const userId = getToken();

      try {
        const currentMonthKey = getCurrentMonthKey();
        const savedMonth = await attentionService.getCurrentMonth(userId);

        // Проверка смены месяца
        if (savedMonth && savedMonth !== currentMonthKey) {
          await this.archiveAndResetMonth(savedMonth);
        }

        // Установка текущего месяца если не установлен
        if (!savedMonth) {
          await attentionService.setCurrentMonth(userId, currentMonthKey);
        }

        this.currentMonth = currentMonthKey;

        const data = await attentionService.fetchCards(userId);

        if (data && Object.keys(data).length) {
          this.cards = normalizeCards(data);
        } else {
          this.cards = [];
        }
      } catch (error) {
        console.error('Ошибка загрузки карточек:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async archiveAndResetMonth(oldMonth) {
      const userId = getToken();

      // Сохраняем текущие данные в историю
      const data = await attentionService.fetchCards(userId);

      if (data && Object.keys(data).length) {
        const historyData = {
          cards: {},
          submittedAt: Date.now(),
        };

        Object.entries(data).forEach(([id, card]) => {
          historyData.cards[id] = {
            title: card.title,
            count: card.count || 0,
          };
        });

        await attentionService.saveMonth(userId, oldMonth, historyData);

        // Обнуляем счетчики
        for (const [id] of Object.entries(data)) {
          await attentionService.updateCard(userId, id, {
            count: 0,
            lastClickDate: null,
          });
        }
      }

      // Обновляем текущий месяц
      const currentMonthKey = getCurrentMonthKey();
      await attentionService.setCurrentMonth(userId, currentMonthKey);
    },

    async addCard(title) {
      const userId = getToken();

      const cardData = {
        title,
        count: 0,
        lastClickDate: null,
        isPriorityFocus: false,
      };

      const result = await attentionService.createCard(userId, cardData);

      this.cards.push(normalizeCard(result.key, cardData));
    },

    async incrementCard(cardId) {
      const card = this.cards.find((c) => c.id === cardId);

      if (!card) return;

      const today = getTodayKey();

      if (card.lastClickDate === today) return;

      const userId = getToken();
      const newCount = (card.count || 0) + 1;

      await attentionService.updateCard(userId, cardId, {
        count: newCount,
        lastClickDate: today,
      });

      card.count = newCount;
      card.lastClickDate = today;
    },

    async deleteCard(cardId) {
      const userId = getToken();
      await attentionService.deleteCard(userId, cardId);

      const index = this.cards.findIndex((c) => c.id === cardId);

      if (index !== -1) {
        this.cards.splice(index, 1);
      }
    },

    async togglePriorityFocus(cardId) {
      const card = this.cards.find((item) => item.id === cardId);

      if (!card) return;

      const nextPriorityFocus = !card.isPriorityFocus;

      if (nextPriorityFocus && this.priorityFocusCount >= MAX_PRIORITY_FOCUS_CARDS) {
        return;
      }

      const userId = getToken();

      await attentionService.updateCard(userId, cardId, {
        isPriorityFocus: nextPriorityFocus,
      });

      card.isPriorityFocus = nextPriorityFocus;
    },

    async submitChanges() {
      const userId = getToken();

      // Сохраняем текущее состояние всех карточек
      for (const card of this.cards) {
        await attentionService.updateCard(userId, card.id, {
          count: card.count,
          lastClickDate: card.lastClickDate,
        });
      }
    },

    async resetTodayChanges() {
      const userId = getToken();
      const today = getTodayKey();

      // Сбрасываем только сегодняшние изменения
      for (const card of this.cards) {
        if (card.lastClickDate === today) {
          const newCount = Math.max(0, (card.count || 0) - 1);

          await attentionService.updateCard(userId, card.id, {
            count: newCount,
            lastClickDate: null,
          });

          card.count = newCount;
          card.lastClickDate = null;
        }
      }
    },

    async loadHistory(monthKey) {
      const userId = getToken();
      const data = await attentionService.getHistory(userId, monthKey);
      this.historyData = data;
      return data;
    },

    async getAllHistoryMonths() {
      const userId = getToken();
      const data = await attentionService.getAllHistory(userId);

      return data ? Object.keys(data).sort().reverse() : [];
    },
  },
});
