import React from 'react';
import { LogOut } from 'lucide-react';
import { User } from '../../types/user';
import UserInfo from './UserInfo';
import ThemeToggle from '../ThemeToggle';

interface TopNavProps {
  user: User;
  onLogout: () => void;
}

export default function TopNav({ user, onLogout }: TopNavProps) {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <img 
              src="https://raw.githubusercontent.com/es-ia-academy/site/main/media/images/ia-academy-ico_100x100.png"
              alt="Logo"
              className="h-10 w-10 aspect-square object-contain rounded-full border-3 border-black p-[5px]"
            />
            <div className="ml-3 flex flex-col">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white leading-tight">
                IA Academy
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Administrateurs
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <UserInfo user={user} />
            <ThemeToggle />
            <button
              onClick={onLogout}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Déconnexion"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}