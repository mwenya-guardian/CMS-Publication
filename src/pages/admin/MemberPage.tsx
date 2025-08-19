import React, { useEffect, useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Plus, Filter } from 'lucide-react';
import { membersService } from '../../services/memberService';
import { LayoutType, FilterOptions } from '../../types/Common';

// NOTE: your earlier type was named "Memebers" (typo). Import accordingly.
// If your project exports Member or Members instead, change this import to match.
import { Member } from '../../types/Members';

// These components should mirror your PublicationList/PublicationForm patterns.
// If they don't exist yet, I can generate MemberList and MemberForm for you.
import { MemberList } from '../../components/members/MemberList';
import { MemberForm } from '../../components/members/MemberForm';

export const MembersPage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | undefined>();
  const [layoutType, setLayoutType] = useState<LayoutType>('grid');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [members, filters]);

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const data = await membersService.getAll();
      setMembers(data ?? []);
    } catch (err) {
      console.error('Failed to fetch members:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...members];

    // Filter by positionType (e.g., leader, staff) if provided
    if (filters.positionType) {
      filtered = filtered.filter(m => (m.positionType ?? '').toLowerCase() === String(filters.positionType).toLowerCase());
    }

    // Filter by position (role) if provided
    if (filters.position) {
      filtered = filtered.filter(m => (m.position ?? '').toLowerCase() === String(filters.position).toLowerCase());
    }

    // Search (if provided via filters.search)
    if (filters.search) {
      const q = String(filters.search).toLowerCase().trim();
      filtered = filtered.filter(m =>
        `${m.firstname} ${m.lastname}`.toLowerCase().includes(q) ||
        (m.position ?? '').toLowerCase().includes(q) ||
        (m.email ?? '').toLowerCase().includes(q)
      );
    }

    setFilteredMembers(filtered);
  };

  const handleCreate = () => {
    setSelectedMember(undefined);
    setIsFormModalOpen(true);
  };

  const handleEdit = (member: Member) => {
    setSelectedMember(member);
    setIsFormModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;
    try {
      await membersService.delete(id);
      await fetchMembers();
    } catch (err) {
      console.error('Failed to delete member:', err);
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      if (selectedMember) {
        // update expects the full payload (including id)
        await membersService.update({ ...data, id: selectedMember.id });
      } else {
        await membersService.create(data);
      }
      setIsFormModalOpen(false);
      await fetchMembers();
    } catch (err) {
      console.error('Failed to save member:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFilterToggleLeaders = () => {
    setFilters(prev => ({
      ...prev,
      positionType: prev.positionType ? undefined : 'leader'
    }));
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.keys(filters).some(key => filters[key as keyof FilterOptions] !== undefined);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Members</h1>
          <p className="text-gray-600 mt-1">Manage pastoral team and church leadership</p>
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
            New Member
          </Button>
        </div>
      </div>

      {/* Filters area (simple toggles/search field via filters object) */}
      {isFiltersOpen && (
        <div className="mb-4 bg-white rounded-md p-4 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search members by name, role, or email..."
                value={String(filters.search ?? '')}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" onClick={handleFilterToggleLeaders}>
                Toggle Leaders
              </Button>
              <Button variant="ghost" onClick={handleClearFilters}>
                Clear
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MemberList (admin) */}
      <div>
        <MemberList
          members={filteredMembers}
          isLoading={isLoading}
          isAdmin={true}
          onEdit={handleEdit}
          onDelete={handleDelete}
          layoutType={layoutType}
          onLayoutChange={setLayoutType}
        />
      </div>

      {/* Empty state */}
      {!isLoading && filteredMembers.length === 0 && (
        <div className="text-center py-12">
          {/* <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No members found</h3>
          <p className="text-gray-600 mb-4">Try creating a new member or clearing filters.</p> */}
          <Button variant="outline" onClick={handleCreate}>Add Member</Button>
        </div>
      )}

      {/* Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedMember ? 'Edit Member' : 'Create Member'}
        size="xl"
      >
        <MemberForm
          member={selectedMember}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
};
