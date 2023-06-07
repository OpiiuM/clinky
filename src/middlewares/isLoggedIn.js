import { getAuth, onAuthStateChanged } from 'firebase/auth';

const getCurrentUser = async () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener();
        resolve(user);
      },
      reject,
    );
  }).then().catch((e) => console.error(e));
};

export const isLoggedIn = async () => {
  if (await getCurrentUser()) {
    return true;
  } else {
    return { path: '/auth' };
  }
};
