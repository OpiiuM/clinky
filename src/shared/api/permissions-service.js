import { FirebaseClient } from './FirebaseClient';

class PermissionsService extends FirebaseClient {
  async hasCurrenciesAccess(uid) {
    if (!uid) {
      return false;
    }

    try {
      const value = await this.$get(`permissions/features/currencies/${uid}`);
      return value === true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async grantCurrenciesAccess(uid) {
    if (!uid) {
      return false;
    }

    try {
      await this.$create(`permissions/features/currencies/${uid}`, true);
      return true;
    } catch (error) {
      throw Error(error);
    }
  }
}

export default new PermissionsService();
