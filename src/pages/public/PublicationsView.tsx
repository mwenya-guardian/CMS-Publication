import React, { useState, useEffect } from 'react';
import { Publication } from '../../types/Publication';
import { PublicationList } from '../../components/publications/PublicationList';
import { DateFilterBar } from '../../components/filters/DateFilterBar';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Search, Filter, X, FileText, Calendar, User, Rss } from 'lucide-react';
import { publicationService } from '../../services/publicationService';
import { LayoutType, FilterOptions } from '../../types/Common';
import { dateUtils } from '../../utils/dateUtils';

export const PublicationsView: React.FC = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [filteredPublications, setFilteredPublications] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [layoutType, setLayoutType] = useState<LayoutType>('grid');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPublications();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [publications, filters, searchTerm]);

  const fetchPublications = async () => {
    try {
      setIsLoading(true);
      const data = await publicationService.getAll();
      setPublications(data?data:[]);
    } catch (error) {
      console.error('Failed to fetch publications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...publications];

    // Apply date filters
    if (filters.year) {
      filtered = filtered.filter(pub => 
        new Date(pub.date).getFullYear() === filters.year
      );
    }

    if (filters.month) {
      filtered = filtered.filter(pub => 
        new Date(pub.date).getMonth() + 1 === filters.month
      );
    }

    if (filters.day) {
      filtered = filtered.filter(pub => 
        new Date(pub.date).getDate() === filters.day
      );
    }

    // Apply featured filter
    if (filters.featured !== undefined) {
      filtered = filtered.filter(pub => pub.featured === filters.featured);
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(pub => 
        pub.title.toLowerCase().includes(searchLower) ||
        pub.content.toLowerCase().includes(searchLower) ||
        pub.author?.toLowerCase().includes(searchLower) ||
        pub.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    setFilteredPublications(filtered);
  };

  const handlePublicationView = (publication: Publication) => {
    setSelectedPublication(publication);
    setIsDetailModalOpen(true);
  };

  const handleFilterDate = (year?: number, month?: number, day?: number) => {
    setFilters(prev => ({ ...prev, year, month, day }));
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const hasActiveFilters = Object.keys(filters).some(key => 
    filters[key as keyof FilterOptions] !== undefined
  ) || searchTerm.length > 0;

  const HeroSection = () => (
    <div className="bg-gradient-to-br from-primary-400 via-primary-700 to-primary-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
              <Rss className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Publications
          </h1>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Explore what the church is doing and what is happening in the church
            <br />
            See the church's goals and objectives
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search publications..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
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
    const totalPublications = publications?.length;
    const filteredCount = filteredPublications?.length;
    const featuredCount = publications?.filter(p => p.featured).length;
    const currentYear = dateUtils.getCurrentYear();
    const thisYearCount = publications?.filter(p => 
      new Date(p.date).getFullYear() === currentYear
    ).length;

    return (
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{totalPublications}</div>
              <div className="text-sm text-gray-600">Total Publications</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-600">{featuredCount}</div>
              <div className="text-sm text-gray-600">Featured</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-600">{thisYearCount}</div>
              <div className="text-sm text-gray-600">This Year</div>
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

  const PublicationDetailModal = () => {
    if (!selectedPublication) return null;

    return (
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={selectedPublication.title}
        size="xl"
      >
        <div className="space-y-6">
          {selectedPublication.imageUrl && (
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
              <img
                src={selectedPublication.imageUrl}
                alt={selectedPublication.title}
                className="w-full h-64 object-cover"
              />
            </div>
          )}
          
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {dateUtils.formatDate(selectedPublication.date)}
            </div>
            {selectedPublication.author && (
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {selectedPublication.author}
              </div>
            )}
            {selectedPublication.featured && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-100 text-accent-800">
                Featured
              </span>
            )}
          </div>

          <div className="prose max-w-none">
            <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {selectedPublication.content}
            </div>
          </div>

          {selectedPublication.tags && selectedPublication.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {selectedPublication.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <StatsBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        {isFiltersOpen && (
          <div className="mb-8">
            <DateFilterBar
              year={filters.year}
              month={filters.month}
              day={filters.day}
              onYearChange={(year) => handleFilterDate(year, filters.month, filters.day)}
              onMonthChange={(month) => handleFilterDate(filters.year, month, filters.day)}
              onDayChange={(day) => handleFilterDate(filters.year, filters.month, day)}
              onClear={handleClearFilters}
            />
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Active filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                Search: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-primary-400 hover:bg-primary-200 hover:text-primary-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.year && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
                Year: {filters.year}
                <button
                  onClick={() => handleFilterDate(undefined, filters.month, filters.day)}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-secondary-400 hover:bg-secondary-200 hover:text-secondary-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.month && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent-100 text-accent-800">
                Month: {filters.month}
                <button
                  onClick={() => handleFilterDate(filters.year, undefined, filters.day)}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-accent-400 hover:bg-accent-200 hover:text-accent-500"
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

        {/* Publications List */}
        <PublicationList
          publications={filteredPublications}
          isLoading={isLoading}
          isAdmin={false}
          onView={handlePublicationView}
          layoutType={layoutType}
          onLayoutChange={setLayoutType}
        />

        {/* Empty State */}
        {!isLoading && filteredPublications.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FileText className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {hasActiveFilters ? 'No publications match your filters' : 'No publications found'}
            </h3>
            <p className="text-gray-600 mb-4">
              {hasActiveFilters 
                ? 'Try adjusting your search criteria or clearing some filters.'
                : 'Check back later for new content.'
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

      {/* Publication Detail Modal */}
      <PublicationDetailModal />
    </div>
  );
};