import { useSession } from 'next-auth/react';

export default function useUser() {
  const session = useSession();

  if (!session.data) {
    return {
      isAdmin: false,
      isTrailGuide: false,
    };
  }

  const isAdmin = Boolean(session.data.user.roles?.includes('admin'));
  const isTrailGuide = isAdmin || Boolean(session.data.user.roles?.includes('trail-guide'));

  return {
    ...session.data.user,
    isAdmin,
    isTrailGuide,
  };
}

export function isAdmin(user) {
  return Boolean(user.roles?.includes('admin'));
}

export function isTrailGuide(user) {
  return isAdmin(user) || Boolean(user.roles?.includes('trail-guide'));
}
