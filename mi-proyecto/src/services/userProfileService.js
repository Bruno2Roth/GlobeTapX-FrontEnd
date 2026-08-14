import { getCurrentUser } from "../config";
import { getCachedUserProfile as readCachedUserProfile, cacheUserProfile } from "../helpers/userProfileCache";
import { getAuthSession, setAuthSession } from "./authSession";

const profileRequests = new Map();

function unwrapUser(response) {
  return response?.user || response?.data?.user || response?.data || response;
}

export function getCachedUserProfile(userId) {
  const sessionUser = getAuthSession().user;
  if (sessionUser?.id && String(sessionUser.id) === String(userId)) {
    return sessionUser;
  }
  return readCachedUserProfile(userId);
}

export function refreshUserProfile(userId) {
  if (!userId) return Promise.resolve(null);

  const key = String(userId);
  if (!profileRequests.has(key)) {
    const request = getCurrentUser()
      .then((response) => {
        const user = unwrapUser(response);
        if (!user?.id) throw new Error("No se encontró el perfil del usuario");

        cacheUserProfile(user);
        const session = getAuthSession();
        if (String(session.user?.id) === key) {
          setAuthSession({ ...session.user, ...user }, session.photo);
        }
        return user;
      })
      .finally(() => profileRequests.delete(key));

    profileRequests.set(key, request);
  }

  return profileRequests.get(key);
}
