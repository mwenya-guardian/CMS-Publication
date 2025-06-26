import React, { useState, useEffect } from 'react';
import { Quote } from '../../types/Quote';
import { QuoteList } from '../../components/quotes/QuoteList';
import { DateFilterBar } from '../../components/filters/DateFilterBar';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Search, Filter, X, Quote as QuoteIcon, User, Calendar } from 'lucide-react';
import { quoteService } from '../../services/quoteService';
import { LayoutType, FilterOptions } from '../../types/Common';
import { dateUtils } from '../../utils/dateUtils';

export const QuotesView: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [layoutType, setLayoutType] = useState<LayoutType>('grid');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchQuotes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [quotes, filters, searchTerm]);

  const fetchQuotes = async () => {
    try {
      setIsLoading(true);
      const data = await quoteService.getAll();
      setQuotes(data);
    } catch (error) {
      console.error('Failed to fetch quotes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...quotes];

    if (filters.year) {
      filtered = filtered.filter(quote => 
        new Date(quote.createdAt).getFullYear() === filters.year
      );
    }

    if (filters.month) {
      filtered = filtered.filter(quote => 
        new Date(quote.createdAt).getMonth() + 1 === filters.month
      );
    }

    if (filters.day) {
      filtered = filtered.filter(quote => 
        new Date(quote.createdAt).getDate() === filters.day
      );
    }

    if (filters.category) {
      filtered = filtered.filter(quote => quote.category === filters.category);
    }

    if (filters.featured !== undefined) {
      filtered = filtered.filter(quote => quote.featured === filters.featured);
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(quote => 
        quote.text.toLowerCase().includes(searchLower) ||
        quote.author.toLowerCase().includes(searchLower) ||
        quote.source?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredQuotes(filtered);
  };

  const handleQuoteView = (quote: Quote) => {
    setSelectedQuote(quote);
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
    <div className="bg-gradient-to-br from-accent-600 via-accent-700 to-accent-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
              <QuoteIcon className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Quotes
          </h1>
          <p className="text-xl text-accent-100 mb-8 max-w-3xl mx-auto">
            Find inspiration in words of wisdom from great minds throughout history. 
            Discover quotes that motivate, inspire, and enlighten.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search quotes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <Button
              variant="primary"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              icon={Filter}
              className={hasActiveFilters ? 'bg-primary-400' : ''}
            >
              Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const StatsBar = () => {
    const totalQuotes = quotes.length;
    const filteredCount = filteredQuotes.length;
    const featuredCount = quotes.filter(q => q.featured).length;
    const uniqueAuthors = new Set(quotes.map(q => q.author)).size;

    return (
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-600">{totalQuotes}</div>
              <div className="text-sm text-gray-600">Total Quotes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{uniqueAuthors}</div>
              <div className="text-sm text-gray-600">Authors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-600">{featuredCount}</div>
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

  const QuoteDetailModal = () => {
    if (!selectedQuote) return null;

    const getCategoryColor = (category?: string) => {
      const colors = {
        inspirational: 'bg-blue-100 text-blue-800',
        motivational: 'bg-green-100 text-green-800',
        wisdom: 'bg-purple-100 text-purple-800',
        love: 'bg-pink-100 text-pink-800',
        life: 'bg-yellow-100 text-yellow-800',
        success: 'bg-indigo-100 text-indigo-800',
        other: 'bg-gray-100 text-gray-800',
      };
      return colors[category as keyof typeof colors] || colors.other;
    };

    return (
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Quote Details"
        size="lg"
      >
        <div className="space-y-6">
          {selectedQuote.imageUrl && (
            <div className="flex justify-center">
              <img
                src={selectedQuote.imageUrl}
                alt={selectedQuote.author}
                className="w-24 h-24 object-cover rounded-full"
              />
            </div>
          )}
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <QuoteIcon className="h-8 w-8 text-accent-500" />
            </div>
            <blockquote className="text-xl italic text-gray-800 leading-relaxed mb-6">
              "{selectedQuote.text}"
            </blockquote>
            
            <div className="space-y-2">
              <div className="flex items-center justify-center text-lg font-medium text-gray-900">
                <User className="w-5 h-5 mr-2" />
                {selectedQuote.author}
              </div>
              
              {selectedQuote.source && (
                <p className="text-gray-600">— {selectedQuote.source}</p>
              )}
              
              <div className="flex items-center justify-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                {dateUtils.formatDate(selectedQuote.createdAt)}
              </div>
            </div>
          </div>

          {selectedQuote.category && (
            <div className="flex justify-center">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedQuote.category)}`}>
                {selectedQuote.category}
              </span>
            </div>
          )}

          {selectedQuote.featured && (
            <div className="flex justify-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-accent-100 text-accent-800">
                Featured Quote
              </span>
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
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent-100 text-accent-800">
                Search: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm('')}
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

        <QuoteList
          quotes={filteredQuotes}
          isLoading={isLoading}
          isAdmin={false}
          onView={handleQuoteView}
          layoutType={layoutType}
          onLayoutChange={setLayoutType}
        />

        {!isLoading && filteredQuotes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <QuoteIcon className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {hasActiveFilters ? 'No quotes match your filters' : 'No quotes found'}
            </h3>
            <p className="text-gray-600 mb-4">
              {hasActiveFilters 
                ? 'Try adjusting your search criteria or clearing some filters.'
                : 'Check back later for inspiring quotes.'
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

      <QuoteDetailModal />
    </div>
  );
};