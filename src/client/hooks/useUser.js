import { useSession } from 'next-auth/react';

export default function useUser() {
  const session = useSession();

  if (!session.data) {
    return {
      isAdmin: false,
      isParent: false,
      isTrailGuide: false,
    };
  }

  const isAdmin = Boolean(session.data.user.roles?.admin);
  const isTrailGuide = isAdmin || Boolean(session.data.user.roles?.trailguide);
  const isParent = isAdmin || isTrailGuide || Boolean(session.data.user.roles?.trailguide);

  return {
    ...session.data.user,
    isAdmin,
    isParent,
    isTrailGuide,
  };
}

export function isAdmin(user) {
  return Boolean(user.roles?.admin);
}

export function isTrailGuide(user) {
  return isAdmin(user) || Boolean(user.roles?.['trail-guide']);
}
