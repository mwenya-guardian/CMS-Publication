import React from 'react';
import { Calendar, MapPin, Clock, Edit, Trash2, Eye, Download, Send, FileText } from 'lucide-react';
import { ChurchBulletin } from '../../types/ChurchBulletin';
import { dateUtils } from '../../utils/dateUtils';
import { Button } from '../common/Button';

interface BulletinCardProps {
  bulletin: ChurchBulletin;
  onView?: (close: false) => void;
  onExport?: (id: string, format: 'pdf'|'word') => Promise<void>;
}

export const BulletinViewCard: React.FC<BulletinCardProps> = ({
  bulletin,
  onView,
  onExport
}) => {

    const handleExport = (format: 'pdf'|'word') => {
        onExport?.(bulletin?.id  || '', format);
      }
      const handleClose = () => {
        onView?.(false);
      };
    return (
        <div className="space-y-6">
        {/* Header / Metadata */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">{bulletin.title}</h2>
            <div className="text-sm text-gray-600">
              Bulletin Date: {new Date(bulletin.bulletinDate).toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-600">
              Status: <span className={`inline-block px-2 py-0.5 rounded text-xs bg-green-100 text-green-800`}>{bulletin.status}</span>
            </div>
            {bulletin.scheduledPublishAt && (
              <div className="text-sm text-gray-600">Scheduled Publish: {dateUtils.formatDateTime(bulletin.scheduledPublishAt)}</div>
            )}
            <div className="text-xs text-gray-500 mt-2">
              ID: {bulletin.id}
            </div>
          </div>

          <div className="text-right text-sm text-gray-600">
            <div>Created: {dateUtils.formatDateTime(bulletin.createdAt || new Date())}</div>
            <div>Updated: {dateUtils.formatDateTime(bulletin.updatedAt || new Date())}</div>
            {/* createdBy / updatedBy may or may not exist on the object */}
            {(bulletin as any).createdBy && <div>By: {(bulletin as any).createdBy}</div>}
            {(bulletin as any).updatedBy && <div>Updated by: {(bulletin as any).updatedBy}</div>}
          </div>
        </div>

        {/* Cover */}
        {bulletin.cover && (
          <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">{bulletin.cover.documentName || 'Cover'}</h3>
            {bulletin.cover.welcomeMessage && (
              <p className="text-blue-100 mb-2">{bulletin.cover.welcomeMessage}</p>
            )}
            {bulletin.cover.footerMessage && (
              <p className="text-sm text-blue-200 mt-2">{bulletin.cover.footerMessage}</p>
            )}
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-3">Full Content</h3>
          {bulletin.content ? (
            // show content as rendered HTML if it appears to contain HTML, otherwise as plain
            <div className="prose max-w-none">
              {/* Danger: rendering HTML — if content originates from users, sanitize on the server */}
              <div dangerouslySetInnerHTML={{ __html: bulletin.content }} />
            </div>
          ) : (
            <p className="text-gray-600">No content provided.</p>
          )}
        </div>

        {/* Schedules (detailed) */}
        {bulletin.schedules && bulletin.schedules.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Order of Worship
            </h3>

            <div className="space-y-4">
              {bulletin.schedules.map((schedule, index) => {
                const activityEntries = ((schedule as any).scheduledActivities ?? (schedule as any).activityDetails ?? {});
                const roleAssignments = ((schedule as any).roleAssignment ?? (schedule as any).roles ?? []);
                const activityDetails = ((schedule as any).activityDetails ?? (schedule as any).scheduledActivities ?? {});

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
        {bulletin.announcements && bulletin.announcements.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Announcements</h3>
            <div className="space-y-4">
              {bulletin.announcements.map((announcement, index) => (
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
        {bulletin.onDutyList && bulletin.onDutyList.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">On Duty Today</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bulletin.onDutyList.map((duty, index) => (
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
            <div>Created: {dateUtils.formatDateTime(bulletin.createdAt || new Date())}</div>
            <div>Updated: {dateUtils.formatDateTime(bulletin.updatedAt || new Date())}</div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => handleExport('pdf')}
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleExport('word')}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Word
            </Button>
            <Button variant="primary" onClick={() => handleClose()}>Close</Button>
          </div>
        </div>
      </div>
    )
};