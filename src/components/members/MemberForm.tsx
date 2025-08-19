import React, { useEffect, useState } from 'react';
import { Member } from '../../types/Members';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { ImageUploader } from '../common/ImageUploader';
import { Save, X } from 'lucide-react';
import { membersService } from '../../services/memberService';

type CreateMemberRequest = Omit<Member, 'id'>;
type UpdateMemberRequest = Member;

interface MemberFormProps {
  member?: Member;
  onSubmit: (data: CreateMemberRequest | UpdateMemberRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const MemberForm: React.FC<MemberFormProps> = ({
  member,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CreateMemberRequest>({
    position: '',
    firstname: '',
    lastname: '',
    positionType: '',
    photoUrl: '',
    email: '',
    phone: '',
    // id intentionally not present (CreateMemberRequest)
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (member) {
      setFormData({
        position: member.position ?? '',
        firstname: member.firstname ?? '',
        lastname: member.lastname ?? '',
        positionType: member.positionType ?? '',
        photoUrl: member.photoUrl ?? '',
        email: member.email ?? '',
        phone: member.phone ?? '',
      });
    } else {
      setFormData({
        position: '',
        firstname: '',
        lastname: '',
        positionType: '',
        photoUrl: '',
        email: '',
        phone: '',
      });
    }
  }, [member?.id]);

  const handleInputChange = (field: keyof CreateMemberRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field as string]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstname?.trim() && !formData.lastname?.trim()) {
      newErrors.firstname = 'First name or last name required';
      newErrors.lastname = 'First name or last name required';
    }
    if (!formData.position?.trim()) {
      newErrors.position = 'Position is required';
    }
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const re = /\S+@\S+\.\S+/;
      if (!re.test(formData.email)) newErrors.email = 'Enter a valid email';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const submitData: CreateMemberRequest | UpdateMemberRequest = {
      position: formData.position,
      firstname: formData.firstname,
      lastname: formData.lastname,
      positionType: formData.positionType,
      photoUrl: formData.photoUrl || undefined,
      email: formData.email,
      phone: formData.phone || undefined,
    } as any;

    try {
      if (member) {
        // update expects id included
        await onSubmit({ ...(submitData as CreateMemberRequest), id: member.id } as UpdateMemberRequest);
      } else {
        await onSubmit(submitData as CreateMemberRequest);
      }
    } catch (err) {
      // allow parent to handle errors; optionally show a generic error
      console.error('Failed to submit member form', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="First Name"
          value={formData.firstname}
          onChange={(v) => handleInputChange('firstname', v)}
          placeholder="Enter first name"
        />

        <Input
          label="Last Name"
          value={formData.lastname}
          onChange={(v) => handleInputChange('lastname', v)}
          placeholder="Enter last name"
        />

        <Input
          label="Position (Role)"
          value={formData.position}
          onChange={(v) => handleInputChange('position', v)}
          placeholder="e.g., Senior Pastor"
        />

        <Input
          label="Position Type"
          value={formData.positionType || ''}
          onChange={(v) => handleInputChange('positionType', v)}
          placeholder="e.g., Pastor"
        />

        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(v) => handleInputChange('email', v)}
          placeholder="email@example.org"
        />

        <Input
          label="Phone"
          type="number"
          value={formData.phone}
          onChange={(v) => handleInputChange('phone', v)}
          placeholder="0960 502 235"
        />

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
          <ImageUploader
            value={formData.photoUrl || ''}
            onChange={(url) => handleInputChange('photoUrl', url)}
            onRemove={() => handleInputChange('photoUrl', '')}
            onUpload={membersService.uploadPhoto}
          />
        </div>
      </div>

      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onCancel} icon={X}>
          Cancel
        </Button>
        <Button type="submit" loading={isLoading} icon={Save}>
          {member ? 'Update Member' : 'Create Member'}
        </Button>
      </div>
    </form>
  );
};

export default MemberForm;
