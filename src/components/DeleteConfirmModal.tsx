import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { User } from '../types/user';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({
  isOpen,
  user,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Supprimer l'utilisateur</h2>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            Êtes-vous sûr de vouloir supprimer cet utilisateur ?
          </p>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.email}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Role: {user.role}</p>
          </div>
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            Cette action est irréversible. L'utilisateur sera supprimé de l'authentification et de la base de données.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}