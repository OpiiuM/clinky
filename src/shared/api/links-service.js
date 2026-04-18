import { FirebaseClient } from './FirebaseClient';

class LinksService extends FirebaseClient {
  async fetchLinks(uid) {
    try {
      return uid && (await this.$get(`users/${uid}/links`));
    } catch (error) {
      throw Error(error);
    }
  }

  async createLink(uid, data) {
    try {
      return uid && (await this.$push(`users/${uid}/links`, data));
    } catch (error) {
      throw Error(error);
    }
  }

  async removeLink(uid, linkId) {
    try {
      return uid && (await this.$delete(`users/${uid}/links/${linkId}`));
    } catch (error) {
      throw Error(error);
    }
  }

  async updateLink(uid, linkId, data) {
    try {
      return uid && (await this.$update(`users/${uid}/links/${linkId}`, data));
    } catch (error) {
      throw Error(error);
    }
  }
}

export default new LinksService();
