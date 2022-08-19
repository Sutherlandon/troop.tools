import { useContext } from 'react';
import UserContext from '../config/UserContext';

export default function useRoles() {
  const [user] = useContext(UserContext);

  const isAdmin = Boolean(user.roles?.includes('admin'));
  const isTrailGuide = isAdmin || Boolean(user.roles?.includes('trail-guide'));

  return {
    isAdmin,
    isTrailGuide,
  };
}
