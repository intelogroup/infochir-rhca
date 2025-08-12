import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, AlertTriangle } from "lucide-react";

interface AdminActionConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  requirePassword?: boolean;
  requireConfirmText?: string;
  variant?: 'default' | 'destructive';
  onConfirm: (password?: string) => void;
}

export const AdminActionConfirmDialog: React.FC<AdminActionConfirmDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirmer",
  requirePassword = false,
  requireConfirmText,
  variant = 'default',
  onConfirm,
}) => {
  const [password, setPassword] = useState('');
  const [confirmTextInput, setConfirmTextInput] = useState('');

  const isConfirmEnabled = 
    (!requirePassword || password.length > 0) &&
    (!requireConfirmText || confirmTextInput === requireConfirmText);

  const handleConfirm = () => {
    if (isConfirmEnabled) {
      onConfirm(requirePassword ? password : undefined);
      setPassword('');
      setConfirmTextInput('');
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setPassword('');
    setConfirmTextInput('');
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            {variant === 'destructive' ? (
              <AlertTriangle className="h-5 w-5 text-destructive" />
            ) : (
              <Shield className="h-5 w-5 text-primary" />
            )}
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          {requireConfirmText && (
            <div className="space-y-2">
              <Label htmlFor="confirm-text">
                Tapez <strong>"{requireConfirmText}"</strong> pour confirmer:
              </Label>
              <Input
                id="confirm-text"
                value={confirmTextInput}
                onChange={(e) => setConfirmTextInput(e.target.value)}
                placeholder={requireConfirmText}
              />
            </div>
          )}

          {requirePassword && (
            <div className="space-y-2">
              <Label htmlFor="admin-password">Mot de passe administrateur:</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez votre mot de passe"
              />
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!isConfirmEnabled}
            className={variant === 'destructive' ? 'bg-destructive hover:bg-destructive/90' : ''}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};