import { FirebaseClient } from './FirebaseClient';

class TempStorageService extends FirebaseClient {
  async fetchLinks(uid) {
    try {
      return uid && (await this.$get(`users/${uid}/storage`));
    } catch (error) {
      throw Error(error);
    }
  }

  async createLink(uid, data) {
    try {
      return uid && (await this.$push(`users/${uid}/storage`, data));
    } catch (error) {
      throw Error(error);
    }
  }

  async removeLink(uid, linkId) {
    try {
      return uid && (await this.$delete(`users/${uid}/storage/${linkId}`));
    } catch (error) {
      throw Error(error);
    }
  }

  async updateLink(uid, linkId, data) {
    try {
      return uid && (await this.$update(`users/${uid}/storage/${linkId}`, data));
    } catch (error) {
      throw Error(error);
    }
  }
}

export default new TempStorageService();
