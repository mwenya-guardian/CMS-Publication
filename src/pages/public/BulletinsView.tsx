import React, { useState, useEffect } from 'react';
import { ChurchBulletin } from '../../types/ChurchBulletin';
import { BulletinList } from '../../components/bulletin/BulletinList';
import { DateFilterBar } from '../../components/filters/DateFilterBar';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Search, Filter, X, FileText, Calendar, Download, Eye } from 'lucide-react';
import { bulletinService } from '../../services/bulletinService';
import { LayoutType, FilterOptions } from '../../types/Common';
import { dateUtils } from '../../utils/dateUtils';

export const BulletinsView: React.FC = () => {
  const [bulletins, setBulletins] = useState<ChurchBulletin[]>([]);
  const [filteredBulletins, setFilteredBulletins] = useState<ChurchBulletin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBulletin, setSelectedBulletin] = useState<ChurchBulletin | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [layoutType, setLayoutType] = useState<LayoutType>('grid');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBulletins();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [bulletins, filters, searchTerm]);

  const fetchBulletins = async () => {
    try {
      setIsLoading(true);
      // Only fetch published bulletins for public view
      const data = await bulletinService.getAll({ status: 'published' });
      setBulletins(data);
    } catch (error) {
      console.error('Failed to fetch bulletins:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...bulletins];

    if (filters.year) {
      filtered = filtered.filter(bulletin => 
        new Date(bulletin.bulletinDate).getFullYear() === filters.year
      );
    }

    if (filters.month) {
      filtered = filtered.filter(bulletin => 
        new Date(bulletin.bulletinDate).getMonth() + 1 === filters.month
      );
    }

    if (filters.day) {
      filtered = filtered.filter(bulletin => 
        new Date(bulletin.bulletinDate).getDate() === filters.day
      );
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(bulletin => 
        bulletin.churchInfo.name.toLowerCase().includes(searchLower) ||
        bulletin.coverContent.welcomeMessage.toLowerCase().includes(searchLower) ||
        bulletin.announcements.some(a => 
          a.title.toLowerCase().includes(searchLower) ||
          a.description.toLowerCase().includes(searchLower)
        )
      );
    }

    setFilteredBulletins(filtered);
  };

  const handleBulletinView = (bulletin: ChurchBulletin) => {
    setSelectedBulletin(bulletin);
    setIsDetailModalOpen(true);
  };

  const handleDownloadPdf = async (bulletin: ChurchBulletin) => {
    try {
      const blob = await bulletinService.exportToPdf(bulletin.id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bulletin-${bulletin.bulletinDate}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download PDF:', error);
    }
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
    <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
              <FileText className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Church Bulletins
          </h1>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Access our weekly church bulletins with worship schedules, announcements, 
            and important church information. Stay connected with our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search bulletins..."
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
    const totalBulletins = bulletins.length;
    const filteredCount = filteredBulletins.length;
    const currentYear = dateUtils.getCurrentYear();
    const thisYearCount = bulletins.filter(b => 
      new Date(b.bulletinDate).getFullYear() === currentYear
    ).length;
    const thisMonthCount = bulletins.filter(b => {
      const date = new Date(b.bulletinDate);
      const now = new Date();
      return date.getFullYear() === now.getFullYear() && 
             date.getMonth() === now.getMonth();
    }).length;

    return (
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{totalBulletins}</div>
              <div className="text-sm text-gray-600">Total Bulletins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-600">{thisYearCount}</div>
              <div className="text-sm text-gray-600">This Year</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-600">{thisMonthCount}</div>
              <div className="text-sm text-gray-600">This Month</div>
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

  const BulletinDetailModal = () => {
    if (!selectedBulletin) return null;

    return (
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={`Church Bulletin - ${dateUtils.formatDate(selectedBulletin.bulletinDate)}`}
        size="xl"
      >
        <div className="space-y-6">
          {/* Church Info */}
          <div className="text-center border-b border-gray-200 pb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {selectedBulletin.churchInfo.name}
            </h2>
            <p className="text-gray-600">{selectedBulletin.churchInfo.address}</p>
            <p className="text-lg font-medium text-primary-600 mt-2">
              {selectedBulletin.coverContent.motto}
            </p>
          </div>

          {/* Welcome Message */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Welcome Message</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {selectedBulletin.coverContent.welcomeMessage}
            </p>
          </div>

          {/* Services */}
          {selectedBulletin.services.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Schedule</h3>
              <div className="space-y-3">
                {selectedBulletin.services.map((service, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{service.label}</h4>
                      <span className="text-sm text-gray-600">
                        {service.startTime} - {service.endTime}
                      </span>
                    </div>
                    {service.theme && (
                      <p className="text-sm text-primary-600 mb-2">Theme: {service.theme}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Announcements */}
          {selectedBulletin.announcements.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Announcements</h3>
              <div className="space-y-3">
                {selectedBulletin.announcements.map((announcement, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{announcement.title}</h4>
                    <p className="text-gray-700 text-sm mb-2">{announcement.description}</p>
                    {announcement.startDate && (
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {dateUtils.formatDate(announcement.startDate)}
                        {announcement.endDate && announcement.endDate !== announcement.startDate && (
                          <span> - {dateUtils.formatDate(announcement.endDate)}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Download Button */}
          <div className="flex justify-center pt-6 border-t border-gray-200">
            <Button
              variant="primary"
              onClick={() => handleDownloadPdf(selectedBulletin)}
              icon={Download}
            >
              Download PDF
            </Button>
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

        <BulletinList
          bulletins={filteredBulletins}
          isLoading={isLoading}
          isAdmin={false}
          onView={handleBulletinView}
          onDownloadPdf={handleDownloadPdf}
          layoutType={layoutType}
          onLayoutChange={setLayoutType}
        />

        {!isLoading && filteredBulletins.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FileText className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {hasActiveFilters ? 'No bulletins match your filters' : 'No bulletins found'}
            </h3>
            <p className="text-gray-600 mb-4">
              {hasActiveFilters 
                ? 'Try adjusting your search criteria or clearing some filters.'
                : 'Check back later for new bulletins.'
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

      <BulletinDetailModal />
    </div>
  );
};