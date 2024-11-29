import React from 'react';
import { User as UserIcon } from 'lucide-react';
import type { User } from '../../types/user';

interface UserInfoProps {
  user: User;
}

export default function UserInfo({ user }: UserInfoProps) {
  const formatName = () => {
    const lastName = user.lastName || '';
    return `${user.firstName} ${lastName.charAt(0)}.`;
  };

  const formatRole = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <div className="flex items-center text-sm">
      <UserIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      <div className="ml-2 flex flex-col">
        <span className="font-medium text-gray-900 dark:text-white">
          {formatName()}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatRole(user.role)}
        </span>
      </div>
    </div>
  );
}