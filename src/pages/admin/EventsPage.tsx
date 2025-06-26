import React, { useState, useEffect } from 'react';
import { Event } from '../../types/Event';
import { EventList } from '../../components/events/EventList';
import { EventForm } from '../../components/events/EventForm';
import { DateFilterBar } from '../../components/filters/DateFilterBar';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Plus, Filter } from 'lucide-react';
import { eventService } from '../../services/eventService';
import { LayoutType, FilterOptions } from '../../types/Common';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>();
  const [layoutType, setLayoutType] = useState<LayoutType>('grid');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [events, filters]);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const data = await eventService.getAll();
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...events];

    if (filters.year) {
      filtered = filtered.filter(event => 
        new Date(event.startDate).getFullYear() === filters.year
      );
    }

    if (filters.month) {
      filtered = filtered.filter(event => 
        new Date(event.startDate).getMonth() + 1 === filters.month
      );
    }

    if (filters.day) {
      filtered = filtered.filter(event => 
        new Date(event.startDate).getDate() === filters.day
      );
    }

    if (filters.category) {
      filtered = filtered.filter(event => event.category === filters.category);
    }

    if (filters.featured !== undefined) {
      filtered = filtered.filter(event => event.featured === filters.featured);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm) ||
        event.description.toLowerCase().includes(searchTerm) ||
        event.location?.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredEvents(filtered);
  };

  const handleCreate = () => {
    setSelectedEvent(undefined);
    setIsFormModalOpen(true);
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setIsFormModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventService.delete(id);
        await fetchEvents();
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      if (selectedEvent) {
        await eventService.update(data);
      } else {
        await eventService.create(data);
      }
      setIsFormModalOpen(false);
      await fetchEvents();
    } catch (error) {
      console.error('Failed to save event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFilterDate = (year?: number, month?: number, day?: number) => {
    setFilters(prev => ({ ...prev, year, month, day }));
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.keys(filters).some(key => filters[key as keyof FilterOptions] !== undefined);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600 mt-1">Manage your event schedules</p>
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
            New Event
          </Button>
        </div>
      </div>

      {/* Filters */}
      {isFiltersOpen && (
        <DateFilterBar
          year={filters.year}
          month={filters.month}
          day={filters.day}
          onYearChange={(year) => handleFilterDate(year, filters.month, filters.day)}
          onMonthChange={(month) => handleFilterDate(filters.year, month, filters.day)}
          onDayChange={(day) => handleFilterDate(filters.year, filters.month, day)}
          onClear={handleClearFilters}
        />
      )}

      {/* Events List */}
      <EventList
        events={filteredEvents}
        isLoading={isLoading}
        isAdmin={true}
        onEdit={handleEdit}
        onDelete={handleDelete}
        layoutType={layoutType}
        onLayoutChange={setLayoutType}
      />

      {/* Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedEvent ? 'Edit Event' : 'Create Event'}
        size="xl"
      >
        <EventForm
          event={selectedEvent}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
};