import React, { useEffect, useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Plus, Filter } from 'lucide-react';
import userService from '../../services/userService';
import UserList from '../../components/user/UserList';
import UserForm from '../../components/user/UserForm';
import { User } from '../../types/User';
import { LayoutType, FilterOptions } from '../../types/Common';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [layoutType, setLayoutType] = useState<LayoutType>('grid');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, filters]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await userService.getAll();
      console.log(`Users Data: ${data}`);
      setUsers(data ?? []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    console.log(`Users Initial: ${users}`);
    let list = [...users];

    // text search across name/email
    if (filters.search) {
      const q = String(filters.search).toLowerCase().trim();
      list = list.filter(u =>
        `${u.firstname ?? ''} ${u.lastname ?? ''}`.toLowerCase().includes(q) ||
        (u.email ?? '').toLowerCase().includes(q)
      );
    }

    // role filter
    if (filters.status) {
      const role = String(filters.status).toUpperCase();
      list = list.filter(u => (u.role ?? '').toUpperCase() === role);
    }

    console.log(`Users Pulled: ${list}`);
    setFilteredUsers(list);
    console.log(`Users filtered: ${filteredUsers}`);
  };

  const handleCreate = () => {
    setSelectedUser(undefined);
    setIsFormModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsFormModalOpen(true);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await userService.delete(id);
      await fetchUsers();
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const handleFormSubmit = async (payload: any) => {
    try {
      setIsSubmitting(true);
      // payload will either be a create payload (no id) or an update payload (has id)
      if ((payload as any).id) {
        await userService.update(payload);
      } else {
        await userService.create(payload);
      }
      setIsFormModalOpen(false);
      setSelectedUser(undefined);
      await fetchUsers();
    } catch (err) {
      console.error('Failed to save user:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearFilters = () => setFilters({});

  const hasActiveFilters = Object.keys(filters).some(key => filters[key as keyof FilterOptions] !== undefined && filters[key as keyof FilterOptions] !== '');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">Manage application users and roles</p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            icon={Filter}
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className={hasActiveFilters ? 'bg-primary-50 border-primary-200 text-primary-700' : ''}
          >
            Filters
          </Button>

          <Button
            variant="primary"
            icon={Plus}
            onClick={handleCreate}
          >
            New User
          </Button>
        </div>
      </div>

      {/* Filters */}
      {isFiltersOpen && (
        <div className="mb-4 bg-white rounded-md p-4 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={String(filters.search ?? '')}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>

            <div className="flex gap-2 items-center">
              <select
                value={String(filters.status ?? '')}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value || undefined }))}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="">All roles</option>
                <option value="ADMIN">Admin</option>
                <option value="EDITOR">Editor</option>
                <option value="USER">User</option>
                <option value="VIEWER">Viewer</option>
              </select>

              <Button variant="ghost" onClick={handleClearFilters}>Clear</Button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div>
        <UserList
          users={filteredUsers}
          isLoading={isLoading}
          isAdmin={true}
          onEdit={handleEdit}
          onDelete={(id) => handleDelete(id)}
          layoutType={layoutType}
          onLayoutChange={setLayoutType}
        />
      </div>

      {!isLoading && filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Button variant="outline" onClick={handleCreate}>Add First User</Button>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedUser(undefined);
        }}
        title={selectedUser ? 'Edit User' : 'Create User'}
        size="lg"
      >
        <UserForm
          user={selectedUser}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsFormModalOpen(false);
            setSelectedUser(undefined);
          }}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default UsersPage;
