import { FirebaseClient } from './FirebaseClient';

class AttentionService extends FirebaseClient {
  async fetchCards(uid) {
    try {
      return uid && (await this.$get(`users/${uid}/attention/cards`));
    } catch (error) {
      throw Error(error);
    }
  }

  async getCurrentMonth(uid) {
    try {
      return uid && (await this.$get(`users/${uid}/attention/currentMonth`));
    } catch (error) {
      throw Error(error);
    }
  }

  async setCurrentMonth(uid, monthKey) {
    try {
      return uid && (await this.$create(`users/${uid}/attention/currentMonth`, monthKey));
    } catch (error) {
      throw Error(error);
    }
  }

  async createCard(uid, data) {
    try {
      return uid && (await this.$push(`users/${uid}/attention/cards`, data));
    } catch (error) {
      throw Error(error);
    }
  }

  async updateCard(uid, cardId, data) {
    try {
      return uid && (await this.$update(`users/${uid}/attention/cards/${cardId}`, data));
    } catch (error) {
      throw Error(error);
    }
  }

  async deleteCard(uid, cardId) {
    try {
      return uid && (await this.$delete(`users/${uid}/attention/cards/${cardId}`));
    } catch (error) {
      throw Error(error);
    }
  }

  async saveMonth(uid, monthKey, data) {
    try {
      return uid && (await this.$create(`users/${uid}/attention/history/${monthKey}`, data));
    } catch (error) {
      throw Error(error);
    }
  }

  async getHistory(uid, monthKey) {
    try {
      return uid && (await this.$get(`users/${uid}/attention/history/${monthKey}`));
    } catch (error) {
      throw Error(error);
    }
  }

  async getAllHistory(uid) {
    try {
      return uid && (await this.$get(`users/${uid}/attention/history`));
    } catch (error) {
      throw Error(error);
    }
  }
}

export default new AttentionService();
