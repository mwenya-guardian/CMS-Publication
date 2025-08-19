import React, { useState, useEffect } from 'react';
import { ChurchBulletin, PublicationStatus } from '../../types/ChurchBulletin';
import { BulletinList } from '../../components/bulletin/BulletinList';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { bulletinService } from '../../services/bulletinService';
import { LayoutType, FilterOptions } from '../../types/Common';
import { dateUtils } from '../../utils/dateUtils';
import { Calendar, Clock, Users, Book, FileText, Eye, Download, Plus } from 'lucide-react';

export const BulletinsView: React.FC = () => {
  const [bulletins, setBulletins] = useState<ChurchBulletin[]>([]);
  const [selectedBulletin, setSelectedBulletin] = useState<ChurchBulletin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [layout, setLayout] = useState<LayoutType>('grid');

  useEffect(() => {
    fetchBulletins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBulletins = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bulletinService.getAll(filters);
      setBulletins(data || []);
    } catch (err) {
      setError('Failed to fetch bulletins');
      console.error('Error fetching bulletins:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBulletinClick = (bulletin: ChurchBulletin) => {
    setSelectedBulletin(bulletin);
    setShowModal(true);
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleExport = async (bulletinId: string, format: 'pdf' | 'word') => {
    try {
      let blob: Blob;
      if (format === 'pdf') {
        blob = await bulletinService.exportToPdf(bulletinId);
      } else {
        blob = await bulletinService.exportToWord(bulletinId);
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bulletin-${bulletinId}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(`Error exporting ${format}:`, err);
    }
  };

  const getStatusColor = (status: PublicationStatus) => {
    switch (status) {
      case PublicationStatus.PUBLISHED:
        return 'bg-green-100 text-green-800';
      case PublicationStatus.DRAFT:
        return 'bg-yellow-100 text-yellow-800';
      case PublicationStatus.SCHEDULED:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper - safe date formatting (fallback to toLocaleString)
  const formatDateTime = (iso?: string | null) => {
    if (!iso) return '-';
    try {
      // prefer dateUtils if it has a format helper, otherwise fallback
      // (dateUtils usage is optional — guard in case it's not present)
      // Example: dateUtils.format(iso) — but fallback below
      if (dateUtils && typeof (dateUtils as any).format === 'function') {
        return (dateUtils as any).format(iso);
      }
      const d = new Date(iso);
      return d.toLocaleString();
    } catch {
      return iso;
    }
  };

  // Helper - normalize scheduledActivities to array of [key,value]
  const entriesFromScheduledActivities = (scheduledActivities: any): [string, string][] => {
    if (!scheduledActivities) return [];

    // Map instance
    if (scheduledActivities instanceof Map) {
      return Array.from((scheduledActivities as Map<string, string>).entries());
    }

    // Array of pairs e.g. [['09:00','Opening'], ...] or [{key, value}, ...]
    if (Array.isArray(scheduledActivities)) {
      const out: [string, string][] = [];
      for (const el of scheduledActivities) {
        if (Array.isArray(el) && el.length >= 2) {
          out.push([String(el[0]), String(el[1] ?? '')]);
        } else if (el && typeof el === 'object' && ('key' in el || 'time' in el)) {
          const key = el.key ?? el.time ?? Object.keys(el)[0];
          const value = el.value ?? el.activity ?? el[Object.keys(el)[0]];
          out.push([String(key), String(value ?? '')]);
        }
      }
      return out;
    }

    // Plain object { "09:00": "Opening", ... }
    if (typeof scheduledActivities === 'object') {
      return Object.entries(scheduledActivities).map(([k, v]) => [k, String(v ?? '')]);
    }

    return [];
  };

  // Helper - normalize roleAssignment (if present) to array of {role, participates[]}
  const normalizeRoleAssignments = (roleAssignment: any) => {
    if (!roleAssignment) return [];
    if (Array.isArray(roleAssignment)) return roleAssignment;
    if (typeof roleAssignment === 'object') {
      // object with numeric keys?
      return Object.values(roleAssignment);
    }
    return [];
  };

  // Helper - normalize activityDetails: object of key -> string[] or string
  const normalizeActivityDetails = (activityDetails: any): [string, string[]][] => {
    if (!activityDetails) return [];
    if (Array.isArray(activityDetails)) {
      // array-of-entries
      return activityDetails.map((el: any) => {
        if (Array.isArray(el) && el.length >= 2) {
          const [k, v] = el;
          return [String(k), Array.isArray(v) ? v.map(String) : [String(v)]];
        }
        if (el && typeof el === 'object' && ('key' in el || 'values' in el)) {
          const key = el.key ?? Object.keys(el)[0];
          const vals = el.values ?? el.values ?? el.value ?? [];
          return [String(key), Array.isArray(vals) ? vals.map(String) : [String(vals)]];
        }
        return [String(el), []];
      });
    }

    if (typeof activityDetails === 'object') {
      return Object.entries(activityDetails).map(([k, v]) => {
        if (Array.isArray(v)) return [k, v.map(String)];
        return [k, [String(v)]];
      });
    }

    return [];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-1 p-3">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Church Bulletins</h1>
          <p className="text-sm text-gray-600">View and manage church bulletins</p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => setLayout(layout === 'grid' ? 'list' : 'grid')}
            variant="outline"
            size="sm"
          >
            {layout === 'grid' ? 'List View' : 'Grid View'}
          </Button>
          <Button variant="outline" size="sm" onClick={fetchBulletins}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Empty state */}
      {bulletins.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bulletins Published Yet</h3>
          <p className="text-gray-600">Please check back later.</p>
        </div>
      ) : (
        <div className={layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {bulletins.map((bulletin) => (
            <div
              key={bulletin.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${
                layout === 'list' ? 'flex' : ''
              }`}
              onClick={() => handleBulletinClick(bulletin)}
            >
              <div className={`bg-gradient-to-br from-blue-900 to-blue-700 text-white p-6 ${layout === 'list' ? 'w-1/3' : ''}`}>
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">{bulletin.title || 'Church Bulletin'}</h3>
                  <p className="text-blue-100 mb-2">
                    {new Date(bulletin.bulletinDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bulletin.status)}`}>
                    {bulletin.status}
                  </span>
                </div>
              </div>

              <div className={`p-6 ${layout === 'list' ? 'w-2/3' : ''}`}>
                {/* Cover preview */}
                {bulletin.cover && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-1">{bulletin.cover.documentName || 'Cover'}</h4>
                    <p className="text-sm text-gray-600 line-clamp-3">{bulletin.cover.welcomeMessage}</p>
                    {bulletin.cover.footerMessage && <p className="text-xs text-gray-500 mt-1">{bulletin.cover.footerMessage}</p>}
                  </div>
                )}

                {/* Schedules preview */}
                {bulletin.schedules && bulletin.schedules.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-800 mb-2 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                      Services ({bulletin.schedules.length})
                    </h5>
                    <div className="space-y-1">
                      {bulletin.schedules.slice(0, 2).map((schedule, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          <span className="font-medium">{schedule.title}</span>
                          <span className="ml-2">
                            {schedule.startTime} - {schedule.endTime}
                          </span>
                        </div>
                      ))}
                      {bulletin.schedules.length > 2 && (
                        <p className="text-xs text-gray-500">+{bulletin.schedules.length - 2} more services</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Announcements preview */}
                {bulletin.announcements && bulletin.announcements.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-800 mb-2">Announcements ({bulletin.announcements.length})</h5>
                    <div className="space-y-1">
                      {bulletin.announcements.slice(0, 2).map((announcement, index) => (
                        <div key={index} className="text-sm text-gray-600 truncate">
                          {announcement.title}
                        </div>
                      ))}
                      {bulletin.announcements.length > 2 && (
                        <p className="text-xs text-gray-500">+{bulletin.announcements.length - 2} more announcements</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBulletinClick(bulletin);
                    }}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExport(bulletin.id, 'pdf');
                    }}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    PDF
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bulletin Detail Modal (full details) */}
      {selectedBulletin && (
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedBulletin(null);
          }}
          title={selectedBulletin.title || 'Church Bulletin'}
          size="xl"
        >
          <div className="space-y-6">
            {/* Header / Metadata */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-1">{selectedBulletin.title}</h2>
                <div className="text-sm text-gray-600">
                  Bulletin Date: {new Date(selectedBulletin.bulletinDate).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-600">
                  Status: <span className={`inline-block px-2 py-0.5 rounded text-xs ${getStatusColor(selectedBulletin.status)}`}>{selectedBulletin.status}</span>
                </div>
                {selectedBulletin.scheduledPublishAt && (
                  <div className="text-sm text-gray-600">Scheduled Publish: {formatDateTime(selectedBulletin.scheduledPublishAt)}</div>
                )}
                <div className="text-xs text-gray-500 mt-2">
                  ID: {selectedBulletin.id}
                </div>
              </div>

              <div className="text-right text-sm text-gray-600">
                <div>Created: {formatDateTime(selectedBulletin.createdAt)}</div>
                <div>Updated: {formatDateTime(selectedBulletin.updatedAt)}</div>
                {/* createdBy / updatedBy may or may not exist on the object */}
                {(selectedBulletin as any).createdBy && <div>By: {(selectedBulletin as any).createdBy}</div>}
                {(selectedBulletin as any).updatedBy && <div>Updated by: {(selectedBulletin as any).updatedBy}</div>}
              </div>
            </div>

            {/* Cover */}
            {selectedBulletin.cover && (
              <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">{selectedBulletin.cover.documentName || 'Cover'}</h3>
                {selectedBulletin.cover.welcomeMessage && (
                  <p className="text-blue-100 mb-2">{selectedBulletin.cover.welcomeMessage}</p>
                )}
                {selectedBulletin.cover.footerMessage && (
                  <p className="text-sm text-blue-200 mt-2">{selectedBulletin.cover.footerMessage}</p>
                )}
              </div>
            )}

            {/* Content */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-3">Full Content</h3>
              {selectedBulletin.content ? (
                // show content as rendered HTML if it appears to contain HTML, otherwise as plain
                <div className="prose max-w-none">
                  {/* Danger: rendering HTML — if content originates from users, sanitize on the server */}
                  <div dangerouslySetInnerHTML={{ __html: selectedBulletin.content }} />
                </div>
              ) : (
                <p className="text-gray-600">No content provided.</p>
              )}
            </div>

            {/* Schedules (detailed) */}
            {selectedBulletin.schedules && selectedBulletin.schedules.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  Order of Worship
                </h3>

                <div className="space-y-4">
                  {selectedBulletin.schedules.map((schedule, index) => {
                    const activityEntries = entriesFromScheduledActivities((schedule as any).scheduledActivities ?? (schedule as any).activityDetails ?? {});
                    const roleAssignments = normalizeRoleAssignments((schedule as any).roleAssignment ?? (schedule as any).roles ?? []);
                    const activityDetails = normalizeActivityDetails((schedule as any).activityDetails ?? (schedule as any).scheduledActivities ?? {});

                    return (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800">{schedule.title}</h4>
                            <p className="text-sm text-gray-600">
                              {schedule.scheduledDate} • {schedule.startTime} - {schedule.endTime}
                            </p>
                          </div>
                          <div className="text-sm text-gray-600 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{schedule.startTime} - {schedule.endTime}</span>
                          </div>
                        </div>

                        {/* Role Assignments */}
                        {roleAssignments.length > 0 && (
                          <div className="mb-3">
                            <h5 className="font-medium text-gray-700 mb-2">Roles</h5>
                            <div className="space-y-2">
                              {roleAssignments.map((r: any, ri: number) => (
                                <div key={ri} className="flex items-start gap-3 text-sm">
                                  <Users className="w-4 h-4 mt-1 text-blue-600" />
                                  <div>
                                    <div className="font-medium">{r.role || r.label || 'Role'}</div>
                                    <div className="text-gray-600">{Array.isArray(r.participates) ? r.participates.join(', ') : String(r.participates ?? '')}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Activities (scheduledActivities or activityDetails) */}
                        {activityEntries.length > 0 && (
                          <div className="mb-3">
                            <h5 className="font-medium text-gray-700 mb-2">Activities</h5>
                            <div className="space-y-1 text-sm text-gray-700">
                              {activityEntries.map(([k, v]) => (
                                <div key={k}><span className="font-medium">{k}:</span> <span className="ml-2">{v}</span></div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* activityDetails with array values */}
                        {activityDetails.length > 0 && (
                          <div className="mb-0">
                            <h5 className="font-medium text-gray-700 mb-2">Activity Details</h5>
                            <div className="space-y-1 text-sm text-gray-700">
                              {activityDetails.map(([k, vals], ai) => (
                                <div key={ai}><span className="font-medium">{k}:</span> <span className="ml-2">{vals.join(', ')}</span></div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Announcements */}
            {selectedBulletin.announcements && selectedBulletin.announcements.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Announcements</h3>
                <div className="space-y-4">
                  {selectedBulletin.announcements.map((announcement, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                      <h4 className="text-lg font-semibold text-gray-800 mb-1">{announcement.title}</h4>
                      <p className="text-gray-700">{announcement.content}</p>
                      {announcement.bulletin && <div className="text-xs text-gray-500 mt-1">Related Bulletin: {announcement.bulletin.title}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* On Duty */}
            {selectedBulletin.onDutyList && selectedBulletin.onDutyList.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">On Duty Today</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedBulletin.onDutyList.map((duty, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800">{duty.role}</h4>
                      {duty.activity && <p className="text-sm text-blue-600 mb-2">{duty.activity}</p>}
                      <p className="text-sm text-gray-700 mb-1">Participants: {Array.isArray(duty.participates) ? duty.participates.join(', ') : String(duty.participates ?? '')}</p>
                      <p className="text-sm text-gray-600">Date: {duty.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer: metadata + actions */}
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <div>Created: {formatDateTime(selectedBulletin.createdAt)}</div>
                <div>Updated: {formatDateTime(selectedBulletin.updatedAt)}</div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleExport(selectedBulletin.id, 'pdf')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExport(selectedBulletin.id, 'word')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Word
                </Button>
                <Button variant="primary" onClick={() => setShowModal(false)}>Close</Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
