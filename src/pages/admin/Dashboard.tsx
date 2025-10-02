import React, { useState, useEffect } from 'react';
import { FileText, Calendar, Quote, TrendingUp, Newspaper, Users, AlertTriangle, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { publicationService } from '../../services/publicationService';
import { eventService } from '../../services/eventService';
import { quoteService } from '../../services/quoteService';
import { bulletinService } from '../../services/bulletinService';
import { newsletterService } from '../../services/newsletterService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { dateUtils } from '../../utils/dateUtils';
import { analysisService } from '../../services/analysisService';
import { AnalysisStats } from '../../types/Analysis';

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
  bulletins: {
    total: number;
    thisYear: number;
    published: number;
  };
  newsletterSubscribers: {
    total: number;
    thisYear: number;
    active: number;
  };
  yearlyData: {
    year: number;
    publications: number;
    events: number;
    quotes: number;
    bulletins: number;
  }[];
  newsletterYearlyData: {
    year: number;
    total: number;
    active: number;
    inactive: number;
  }[];
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [analysisStats, setAnalysisStats] = useState<AnalysisStats | null>(null);
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
          quoteFeatured,
          bulletinTotal,
          bulletinThisYear,
          bulletinPublished,
          newsletterTotal,
          newsletterThisYear,
          newsletterActive
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
          bulletinService.getTotalCount(),
          bulletinService.getCountByYear(currentYear),
          bulletinService.getPublishedCount(),
          newsletterService.getTotalCount(),
          newsletterService.getCountByYear(currentYear),
          newsletterService.getActiveCount(),
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

        const bulletinStats = {
          total: bulletinTotal,
          thisYear: bulletinThisYear,
          published: bulletinPublished,
        };

        const newsletterStats = {
          total: newsletterTotal,
          thisYear: newsletterThisYear,
          active: newsletterActive,
        };

        // For yearly data, we'll need to fetch counts for the last 3 years
        const currentYearNum = currentYear;
        const yearlyDataPromises = [];
        const newsletterYearlyDataPromises = [];
        
        for (let i = 0; i < 3; i++) {
          const year = currentYearNum - i;
          yearlyDataPromises.push(
            Promise.all([
              publicationService.getCountByYear(year),
              eventService.getCountByYear(year),
              quoteService.getCountByYear(year),
              bulletinService.getCountByYear(year),
            ]).then(([pubCount, eventCount, quoteCount, bulletinCount]) => ({
              year,
              publications: pubCount,
              events: eventCount,
              quotes: quoteCount,
              bulletins: bulletinCount,
            }))
          );

          newsletterYearlyDataPromises.push(
            Promise.all([
              newsletterService.getCountByYear(year),
              newsletterService.getActiveCountByYear(year),
              newsletterService.getInactiveCountByYear(year),
            ]).then(([totalCount, activeCount, inactiveCount]) => ({
              year,
              total: totalCount,
              active: activeCount,
              inactive: inactiveCount,
            }))
          );
        }

        const [yearlyData, newsletterYearlyData] = await Promise.all([
          Promise.all(yearlyDataPromises),
          Promise.all(newsletterYearlyDataPromises)
        ]);

        setStats({
          publications: publicationStats,
          events: eventStats,
          quotes: quoteStats,
          bulletins: bulletinStats,
          newsletterSubscribers: newsletterStats,
          yearlyData,
          newsletterYearlyData,
        });

        // Load analysis stats
        try {
          const analysisData = await analysisService.getAnalysisStats();
          setAnalysisStats(analysisData);
        } catch (analysisError) {
          console.error('Failed to load analysis stats:', analysisError);
          // Don't fail the whole dashboard if analysis fails
        }
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-6">
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
        <StatCard
          title="Bulletins"
          value={stats.bulletins.total}
          subtitle={`${stats.bulletins.thisYear} this year, ${stats.bulletins.published} published`}
          icon={Newspaper}
          color="bg-green-600"
        />
        <StatCard
          title="Newsletter Subscribers"
          value={stats.newsletterSubscribers.total}
          subtitle={`${stats.newsletterSubscribers.thisYear} this year, ${stats.newsletterSubscribers.active} active`}
          icon={Users}
          color="bg-purple-600"
        />
      </div>

      {/* AI Analysis Summary */}
      {analysisStats && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">AI Analysis Summary</h2>
            <button
              onClick={() => navigate('/admin/analysis')}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View Details →
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{analysisStats.totalAnalyzed}</div>
              <div className="text-sm text-gray-600">Comments Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{analysisStats.flaggedComments}</div>
              <div className="text-sm text-gray-600">Flagged Comments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{analysisStats.recentAlerts.length}</div>
              <div className="text-sm text-gray-600">Recent Alerts</div>
            </div>
          </div>

          {/* Flagged Comments Alert */}
          {analysisStats.flaggedComments > 0 && (
            <div 
              className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg cursor-pointer hover:bg-red-100 transition-colors"
              onClick={() => navigate('/admin/analysis?tab=flagged')}
            >
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <div>
                  <h4 className="font-medium text-red-900">
                    {analysisStats.flaggedComments} comments require attention
                  </h4>
                  <p className="text-sm text-red-700">
                    Comments flagged for potential moderation issues
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-red-600" />
                <span className="text-sm text-red-600 font-medium">Review →</span>
              </div>
            </div>
          )}

          {/* Recent Alerts */}
          {analysisStats.recentAlerts.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-900 mb-2">Recent Alerts</h4>
              <div className="space-y-2">
                {analysisStats.recentAlerts.slice(0, 3).map((alert) => (
                  <div 
                    key={alert.id}
                    className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => navigate('/admin/analysis?tab=alerts')}
                  >
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className={`h-4 w-4 ${alert.severity === 'CRITICAL' ? 'text-red-600' : 'text-orange-600'}`} />
                      <span className="text-sm text-gray-900">{alert.note}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      alert.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

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
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Bulletins</span>
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
                        width: `${Math.max((yearData.publications / (yearData.publications + yearData.events + yearData.quotes + yearData.bulletins)) * 100, 5)}%` 
                      }}
                    />
                    <div 
                      className="bg-secondary-500" 
                      style={{ 
                        width: `${Math.max((yearData.events / (yearData.publications + yearData.events + yearData.quotes + yearData.bulletins)) * 100, 5)}%` 
                      }}
                    />
                    <div 
                      className="bg-accent-500" 
                      style={{ 
                        width: `${Math.max((yearData.quotes / (yearData.publications + yearData.events + yearData.quotes + yearData.bulletins)) * 100, 5)}%` 
                      }}
                    />
                    <div 
                      className="bg-green-500" 
                      style={{ 
                        width: `${Math.max((yearData.bulletins / (yearData.publications + yearData.events + yearData.quotes + yearData.bulletins)) * 100, 5)}%` 
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{yearData.publications}P</span>
                  <span>{yearData.events}E</span>
                  <span>{yearData.quotes}Q</span>
                  <span>{yearData.bulletins}B</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Subscribers by Year */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Newsletter Subscribers by Year</h2>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Total</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Active</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Inactive</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {stats.newsletterYearlyData.map((yearData) => (
            <div key={yearData.year} className="flex items-center">
              <div className="w-16 text-sm font-medium text-gray-900">
                {yearData.year}
              </div>
              <div className="flex-1 flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="flex h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-green-500" 
                      style={{ 
                        width: `${Math.max((yearData.active / yearData.total) * 100, 5)}%` 
                      }}
                    />
                    <div 
                      className="bg-red-500" 
                      style={{ 
                        width: `${Math.max((yearData.inactive / yearData.total) * 100, 5)}%` 
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{yearData.total} Total</span>
                  <span className="text-green-600">{yearData.active} Active</span>
                  <span className="text-red-600">{yearData.inactive} Inactive</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};