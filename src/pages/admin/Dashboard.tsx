import React, { useState, useEffect } from 'react';
import { FileText, Calendar, Quote, TrendingUp } from 'lucide-react';
import { publicationService } from '../../services/publicationService';
import { eventService } from '../../services/eventService';
import { quoteService } from '../../services/quoteService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { dateUtils } from '../../utils/dateUtils';

interface StatsData {
  publications: {
    total: number;
    thisYear: number;
    featured: number;
  };
  events: {
    total: number;
    thisYear: number;
    upcoming: number;
  };
  quotes: {
    total: number;
    thisYear: number;
    featured: number;
  };
  yearlyData: {
    year: number;
    publications: number;
    events: number;
    quotes: number;
  }[];
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        
        const currentYear = dateUtils.getCurrentYear();
        
        // Fetch count data using optimized endpoints
        const [
          publicationTotal,
          publicationThisYear,
          publicationFeatured,
          eventTotal,
          eventThisYear,
          eventUpcoming,
          quoteTotal,
          quoteThisYear,
          quoteFeatured
        ] = await Promise.all([
          publicationService.getTotalCount(),
          publicationService.getCountByYear(currentYear),
          publicationService.getFeaturedCount(),
          eventService.getTotalCount(),
          eventService.getCountByYear(currentYear),
          eventService.getUpcomingCount(),
          quoteService.getTotalCount(),
          quoteService.getCountByYear(currentYear),
          quoteService.getFeaturedCount(),
        ]);

        // Build stats from count data
        const publicationStats = {
          total: publicationTotal,
          thisYear: publicationThisYear,
          featured: publicationFeatured,
        };

        const eventStats = {
          total: eventTotal,
          thisYear: eventThisYear,
          upcoming: eventUpcoming,
        };

        const quoteStats = {
          total: quoteTotal,
          thisYear: quoteThisYear,
          featured: quoteFeatured,
        };

        // For yearly data, we'll need to fetch counts for the last 5 years
        const currentYearNum = currentYear;
        const yearlyDataPromises = [];
        
        for (let i = 0; i < 3; i++) {
          const year = currentYearNum - i;
          yearlyDataPromises.push(
            Promise.all([
              publicationService.getCountByYear(year),
              eventService.getCountByYear(year),
              quoteService.getCountByYear(year),
            ]).then(([pubCount, eventCount, quoteCount]) => ({
              year,
              publications: pubCount,
              events: eventCount,
              quotes: quoteCount,
            }))
          );
        }

        const yearlyData = await Promise.all(yearlyDataPromises);

        setStats({
          publications: publicationStats,
          events: eventStats,
          quotes: quoteStats,
          yearlyData,
        });
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <TrendingUp className="mx-auto h-12 w-12" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!stats) return null;

  const StatCard: React.FC<{
    title: string;
    value: number;
    subtitle: string;
    icon: React.ElementType;
    color: string;
  }> = ({ title, value, subtitle, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your CMS content and activity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Publications"
          value={stats.publications.total}
          subtitle={`${stats.publications.thisYear} this year, ${stats.publications.featured} featured`}
          icon={FileText}
          color="bg-primary-600"
        />
        <StatCard
          title="Events"
          value={stats.events.total}
          subtitle={`${stats.events.upcoming} upcoming, ${stats.events.thisYear} this year`}
          icon={Calendar}
          color="bg-secondary-600"
        />
        <StatCard
          title="Quotes"
          value={stats.quotes.total}
          subtitle={`${stats.quotes.thisYear} this year, ${stats.quotes.featured} featured`}
          icon={Quote}
          color="bg-accent-600"
        />
      </div>

      {/* Content by Year */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Content by Year</h2>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-primary-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Publications</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-secondary-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Events</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-accent-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Quotes</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {stats.yearlyData.map((yearData) => (
            <div key={yearData.year} className="flex items-center">
              <div className="w-16 text-sm font-medium text-gray-900">
                {yearData.year}
              </div>
              <div className="flex-1 flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="flex h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary-500" 
                      style={{ 
                        width: `${Math.max((yearData.publications / (yearData.publications + yearData.events + yearData.quotes)) * 100, 5)}%` 
                      }}
                    />
                    <div 
                      className="bg-secondary-500" 
                      style={{ 
                        width: `${Math.max((yearData.events / (yearData.publications + yearData.events + yearData.quotes)) * 100, 5)}%` 
                      }}
                    />
                    <div 
                      className="bg-accent-500" 
                      style={{ 
                        width: `${Math.max((yearData.quotes / (yearData.publications + yearData.events + yearData.quotes)) * 100, 5)}%` 
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{yearData.publications}P</span>
                  <span>{yearData.events}E</span>
                  <span>{yearData.quotes}Q</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};