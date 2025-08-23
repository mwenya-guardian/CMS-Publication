import React, { useEffect, useMemo, useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { membersService } from '../../services/memberService';
import { LayoutType, FilterOptions } from '../../types/Common';
import { Search, User, Users, Mail, Phone, Grid, List, X } from 'lucide-react';

// NOTE: you gave the model earlier as "Memebers" (typo). If your types file exports a different name,
// update the import below to match. Example: import { Member } from '../../types/Member';
import { Member } from '../../types/Members';

export const MembersView: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filtered, setFiltered] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [layout, setLayout] = useState<LayoutType>('grid');

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members, filters, searchTerm]);

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await membersService.getAll();
      setMembers(data ?? []);
    } catch (err) {
      console.error('Failed to fetch members', err);
      setError('Failed to load members');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    const q = searchTerm.trim().toLowerCase();
    let list = [...members];

    // Filter by positionType if provided
    if (filters.positionType) {
      list = list.filter(m => (m.positionType ?? '').toLowerCase() === String(filters.positionType).toLowerCase());
    }

    // Filter by position (role) if provided
    if (filters.position) {
      list = list.filter(m => (m.position ?? '').toLowerCase() === String(filters.position).toLowerCase());
    }

    if (q) {
      list = list.filter(m =>
        `${m.firstname} ${m.lastname}`.toLowerCase().includes(q) ||
        (m.position ?? '').toLowerCase().includes(q) ||
        (m.email ?? '').toLowerCase().includes(q) ||
        (m.phone ?? '').toLowerCase().includes(q)
      );
    }

    setFiltered(list);
    setIsFiltersOpen(true);
  };

  const handleView = (member: Member) => {
    setSelectedMember(member);
    setIsDetailOpen(true);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setIsFiltersOpen(false);
  };

  const hasActiveFilters = useMemo(() => {
    return searchTerm.length > 0 || Object.keys(filters).some(k => (filters as any)[k] !== undefined);
  }, [filters, searchTerm]);

  // Stats
  const totalMembers = members.length;
  const leadersCount = members.filter(m => (m.positionType ?? '').toLowerCase() === 'leader' || (m.position ?? '').toLowerCase().includes('pastor')).length;
  const withPhoto = members.filter(m => !!m.photoUrl).length;

  // Small member card used in both grid and list
  const MemberCard: React.FC<{ member: Member; onView: (m: Member) => void; layout: LayoutType }> = ({ member, onView, layout }) => {
    const fullName = `${member.firstname} ${member.lastname}`.trim();

    return (
      <div
        className={`bg-white rounded-lg shadow-sm overflow-hidden transition-shadow hover:shadow-md cursor-pointer ${layout === 'list' ? 'flex items-center' : ''}`}
        onClick={() => onView(member)}
      >
        <div className={`${layout === 'list' ? 'w-1/4' : ''} p-4 flex items-center justify-center`}>
          {member.photoUrl ? (
            <img src={member.photoUrl} alt={fullName} className="w-24 h-24 rounded-full object-cover" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
              <User className="w-10 h-10" />
            </div>
          )}
        </div>

        <div className={`${layout === 'list' ? 'w-3/4 p-4' : 'p-4'}`}>
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">{fullName || member.position}</h4>
              <div className="text-sm text-gray-600">{member.position}</div>
            </div>
            <div className="text-sm text-gray-500">{member.positionType}</div>
          </div>

          <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="text-sm text-gray-600 flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="truncate max-w-[200px]">{member.email}</span>
            </div>
            {member.phone && (
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{member.phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Detail modal
  const MemberDetailModal = () => {
    if (!selectedMember) return null;
    const fullName = `${selectedMember.firstname} ${selectedMember.lastname}`.trim();

    return (
      <Modal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedMember(null);
        }}
        title={fullName || selectedMember.position}
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            {selectedMember.photoUrl ? (
              <img src={selectedMember.photoUrl} alt={fullName} className="w-28 h-28 rounded-full object-cover" />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                <User className="w-10 h-10" />
              </div>
            )}

            <div>
              <h3 className="text-xl font-semibold text-gray-900">{fullName}</h3>
              <div className="text-sm text-gray-600">{selectedMember.position} • {selectedMember.positionType}</div>
              {selectedMember.email && <div className="text-sm text-gray-600 mt-2 flex items-center gap-2"><Mail className="w-4 h-4" />{selectedMember.email}</div>}
              {selectedMember.phone && <div className="text-sm text-gray-600 mt-1 flex items-center gap-2"><Phone className="w-4 h-4" />{selectedMember.phone}</div>}
            </div>
          </div>

          {/* Additional details */}
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="text-sm font-medium text-gray-800">Profile</h4>
            <p className="text-sm text-gray-700 mt-2">
              {/* If you have more profile fields (bio, responsibilities, etc.) show them here.
                  For now show position and contact info as a simple paragraph. */}
              <strong>Role:</strong> {selectedMember.position}<br />
              <strong>Position Type:</strong> {selectedMember.positionType}
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => { setIsDetailOpen(false); setSelectedMember(null); }}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/10 rounded-full">
              <Users className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Leadership & Team</h1>
          <p className="mt-3 text-lg text-primary-100 max-w-2xl mx-auto">
            Meet our pastoral team and church leaders. Contact them for ministry information and support.
          </p>

          <div className="mt-8 max-w-2xl mx-auto flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search members by name, role or email..."
                className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>

            <Button
              variant="ghost"
              onClick={() => setFilters(prev => ({ ...prev, positionType: prev.positionType ? undefined : 'leader' }))}
            >
              Leaders
            </Button>

            <Button
              variant="ghost"
              onClick={() => handleClearFilters()}
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-primary-600">{totalMembers}</div>
              <div className="text-sm text-gray-600">Total Members</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary-600">{leadersCount}</div>
              <div className="text-sm text-gray-600">Leaders / Pastors</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent-600">{withPhoto}</div>
              <div className="text-sm text-gray-600">With Photo</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-700">{filtered.length}</div>
              <div className="text-sm text-gray-600">{hasActiveFilters ? 'Filtered' : 'Showing All'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">Layout</div>
            <div className="flex gap-2">
              <button
                onClick={() => setLayout('grid')}
                className={`p-2 rounded ${layout === 'grid' ? 'bg-gray-100' : ''}`}
                aria-label="Grid view"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setLayout('list')}
                className={`p-2 rounded ${layout === 'list' ? 'bg-gray-100' : ''}`}
                aria-label="List view"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                Active filters
                <button onClick={handleClearFilters} className="ml-2">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            <Button variant="outline" onClick={fetchMembers}>Refresh</Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-12">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            No members found. Try clearing filters or refreshing.
          </div>
        ) : (
          <div className={layout === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filtered.map(m => (
              <MemberCard key={m.id} member={m} onView={handleView} layout={layout} />
            ))}
          </div>
        )}
      </div>

      <MemberDetailModal />
    </div>
  );
};
