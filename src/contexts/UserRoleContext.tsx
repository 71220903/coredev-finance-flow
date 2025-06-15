
import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserMode = 'lender' | 'borrower';

interface UserRoleContextType {
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export const UserRoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userMode, setUserModeState] = useState<UserMode>(() => {
    const saved = localStorage.getItem('userMode');
    return (saved as UserMode) || 'borrower';
  });
  const [isAdmin, setIsAdmin] = useState(false);

  const setUserMode = (mode: UserMode) => {
    setUserModeState(mode);
    localStorage.setItem('userMode', mode);
  };

  useEffect(() => {
    localStorage.setItem('userMode', userMode);
  }, [userMode]);

  return (
    <UserRoleContext.Provider value={{ userMode, setUserMode, isAdmin, setIsAdmin }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = () => {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
};
