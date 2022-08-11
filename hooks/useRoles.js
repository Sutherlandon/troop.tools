import { useContext } from 'react';
import UserContext from '../config/UserContext';

export default function useRoles() {
  const [user] = useContext(UserContext);

  const isAdmin = user.roles.includes('admin');
  const isTrailGuide = isAdmin || user.roles.includes('trail-guide');

  return {
    isAdmin,
    isTrailGuide,
  };
}
