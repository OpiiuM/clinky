import { get, ref, remove, set, update, push, child } from 'firebase/database';
import database from '@/firebase';

export class FirebaseClient {
  constructor() {
    this.database = database;
  }

  async $get(query) {
    try {
      return (await get(child(ref(this.database), query))).val() || {};
    } catch (error) {
      throw Error(error);
    }
  }

  async $create(path, data) {
    try {
      await set(ref(this.database, path), data);
    } catch (error) {
      throw Error(error);
    }
  }

  async $push(path, data) {
    try {
      return await push(ref(this.database, path), data);
    } catch (error) {
      throw Error(error);
    }
  }

  async $update(path, data) {
    try {
      await update(ref(this.database, path), data);
    } catch (error) {
      throw Error(error);
    }
  }

  async $delete(path) {
    try {
      await remove(ref(this.database, path));
    } catch (error) {
      throw Error(error);
    }
  }
}
