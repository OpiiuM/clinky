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

const VALID_GOALS = [3, 6];

const normalizeGoal = (goal) => (goal === 3 ? 3 : 6);

const normalizeStamps = (stamps, goal) => {
  const value = stamps || 0;
  return Math.min(Math.max(0, value), goal);
};

const normalizeCard = (id, card) => {
  const goal = normalizeGoal(card?.goal);
  return {
    id,
    ...card,
    goal,
    stamps: normalizeStamps(card?.stamps, goal),
    reward: (card?.reward || '').trim(),
    isPriorityFocus: Boolean(card?.isPriorityFocus),
    isArchived: Boolean(card?.isArchived),
  };
};

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
      return card.lastClickDate !== today && (card.stamps || 0) < card.goal;
    },

    isReadyToClaim: () => (card) => {
      return (card?.stamps || 0) >= card.goal;
    },

    getCardById: (state) => (id) => {
      return state.cards.find((card) => card.id === id);
    },

    hasUnsavedChanges: (state) => {
      return state.cards.some((card) => !card.isArchived && card.count > 0);
    },

    ascCards: (state) => {
      return state.cards
        .filter((card) => !card.isArchived)
        .toSorted((a, b) => b.count - a.count);
    },

    activeCards: (state) => {
      return state.cards
        .filter((card) => !card.isArchived)
        .toSorted((a, b) => b.count - a.count);
    },

    archivedCards: (state) => {
      return state.cards
        .filter((card) => card.isArchived)
        .toSorted((a, b) => b.count - a.count);
    },

    priorityFocusCount: (state) => {
      return state.cards.filter((card) => !card.isArchived && card.isPriorityFocus).length;
    },

    canTogglePriorityFocus: (state) => (card) => {
      if (!card) return false;

      if (card.isPriorityFocus) {
        return true;
      }

      const priorityFocusCount = state.cards.filter((item) => {
        return !item.isArchived && item.isPriorityFocus;
      }).length;
      return priorityFocusCount < MAX_PRIORITY_FOCUS_CARDS;
    },

    canEditGoal: () => (card) => {
      return (card?.stamps || 0) === 0;
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
        const activeCards = Object.entries(data).filter(([, card]) => !card.isArchived);
        const historyData = {
          cards: {},
          submittedAt: Date.now(),
        };

        activeCards.forEach(([id, card]) => {
          historyData.cards[id] = {
            title: card.title,
            count: card.count || 0,
            isPriorityFocus: Boolean(card.isPriorityFocus),
          };
        });

        if (activeCards.length) {
          await attentionService.saveMonth(userId, oldMonth, historyData);
        }

        // Обнуляем счетчики
        for (const [id] of activeCards) {
          await attentionService.updateCard(userId, id, {
            count: 0,
            stamps: 0,
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
        stamps: 0,
        goal: 6,
        reward: '',
        lastClickDate: null,
        isPriorityFocus: false,
        isArchived: false,
      };

      const result = await attentionService.createCard(userId, cardData);

      this.cards.push(normalizeCard(result.key, cardData));
    },

    async incrementCard(cardId) {
      const card = this.cards.find((c) => c.id === cardId);

      if (!card) return;

      const today = getTodayKey();

      if (card.lastClickDate === today || (card.stamps || 0) >= card.goal) return;

      const userId = getToken();
      const newStamps = (card.stamps || 0) + 1;

      await attentionService.updateCard(userId, cardId, {
        stamps: newStamps,
        lastClickDate: today,
      });

      card.stamps = newStamps;
      card.lastClickDate = today;
    },

    async claimReward(cardId) {
      const card = this.cards.find((c) => c.id === cardId);

      if (!card || (card.stamps || 0) < card.goal) return;

      const userId = getToken();
      const today = getTodayKey();
      const newCount = (card.count || 0) + 1;

      await attentionService.updateCard(userId, cardId, {
        count: newCount,
        stamps: 0,
        lastClickDate: today,
      });

      card.count = newCount;
      card.stamps = 0;
      card.lastClickDate = today;
    },

    async updateGoal(cardId, goal) {
      if (!VALID_GOALS.includes(goal)) return;

      const card = this.cards.find((c) => c.id === cardId);
      if (!card || card.goal === goal) return;
      if ((card.stamps || 0) !== 0) return;

      const userId = getToken();

      await attentionService.updateCard(userId, cardId, { goal });

      card.goal = goal;
    },

    async updateReward(cardId, reward) {
      const card = this.cards.find((c) => c.id === cardId);
      if (!card) return;

      const normalizedReward = (reward || '').trim();
      if (card.reward === normalizedReward) return;

      const userId = getToken();

      await attentionService.updateCard(userId, cardId, {
        reward: normalizedReward,
      });

      card.reward = normalizedReward;
    },

    async updateCardSettings(cardId, { goal, reward }) {
      const card = this.cards.find((c) => c.id === cardId);
      if (!card || (card.stamps || 0) !== 0) return;

      const normalizedGoal = normalizeGoal(goal);
      const normalizedReward = (reward || '').trim();
      const updateData = {};

      if (card.goal !== normalizedGoal) {
        updateData.goal = normalizedGoal;
      }
      if (card.reward !== normalizedReward) {
        updateData.reward = normalizedReward;
      }

      if (!Object.keys(updateData).length) return;

      const userId = getToken();
      await attentionService.updateCard(userId, cardId, updateData);

      if (updateData.goal !== undefined) {
        card.goal = normalizedGoal;
      }
      if (updateData.reward !== undefined) {
        card.reward = normalizedReward;
      }
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

    async archiveCard(cardId) {
      const card = this.cards.find((item) => item.id === cardId);

      if (!card) return;

      const userId = getToken();

      await attentionService.updateCard(userId, cardId, {
        isArchived: true,
        isPriorityFocus: false,
        count: 0,
        stamps: 0,
        lastClickDate: null,
      });

      card.isArchived = true;
      card.isPriorityFocus = false;
      card.count = 0;
      card.stamps = 0;
      card.lastClickDate = null;
    },

    async restoreCard(cardId) {
      const card = this.cards.find((item) => item.id === cardId);

      if (!card) return;

      const userId = getToken();

      await attentionService.updateCard(userId, cardId, {
        isArchived: false,
        count: 0,
        stamps: 0,
        lastClickDate: null,
      });

      card.isArchived = false;
      card.count = 0;
      card.stamps = 0;
      card.lastClickDate = null;
    },

    async submitChanges() {
      const userId = getToken();

      // Сохраняем текущее состояние всех карточек
      for (const card of this.activeCards) {
        await attentionService.updateCard(userId, card.id, {
          count: card.count,
          stamps: card.stamps,
          lastClickDate: card.lastClickDate,
        });
      }
    },

    async resetTodayChanges() {
      const userId = getToken();
      const today = getTodayKey();

      for (const card of this.activeCards) {
        if (card.lastClickDate !== today) continue;

        const currentStamps = card.stamps || 0;
        let updateData;

        if (currentStamps >= card.goal) {
          updateData = { stamps: card.goal - 1, lastClickDate: null };
          card.stamps = card.goal - 1;
        } else if (currentStamps === 0) {
          updateData = {
            count: Math.max(0, (card.count || 0) - 1),
            stamps: card.goal,
            lastClickDate: null,
          };
          card.count = Math.max(0, (card.count || 0) - 1);
          card.stamps = card.goal;
        } else {
          updateData = {
            stamps: currentStamps - 1,
            lastClickDate: null,
          };
          card.stamps = currentStamps - 1;
        }

        await attentionService.updateCard(userId, card.id, updateData);
        card.lastClickDate = null;
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
