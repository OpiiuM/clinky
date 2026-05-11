import { FirebaseClient } from './FirebaseClient';

class FilterService extends FirebaseClient {
  async getFilters(uid) {
    try {
      return uid && (await this.$get(`users/${uid}/filters`));
    } catch (error) {
      throw Error(error);
    }
  }

  async saveFilters(uid, data) {
    try {
      return uid && (await this.$create(`users/${uid}/filters`, data));
    } catch (error) {
      throw Error(error);
    }
  }

  async removeFilters(uid) {
    try {
      return uid && (await this.$delete(`users/${uid}/filters`));
    } catch (error) {
      throw Error(error);
    }
  }
}

export default new FilterService();
