import React from 'react';
import { Edit, Trash2, Mail, Phone, User } from 'lucide-react';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';

// NOTE: use the same (typo'd) type name you used earlier to avoid type mismatch.
// If your project exports a different name (e.g., Member), change the import accordingly.
import { Member } from '../../types/Members';
import { LayoutType } from '../../types/Common';

interface MemberListProps {
  members: Member[];
  isLoading?: boolean;
  isAdmin?: boolean;
  onView?: (member: Member) => void;
  onEdit?: (member: Member) => void;
  onDelete?: (id: string) => void;
  layoutType?: LayoutType;
  onLayoutChange?: (layout: LayoutType) => void;
}

export const MemberList: React.FC<MemberListProps> = ({
  members = [],
  isLoading = false,
  isAdmin = false,
  onView,
  onEdit,
  onDelete,
  layoutType = 'grid',
  onLayoutChange,
}) => {
  const renderEmpty = () => (
    <div className="text-center py-12 text-gray-600">
      <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
        <User className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No members found</h3>
      <p className="text-gray-600">Try adjusting your filters or add a new member.</p>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (!members || members.length === 0) {
    return renderEmpty();
  }

  // Small member card used in grid/list
  const MemberCard: React.FC<{ member: Member; layout: LayoutType }> = ({ member, layout }) => {
    const fullName = `${member.firstname ?? ''} ${member.lastname ?? ''}`.trim() || member.position;

    return (
      <div
        className={`bg-white rounded-lg shadow-sm overflow-hidden transition-shadow hover:shadow-md ${
          layout === 'list' ? 'flex items-center' : ''
        }`}
        role="article"
      >
        <div className={`p-4 flex items-center justify-center ${layout === 'list' ? 'w-1/4' : ''}`}>
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
              <h4 className="text-lg font-semibold text-gray-900">{fullName}</h4>
              <div className="text-sm text-gray-600">{member.position}</div>
              <div className="text-xs text-gray-500">{member.positionType}</div>
            </div>

            {/* Admin actions */}
            {isAdmin && (
              <div className="flex items-start gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit && onEdit(member);
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
                    if (onDelete) onDelete(member.id);
                  }}
                  icon={Trash2}
                  className="text-red-600"
                >
                  {/* Delete */}
                </Button>
              </div>
            )}
          </div>

          <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="text-sm text-gray-600 flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="truncate max-w-[200px]" title={member.email}>{member.email}</span>
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

  return (
    <div className="space-y-4">
      {/* layout controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">Showing {members.length} member{members.length !== 1 ? 's' : ''}</div>

        {onLayoutChange && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onLayoutChange('grid')}
              className={`px-2 py-1 rounded ${layoutType === 'grid' ? 'bg-gray-100' : ''}`}
              aria-label="Grid view"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="13" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="3" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="13" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/></svg>
            </button>
            <button
              onClick={() => onLayoutChange('list')}
              className={`px-2 py-1 rounded ${layoutType === 'list' ? 'bg-gray-100' : ''}`}
              aria-label="List view"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        )}
      </div>

      {/* list/grid */}
      {layoutType === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map(member => (
            <div key={member.id} onClick={() => onView && onView(member)}>
              <MemberCard member={member} layout="grid" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {members.map(member => (
            <div key={member.id} onClick={() => onView && onView(member)}>
              <MemberCard member={member} layout="list" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemberList;
