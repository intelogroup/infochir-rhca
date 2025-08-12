import React, { createContext, useContext, ReactNode } from 'react';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { useAdminSessionTimeout } from '@/hooks/use-admin-session-timeout';
import { useAdminActionConfirm } from '@/hooks/use-admin-action-confirm';
import { AdminActionConfirmDialog } from './AdminActionConfirmDialog';

interface AdminSecurityContextType {
  confirmAction: (options: any) => Promise<string | undefined>;
  resetActivity: () => void;
  handleLogout: (reason?: 'timeout' | 'manual') => void;
  timeRemaining: number;
  showWarning: boolean;
}

const AdminSecurityContext = createContext<AdminSecurityContextType | undefined>(undefined);

export const useAdminSecurity = () => {
  const context = useContext(AdminSecurityContext);
  if (!context) {
    throw new Error('useAdminSecurity must be used within AdminSecurityProvider');
  }
  return context;
};

interface AdminSecurityProviderProps {
  children: ReactNode;
}

export const AdminSecurityProvider: React.FC<AdminSecurityProviderProps> = ({ children }) => {
  const { user, isAdmin } = useAdminAuth();
  const { 
    showWarning, 
    resetActivity, 
    handleLogout, 
    timeRemaining 
  } = useAdminSessionTimeout(isAdmin, user);
  
  const { dialogState, confirmAction, closeDialog } = useAdminActionConfirm();

  const value = {
    confirmAction,
    resetActivity,
    handleLogout,
    timeRemaining,
    showWarning,
  };

  return (
    <AdminSecurityContext.Provider value={value}>
      {children}
      <AdminActionConfirmDialog
        open={dialogState.open}
        onOpenChange={closeDialog}
        title={dialogState.options.title}
        description={dialogState.options.description}
        confirmText={dialogState.options.confirmText}
        requirePassword={dialogState.options.requirePassword}
        requireConfirmText={dialogState.options.requireConfirmText}
        variant={dialogState.options.variant}
        onConfirm={dialogState.onConfirm}
      />
    </AdminSecurityContext.Provider>
  );
};