
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole } from '@/types';
import { toast } from '@/components/ui/sonner';

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  toggleRole: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<UserRole>('customer');

  const toggleRole = () => {
    const newRole = role === 'customer' ? 'librarian' : 'customer';
    setRole(newRole);
    toast.success(`Switched to ${newRole} view`);
  };

  return (
    <RoleContext.Provider value={{ role, setRole, toggleRole }}>
      {children}
    </RoleContext.Provider>
  );
};
