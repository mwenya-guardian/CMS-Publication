import React, { useState, useEffect } from 'react';
import { Quote } from '../../types/Quote';
import { QuoteList } from '../../components/quotes/QuoteList';
import { QuoteForm } from '../../components/quotes/QuoteForm';
import { DateFilterBar } from '../../components/filters/DateFilterBar';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Plus, Filter } from 'lucide-react';
import { quoteService } from '../../services/quoteService';
import { LayoutType, FilterOptions } from '../../types/Common';

export const QuotesPage: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | undefined>();
  const [layoutType, setLayoutType] = useState<LayoutType>('grid');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchQuotes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [quotes, filters]);

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

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(quote => 
        quote.text.toLowerCase().includes(searchTerm) ||
        quote.author.toLowerCase().includes(searchTerm) ||
        quote.source?.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredQuotes(filtered);
  };

  const handleCreate = () => {
    setSelectedQuote(undefined);
    setIsFormModalOpen(true);
  };

  const handleEdit = (quote: Quote) => {
    setSelectedQuote(quote);
    setIsFormModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this quote?')) {
      try {
        await quoteService.delete(id);
        await fetchQuotes();
      } catch (error) {
        console.error('Failed to delete quote:', error);
      }
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      if (selectedQuote) {
        await quoteService.update(data);
      } else {
        await quoteService.create(data);
      }
      setIsFormModalOpen(false);
      await fetchQuotes();
    } catch (error) {
      console.error('Failed to save quote:', error);
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
          <h1 className="text-2xl font-bold text-gray-900">Quotes</h1>
          <p className="text-gray-600 mt-1">Manage your quote collection</p>
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
            New Quote
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

      {/* Quotes List */}
      <QuoteList
        quotes={filteredQuotes}
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
        title={selectedQuote ? 'Edit Quote' : 'Create Quote'}
        size="xl"
      >
        <QuoteForm
          quote={selectedQuote}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
};