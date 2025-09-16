import React, { useEffect, useMemo, useState } from 'react';
import { newsletterScheduleService } from '../../services/newsletterScheduleService';
import { NewsletterSchedule, NewsletterScheduleCreate } from '../../types/NewsletterSchedule';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import { Plus, Play, Pause, Pencil, Trash2, Clock } from 'lucide-react';

export const NewsletterSchedulesPage: React.FC = () => {
  const [schedules, setSchedules] = useState<NewsletterSchedule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<NewsletterSchedule | null>(null);
  const [form, setForm] = useState<NewsletterScheduleCreate>({
    title: '',
    description: '',
    cronExpression: '',
    zoneId: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    bulletinIds: [],
    sendToAll: true,
    subscriberIds: [],
    enabled: true,
  });

  // Builder state
  const [useAdvancedCron, setUseAdvancedCron] = useState<boolean>(false);
  const [scheduleType, setScheduleType] = useState<'once' | 'daily' | 'weekly' | 'monthly'>('weekly');
  const [dateOnce, setDateOnce] = useState<string>(''); // yyyy-mm-dd
  const [timeStr, setTimeStr] = useState<string>('09:00'); // HH:mm
  const [weeklyDays, setWeeklyDays] = useState<string[]>(['SUN']);
  const [monthlyDay, setMonthlyDay] = useState<number>(1);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await newsletterScheduleService.getAll();
      setSchedules(data);
    } catch (e) {
      console.error(e);
      setError('Failed to load schedules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const resetBuilder = () => {
    setUseAdvancedCron(false);
    setScheduleType('weekly');
    setDateOnce('');
    setTimeStr('09:00');
    setWeeklyDays(['SUN']);
    setMonthlyDay(1);
  };

  const resetForm = () => {
    setEditing(null);
    setForm({
      title: '',
      description: '',
      cronExpression: '',
      zoneId: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      bulletinIds: [],
      sendToAll: true,
      subscriberIds: [],
      enabled: true,
    });
    resetBuilder();
  };

  const openCreate = () => { resetForm(); setIsModalOpen(true); };
  const openEdit = (s: NewsletterSchedule) => {
    setEditing(s);
    setForm({
      title: s.title,
      description: s.description || '',
      cronExpression: s.cronExpression,
      zoneId: s.zoneId,
      bulletinIds: s.bulletinIds || [],
      sendToAll: s.sendToAll,
      subscriberIds: s.subscriberIds || [],
      enabled: s.enabled,
    });
    // Try to keep advanced for existing cron, user can switch to builder manually
    setUseAdvancedCron(true);
    setIsModalOpen(true);
  };

  const parseTime = (hhmm: string) => {
    const [h, m] = hhmm.split(':').map((v) => parseInt(v || '0', 10));
    return { hour: isNaN(h) ? 0 : h, minute: isNaN(m) ? 0 : m };
  };

  // Build Quartz cron expression (sec min hour day-of-month month day-of-week year?)
  const buildCron = () => {
    const { hour, minute } = parseTime(timeStr || '00:00');
    const sec = 0;
    if (scheduleType === 'daily') {
      return `${sec} ${minute} ${hour} * * ?`;
    }
    if (scheduleType === 'weekly') {
      const days = weeklyDays.length > 0 ? weeklyDays.join(',') : 'SUN';
      return `${sec} ${minute} ${hour} ? * ${days}`;
    }
    if (scheduleType === 'monthly') {
      const dom = Math.min(Math.max(monthlyDay || 1, 1), 31);
      return `${sec} ${minute} ${hour} ${dom} * ?`;
    }
    // once
    if (dateOnce) {
      const d = new Date(dateOnce + 'T00:00:00');
      const year = d.getFullYear();
      const month = d.getMonth() + 1; // 1-12
      const day = d.getDate();
      return `${sec} ${minute} ${hour} ${day} ${month} ? ${year}`;
    }
    // fallback: weekly Sunday 9AM
    return `0 0 9 ? * SUN`;
  };

  const cronPreview = useMemo(() => (useAdvancedCron ? form.cronExpression : buildCron()), [useAdvancedCron, form.cronExpression, scheduleType, dateOnce, timeStr, weeklyDays, monthlyDay]);

  const save = async () => {
    try {
      const payload = { ...form } as NewsletterScheduleCreate;
      if (!useAdvancedCron) {
        payload.cronExpression = buildCron();
      }
      if (!payload.cronExpression) {
        setError('Cron expression is required');
        return;
      }
      if (editing) {
        await newsletterScheduleService.update(editing.id, payload);
      } else {
        await newsletterScheduleService.create(payload);
      }
      setIsModalOpen(false);
      await load();
    } catch (e) {
      console.error(e);
      setError('Failed to save schedule');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this schedule?')) return;
    try {
      await newsletterScheduleService.delete(id);
      await load();
    } catch (e) {
      console.error(e);
      setError('Failed to delete schedule');
    }
  };

  const runNow = async (id: string) => {
    try {
      await newsletterScheduleService.runNow(id);
    } catch (e) {
      console.error(e);
      setError('Failed to trigger schedule');
    }
  };

  const timeFormatter = useMemo(() => new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }), []);

  const toggleWeeklyDay = (day: string) => {
    setWeeklyDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  };

  const WEEK_DAYS = [
    { key: 'SUN', label: 'Sun' },
    { key: 'MON', label: 'Mon' },
    { key: 'TUE', label: 'Tue' },
    { key: 'WED', label: 'Wed' },
    { key: 'THU', label: 'Thu' },
    { key: 'FRI', label: 'Fri' },
    { key: 'SAT', label: 'Sat' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Newsletter Schedules</h1>
          <p className="text-gray-600 mt-2">Create, edit, enable/disable and run newsletter schedules</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={openCreate}>New Schedule</Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error}</div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cron</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enabled</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Run</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {schedules.map((s) => (
              <tr key={s.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{s.title}</div>
                  <div className="text-sm text-gray-500">{s.description?.slice(0, 15)}...</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.cronExpression}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.zoneId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${s.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {s.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {s.lastRunAt ? timeFormatter.format(new Date(s.lastRunAt)) : '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <Button variant="outline" size="sm" icon={Play} onClick={() => runNow(s.id)}>Run</Button>
                  <Button variant="outline" size="sm" icon={Pencil} onClick={() => openEdit(s)}>Edit</Button>
                  <Button variant="outline" size="sm" icon={Trash2} className="text-red-600" onClick={() => remove(s.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? 'Edit Schedule' : 'New Schedule'}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input className="mt-1 w-full px-3 py-2 border rounded-md" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea className="mt-1 w-full px-3 py-2 border rounded-md" 
                  maxLength={100} placeholder="Enter your text here (max 100 characters)"
                  value={form.description} 
                  onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>

            {/* Builder vs Advanced toggle */}
            <div className="flex items-center justify-between bg-gray-50 border rounded-md p-3">
              <div className="text-sm text-gray-700">Scheduling Mode</div>
              <div className="flex items-center space-x-3">
                <label className="inline-flex items-center text-sm">
                  <input type="radio" name="mode" className="mr-2" checked={!useAdvancedCron} onChange={() => setUseAdvancedCron(false)} />
                  Builder
                </label>
                <label className="inline-flex items-center text-sm">
                  <input type="radio" name="mode" className="mr-2" checked={useAdvancedCron} onChange={() => setUseAdvancedCron(true)} />
                  Advanced
                </label>
              </div>
            </div>

            {!useAdvancedCron ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Frequency</label>
                    <select className="mt-1 w-full px-3 py-2 border rounded-md" value={scheduleType} onChange={(e) => setScheduleType(e.target.value as any)}>
                      <option value="once">Once</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Time</label>
                    <input type="time" className="mt-1 w-full px-3 py-2 border rounded-md" value={timeStr} onChange={(e) => setTimeStr(e.target.value)} />
                  </div>
                </div>

                {scheduleType === 'once' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input type="date" className="mt-1 w-full px-3 py-2 border rounded-md" value={dateOnce} onChange={(e) => setDateOnce(e.target.value)} />
                    <p className="text-xs text-gray-500 mt-1">Runs one time at the selected date and time.</p>
                  </div>
                )}

                {scheduleType === 'weekly' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Days of Week</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {WEEK_DAYS.map(d => (
                        <button key={d.key} type="button" className={`px-3 py-1 rounded-md border text-sm ${weeklyDays.includes(d.key) ? 'bg-primary-100 border-primary-300 text-primary-700' : 'bg-white border-gray-300 text-gray-700'}`} onClick={() => toggleWeeklyDay(d.key)}>
                          {d.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Select one or more days.</p>
                  </div>
                )}

                {scheduleType === 'monthly' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Day of Month</label>
                    <input type="number" min={1} max={31} className="mt-1 w-full px-3 py-2 border rounded-md" value={monthlyDay} onChange={(e) => setMonthlyDay(parseInt(e.target.value || '1', 10))} />
                  </div>
                )}

                <div className="bg-gray-50 border rounded-md p-3 text-sm">
                  <div className="text-gray-700">Cron Preview</div>
                  <div className="mt-1 font-mono text-gray-900">{cronPreview}</div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cron Expression</label>
                  <input maxLength={100} placeholder="0 0 9 ? * SUN" className="mt-1 w-full px-3 py-2 border rounded-md" value={form.cronExpression} onChange={(e) => setForm({ ...form, cronExpression: e.target.value })} />
                  <p className="mt-1 text-xs text-gray-500">Quartz cron format. Example: 0 0 9 ? * SUN (Sundays 9AM)</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Time Zone</label>
                  <input className="mt-1 w-full px-3 py-2 border rounded-md" value={form.zoneId} onChange={(e) => setForm({ ...form, zoneId: e.target.value })} />
                </div>
              </div>
            )}

            {/* Common fields continued */}
            {useAdvancedCron === false && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Time Zone</label>
                <input className="mt-1 w-full px-3 py-2 border rounded-md" value={form.zoneId} onChange={(e) => setForm({ ...form, zoneId: e.target.value })} />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Bulletin IDs (comma-separated)</label>
                <input className="mt-1 w-full px-3 py-2 border rounded-md" value={form.bulletinIds.join(',')} onChange={(e) => setForm({ ...form, bulletinIds: e.target.value.split(',').map(v => v.trim()).filter(Boolean) })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Send To All Subscribers</label>
                <input type="checkbox" className="ml-2" checked={form.sendToAll} onChange={(e) => setForm({ ...form, sendToAll: e.target.checked })} />
              </div>
            </div>
            {!form.sendToAll && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Subscriber IDs (comma-separated)</label>
                <input className="mt-1 w-full px-3 py-2 border rounded-md" value={form.subscriberIds?.join(',') || ''} onChange={(e) => setForm({ ...form, subscriberIds: e.target.value.split(',').map(v => v.trim()).filter(Boolean) })} />
              </div>
            )}
            <div>
              <label className="inline-flex items-center text-sm font-medium text-gray-700">
                <input type="checkbox" className="mr-2" checked={form.enabled} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} />
                Enabled
              </label>
            </div>
            <div className="pt-2 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={save}>{editing ? 'Update' : 'Create'}</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default NewsletterSchedulesPage;
