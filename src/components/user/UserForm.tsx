import React, { useEffect, useState } from 'react';
import { Save, X } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { User, UserRequest, UpdateUserRequest, UserRole } from '../../types/User';

interface UserFormProps {
  user?: User;
  onSubmit: (data: UserRequest | UpdateUserRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
  user,
  onSubmit,
  onCancel,
  isLoading = false,
}): JSX.Element => {
  const [form, setForm] = useState<UserRequest>({
    email: '',
    firstname: '',
    lastname: '',
    password: '',
    dob: '',
    role: 'VIEWER'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setForm({
        email: user.email || '',
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        // password intentionally left blank for edits (only set when changing)
        password: '',
        dob: user.dob ? user.dob.slice(0, 10) : '',
        role: (user.role as UserRole) || 'VIEWER'
      });
    } else {
      setForm({
        email: '',
        firstname: '',
        lastname: '',
        password: '',
        dob: '',
        role: 'VIEWER'
      });
    }
    setErrors({});
  }, [user?.id]);

  const handleChange = (field: keyof UserRequest, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field as string]) setErrors(prev => ({ ...prev, [field as string]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.firstname?.trim()) newErrors.firstname = 'First name is required';
    if (!form.lastname?.trim()) newErrors.lastname = 'Last name is required';
    if (!form.email?.trim()) newErrors.email = 'Email is required';
    else {
      const re = /\S+@\S+\.\S+/;
      if (!re.test(form.email)) newErrors.email = 'Enter a valid email';
    }
    // password required only when creating a new user, optional for edits
    if (!user && (!form.password || form.password.length < 6)) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validate()) return;

    const payload: UserRequest | UpdateUserRequest = user
      ? ({
          id: user.id!,
          // only include fields that the update endpoint expects (password optional)
          email: form.email || undefined,
          firstname: form.firstname || undefined,
          lastname: form.lastname || undefined,
          password: form.password && form.password.length > 0 ? form.password : undefined,
          dob: form.dob ? form.dob : undefined,
          role: form.role as UserRole
        } as UpdateUserRequest)
      : ({
          email: form.email,
          firstname: form.firstname,
          lastname: form.lastname,
          password: form.password,
          dob: form.dob || undefined,
          role: form.role as UserRole
        } as UserRequest);

    try {
      await onSubmit(payload);
    } catch (err) {
      // parent handles the error; optionally show a generic message
      console.error('Failed to save user', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="First Name"
          value={form.firstname}
          onChange={(v) => handleChange('firstname', v)}
          placeholder="Enter first name"
          required
        />
        <Input
          label="Last Name"
          value={form.lastname}
          onChange={(v) => handleChange('lastname', v)}
          placeholder="Enter last name"
          required
        />

        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(v) => handleChange('email', v)}
          placeholder="user@example.org"
          required
        />

        <Select
          label="Role"
          value={form.role}
          onChange={(v) => handleChange('role' as keyof UserRequest, v)}
          options={[
            { value: 'ADMIN', label: 'Admin' },
            { value: 'EDITOR', label: 'Editor' },
            { value: 'USER', label: 'User' },
            { value: 'VIEWER', label: 'Viewer' }
          ]}
        />

        <Input
          label={user ? 'Password (leave blank to keep current)' : 'Password'}
          type="password"
          value={form.password}
          onChange={(v) => handleChange('password', v)}
          placeholder={user ? '•••••• (optional)' : 'Enter password'}
        />

        <Input
          label="Date of Birth"
          type="date"
          value={form.dob || ''}
          onChange={(v) => handleChange('dob', v)}
        />
      </div>

      {/* inline error display */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-100 p-3 rounded text-sm text-red-700">
          {Object.values(errors).map((msg, idx) => (
            <div key={idx}>{msg}</div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onCancel} icon={X}>
          Cancel
        </Button>
        <Button type="submit" loading={isLoading} icon={Save}>
          {user ? 'Update User' : 'Create User'}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
