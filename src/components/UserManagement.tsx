import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { getAdminAuth } from '../services/auth';
import { PlusCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { fetchUsers, createUser, updateUser, deleteUserDoc } from '../services/userService';
import TopNav from './navigation/TopNav';
import UserList from './UserList';
import RoleModal from './RoleModal';
import CreateUserModal from './CreateUserModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import LoadingSpinner from './LoadingSpinner';
import type { User as UserType, Role } from '../types/user';

export default function UserManagement() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const adminAuth = getAdminAuth();

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0 && adminAuth.currentUser) {
      const user = users.find(u => u.userId === adminAuth.currentUser?.uid);
      if (user) {
        setCurrentUser(user);
      }
    }
  }, [users, adminAuth.currentUser]);

  const loadUsers = async () => {
    try {
      const usersData = await fetchUsers();
      setUsers(usersData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Échec du chargement des utilisateurs');
      setLoading(false);
    }
  };

  const handleCreateUser = async (
    email: string,
    password: string,
    role: Role,
    firstName: string,
    lastName: string,
    mobile: string
  ) => {
    try {
      await createUser(email, password, role, firstName, lastName, mobile);
      toast.success('Utilisateur créé avec succès');
      setIsCreateModalOpen(false);
      loadUsers();
    } catch (error: any) {
      console.error('Error creating user:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Cet email est déjà enregistré');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Adresse email invalide');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Le mot de passe doit contenir au moins 6 caractères');
      } else {
        toast.error('Échec de la création de l\'utilisateur');
      }
    }
  };

  const handleEditRole = (user: UserType) => {
    setSelectedUser(user);
    setIsRoleModalOpen(true);
  };

  const handleUpdateRole = async (userId: string, updates: Partial<UserType>, newPassword?: string) => {
    try {
      await updateUser(userId, updates);
      toast.success('Informations mises à jour avec succès');
      loadUsers();
      setIsRoleModalOpen(false);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Échec de la mise à jour');
    }
  };

  const handleDeleteClick = (user: UserType) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    try {
      await deleteUserDoc(selectedUser.id);
      toast.success('Utilisateur supprimé avec succès');
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Échec de la suppression');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(adminAuth);
      toast.success('Déconnexion réussie');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Échec de la déconnexion');
    }
  };

  if (loading || !currentUser) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Toaster position="top-right" />
      
      <TopNav user={currentUser} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-4 sm:px-0">
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Ajouter un utilisateur
            </button>
          </div>

          <UserList
            users={users}
            onEditRole={handleEditRole}
            onDeleteUser={handleDeleteClick}
          />

          <RoleModal
            user={selectedUser}
            isOpen={isRoleModalOpen}
            onClose={() => {
              setIsRoleModalOpen(false);
              setSelectedUser(null);
            }}
            onSave={handleUpdateRole}
          />

          <CreateUserModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSave={handleCreateUser}
          />

          <DeleteConfirmModal
            isOpen={isDeleteModalOpen}
            user={selectedUser}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedUser(null);
            }}
            onConfirm={handleDeleteConfirm}
          />
        </div>
      </main>
    </div>
  );
}