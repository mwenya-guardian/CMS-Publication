import React, { useState, useEffect } from 'react';
import { Event } from '../../types/Event';
import { EventList } from '../../components/events/EventList';
import { DateFilterBar } from '../../components/filters/DateFilterBar';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Search, Filter, X, Calendar, MapPin, Clock } from 'lucide-react';
import { eventService } from '../../services/eventService';
import { LayoutType, FilterOptions } from '../../types/Common';
import { dateUtils } from '../../utils/dateUtils';

export const EventsView: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [layoutType, setLayoutType] = useState<LayoutType>('grid');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [events, filters, searchTerm]);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const data = await eventService.getAll();
      setEvents(data?data:[]);
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

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.location?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredEvents(filtered);
  };

  const handleEventView = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };

  const handleFilterDate = (year?: number, month?: number, day?: number) => {
    setFilters(prev => ({ ...prev, year, month, day }));
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const hasActiveFilters = Object.keys(filters).some(key => 
    filters[key as keyof FilterOptions] !== undefined
  ) || searchTerm.length > 0;

const HeroSection = () => (
  <div className="bg-gradient-to-br from-secondary-600 via-secondary-700 to-secondary-800 text-white">
    <div className="max-w-8xl mx-auto px-4 sm:px-2 lg:px-2 py-6">
      <div className="flex flex-col md:flex-row items-stretch gap-4">

                {isFiltersOpen && (
          <div className="w-full md:w-auto text-primary-800">
            <DateFilterBar
              year={filters.year}
              month={filters.month}
              day={filters.day}
              onYearChange={(year) => handleFilterDate(year, filters.month, filters.day)}
              onMonthChange={(month) => handleFilterDate(filters.year, month, filters.day)}
              onDayChange={(day) => handleFilterDate(filters.year, filters.month, day)}
              onClear={handleClearFilters}
              className="min-w-[220px]"
            />
          </div>
        )}

        <div className="flex flex-1 items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>
          <Button
            variant="accent"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            icon={Filter}
            className={hasActiveFilters ? 'bg-accent-400' : ''}
          >
            Filters
          </Button>
        </div>
      </div>
    </div>
  </div>
);

  const StatsBar = () => {
    const totalEvents = events?.length;
    const filteredCount = filteredEvents?.length;
    const upcomingCount = events?.filter(e => new Date(e.startDate) > new Date()).length;
    const featuredCount = events?.filter(e => e.featured).length;

    return (
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-600">{totalEvents}</div>
              <div className="text-sm text-gray-600">Total Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{upcomingCount}</div>
              <div className="text-sm text-gray-600">Upcoming</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-600">{featuredCount}</div>
              <div className="text-sm text-gray-600">Featured</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-700">{filteredCount}</div>
              <div className="text-sm text-gray-600">
                {hasActiveFilters ? 'Filtered Results' : 'Showing All'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EventDetailModal = () => {
    if (!selectedEvent) return null;

    const getCategoryColor = (category: string) => {
      const colors = {
        wedding: 'bg-pink-100 text-pink-800',
        conference: 'bg-blue-100 text-blue-800',
        workshop: 'bg-green-100 text-green-800',
        social: 'bg-purple-100 text-purple-800',
        other: 'bg-gray-100 text-gray-800',
      };
      return colors[category as keyof typeof colors] || colors.other;
    };

    return (
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={selectedEvent.title}
        size="xl"
      >
        <div className="space-y-6">
          {selectedEvent.imageUrl && (
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
              <img
                src={selectedEvent.imageUrl}
                alt={selectedEvent.title}
                className="w-full h-64 object-cover"
              />
            </div>
          )}
          
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-1" />
              {dateUtils.formatDate(selectedEvent.startDate)}
              {selectedEvent.endDate && selectedEvent.endDate !== selectedEvent.startDate && (
                <span className="ml-1">- {dateUtils.formatDate(selectedEvent.endDate)}</span>
              )}
            </div>
            {selectedEvent.location && (
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                {selectedEvent.location}
              </div>
            )}
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(selectedEvent.category)}`}>
              {selectedEvent.category}
            </span>
            {selectedEvent.featured && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-100 text-accent-800">
                Featured
              </span>
            )}
          </div>

          <div className="prose max-w-none">
            <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {selectedEvent.description}
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <StatsBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


        {hasActiveFilters && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Active filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
                Search: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-secondary-400 hover:bg-secondary-200 hover:text-secondary-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                Clear all
              </Button>
            )}
          </div>
        )}

        <EventList
          events={filteredEvents}
          isLoading={isLoading}
          isAdmin={false}
          onView={handleEventView}
          layoutType={layoutType}
          onLayoutChange={setLayoutType}
        />

        {!isLoading && filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {hasActiveFilters ? 'No events match your filters' : 'No events found'}
            </h3>
            <p className="text-gray-600 mb-4">
              {hasActiveFilters 
                ? 'Try adjusting your search criteria or clearing some filters.'
                : 'Check back later for upcoming events.'
              }
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={handleClearFilters}>
                Clear all filters
              </Button>
            )}
          </div>
        )}
      </div>

      <EventDetailModal />
    </div>
  );
};