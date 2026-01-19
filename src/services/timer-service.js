import { FirebaseClient } from './FirebaseClient';

class TimerService extends FirebaseClient {
  async fetchTimer(uid) {
    try {
      return uid && (await this.$get(`users/${uid}/timer`));
    } catch (error) {
      throw Error(error);
    }
  }

  async createTimer(uid, data) {
    try {
      return uid && (await this.$create(`users/${uid}/timer`, data));
    } catch (error) {
      throw Error(error);
    }
  }

  async removeTimer(uid) {
    try {
      return uid && (await this.$delete(`users/${uid}/timer`, ''));
    } catch (error) {
      throw Error(error);
    }
  }
}

export default new TimerService();
