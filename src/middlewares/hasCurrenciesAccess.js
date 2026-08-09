import { getToken, permissionsService } from '@/shared/api';

export const hasCurrenciesAccess = async () => {
  const uid = getToken();

  if (uid && (await permissionsService.hasCurrenciesAccess(uid))) {
    return true;
  }

  return { path: '/app' };
};
