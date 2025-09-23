import React from 'react';
import { Edit, Trash2, Mail, User as UserIcon, Clock } from 'lucide-react';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { User } from '../../types/User';
import { LayoutType } from '../../types/Common';

interface UserListProps {
  users: User[];
  isLoading?: boolean;
  isAdmin?: boolean;
  onView?: (user: User) => void;
  onEdit?: (user: User) => void;
  onDelete?: (id: string) => void;
  layoutType?: LayoutType;
  onLayoutChange?: (layout: LayoutType) => void;
}

export const UserList: React.FC<UserListProps> = ({
  users = [],
  isLoading = false,
  isAdmin = false,
  onView,
  onEdit,
  onDelete,
  layoutType = 'grid',
  onLayoutChange
}): JSX.Element => {
  const renderEmpty = () => (
    <div className="text-center py-12 text-gray-600">
      <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
        <UserIcon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
      <p className="text-gray-600">Create a user to manage access to the admin area.</p>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (!users || users.length === 0) return renderEmpty();

  const UserCard: React.FC<{ user: User; layout: LayoutType }> = ({ user, layout }) => {
    const fullName = `${ user.firstname ? (user.firstname?.charAt(0).toUpperCase() + user.firstname?.slice(1)) : ''} ${ user.lastname ? (user.lastname?.charAt(0).toUpperCase() + user.lastname?.slice(1)) : ''}`.trim() || user.email;
    const lastLogin = user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never';

    return (
      <article
        className={`bg-white rounded-lg shadow-sm overflow-hidden transition-shadow hover:shadow-md ${
          layout === 'list' ? 'flex items-center' : ''
        }`}
      >
        <div className={`p-4 flex items-center justify-center ${layout === 'list' ? 'w-1/4' : ''}`}>
          <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-xl font-semibold text-gray-600">
            {user.firstname?.charAt(0).toUpperCase() ?? 'U'}
          </div>
        </div>

        <div className={`${layout === 'list' ? 'w-3/4 p-4' : 'p-4'}`}>
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">{fullName}</h4>
              <div className="text-sm text-gray-600">{user.email}</div>
              <div className="text-xs text-gray-500 mt-1">Role: {user.role ?? 'VIEWER'}</div>
            </div>

            {isAdmin && (
              <div className="flex items-start gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit && onEdit(user);
                  }}
                  icon={Edit}
                >
                  {/* Edit */}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onDelete && user.id) onDelete(user.id);
                  }}
                  icon={Trash2}
                  className="text-red-600"
                >
                  {/* Delete */}
                </Button>
              </div>
            )}
          </div>

          <div className="mt-3 py-2 gap-4 grin grid-cols-1 grid-rows-2 text-sm text-gray-600">
            <div className="flex items-center gap-2 col-span-2 mb-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="truncate max-w-[220px]" title={user.email}>{user.email}</span>
            </div>
            <div className="flex items-center gap-2 col-span-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span title={lastLogin}>{lastLogin}</span>
            </div>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">Showing {users.length} user{users.length !== 1 ? 's' : ''}</div>

        {onLayoutChange && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onLayoutChange('grid')}
              className={`px-2 py-1 rounded ${layoutType === 'grid' ? 'bg-gray-300' : ''}`}
              aria-label="Grid view"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="13" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="3" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="13" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/></svg>
            </button>
            <button
              onClick={() => onLayoutChange('list')}
              className={`px-2 py-1 rounded ${layoutType === 'list' ? 'bg-gray-300' : ''}`}
              aria-label="List view"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        )}
      </div>

      {layoutType === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map(u => (
            <div key={u.id} onClick={() => onView && onView(u)}>
              <UserCard key={u.id} user={u} layout="grid" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {users.map(u => (
            <div key={u.id} onClick={() => onView && onView(u)}>
              <UserCard key={u.id} user={u} layout="list" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList;
