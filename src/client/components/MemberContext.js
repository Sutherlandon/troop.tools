import { createContext, useContext } from 'react';

const MemberContext = createContext();

export default MemberContext;

export function useMember() {
  return useContext(MemberContext);
}
