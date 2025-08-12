import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ConfirmActionOptions {
  title: string;
  description: string;
  confirmText?: string;
  requirePassword?: boolean;
  requireConfirmText?: string;
  variant?: 'default' | 'destructive';
  eventType?: string;
  eventData?: any;
}

export const useAdminActionConfirm = () => {
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    options: ConfirmActionOptions;
    onConfirm: (password?: string) => void;
  }>({
    open: false,
    options: {} as ConfirmActionOptions,
    onConfirm: () => {},
  });

  const confirmAction = useCallback(
    (options: ConfirmActionOptions): Promise<string | undefined> => {
      return new Promise((resolve, reject) => {
        setDialogState({
          open: true,
          options,
          onConfirm: async (password?: string) => {
            try {
              // Validate password if required
              if (options.requirePassword && password) {
                const { error } = await supabase.auth.signInWithPassword({
                  email: (await supabase.auth.getUser()).data.user?.email || '',
                  password,
                });
                
                if (error) {
                  reject(new Error('Mot de passe incorrect'));
                  return;
                }
              }

              // Log security event
              if (options.eventType) {
                await supabase.rpc('log_security_event', {
                  event_type_param: options.eventType,
                  event_data_param: options.eventData || {}
                });
              }

              resolve(password);
            } catch (error) {
              reject(error);
            }
          },
        });
      });
    },
    []
  );

  const closeDialog = useCallback(() => {
    setDialogState(prev => ({ ...prev, open: false }));
  }, []);

  return {
    dialogState,
    confirmAction,
    closeDialog,
  };
};