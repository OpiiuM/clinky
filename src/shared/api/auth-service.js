import { FirebaseClient } from './FirebaseClient';
import { setToken, removeToken } from '@/services/token-manager';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  signOut,
} from 'firebase/auth';

class AuthService extends FirebaseClient {
  async #getUid() {
    const user = getAuth().currentUser;

    return user ? user.uid : null;
  }

  async register({ email, password }) {
    try {
      await createUserWithEmailAndPassword(getAuth(), email, password);

      const uid = await this.#getUid();
      setToken(uid);

      await this.$create(`users/${uid}`, {
        dateTimeCreated: new Date().toLocaleString(),
      });
    } catch (error) {
      throw Error(error);
    }
  }

  async login({ email, password }) {
    try {
      await signInWithEmailAndPassword(getAuth(), email, password);

      const uid = await this.#getUid();
      setToken(uid);
    } catch (error) {
      throw Error(error);
    }
  }

  async logout() {
    try {
      await signOut(getAuth());
      removeToken();
    } catch (error) {
      throw Error(error);
    }
  }

  // TODO: ?
  async checkAuth() {
    const uid = await this.#getUid();

    return uid ? 'Success' : 'Error';
  }
}

export default new AuthService();
