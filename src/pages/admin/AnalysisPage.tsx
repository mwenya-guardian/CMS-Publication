import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Brain, 
  AlertTriangle, 
  TrendingUp, 
  MessageCircle, 
  Filter,
  RefreshCw,
  BarChart3,
  Search
} from 'lucide-react';
import { analysisService } from '../../services/analysisService';
import { CommentAnalysis, AnalysisJob, AnalysisAlert, AnalysisStats, TrendData } from '../../types/Analysis';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Pagination } from '../../components/common/Pagination';
import { TrendChart } from '../../components/analysis/TrendChart';
import { AnalysisCard } from '../../components/analysis/AnalysisCard';
import { CommentDetailsModal } from '../../components/analysis/CommentDetailsModal';
import { dateUtils } from '../../utils/dateUtils';

type TabType = 'overview' | 'flagged' | 'trends' | 'jobs' | 'alerts';

export const AnalysisPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>(
    (searchParams.get('tab') as TabType) || 'overview'
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  // Overview data
  const [stats, setStats] = useState<AnalysisStats | null>(null);
  
  // Flagged comments data
  const [flaggedComments, setFlaggedComments] = useState<CommentAnalysis[]>([]);
  const [flaggedPage, setFlaggedPage] = useState(1);
  const [flaggedTotal, setFlaggedTotal] = useState(0);
  
  // Trend data
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [trendDays, setTrendDays] = useState(30);
  
  // Jobs data
  const [jobs, setJobs] = useState<AnalysisJob[]>([]);
  
  // Alerts data
  const [alerts, setAlerts] = useState<AnalysisAlert[]>([]);
  const [alertsPage, setAlertsPage] = useState(1);
  const [alertsTotal, setAlertsTotal] = useState(0);
  
  // Filters
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>('');
  const [sentimentFilter, setSentimentFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Modal state
  const [selectedAnalysis, setSelectedAnalysis] = useState<CommentAnalysis | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const pageSize = 10;

  useEffect(() => {
    // Update URL when tab changes
    if (activeTab !== 'overview') {
      setSearchParams({ tab: activeTab });
    } else {
      setSearchParams({});
    }
    loadData();
  }, [activeTab, flaggedPage, alertsPage, trendDays, setSearchParams]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');

      switch (activeTab) {
        case 'overview':
          await loadOverviewData();
          break;
        case 'flagged':
          await loadFlaggedComments();
          break;
        case 'trends':
          await loadTrendData();
          break;
        case 'jobs':
          await loadJobs();
          break;
        case 'alerts':
          await loadAlerts();
          break;
      }
    } catch (err) {
      setError('Failed to load analysis data');
      console.error('Analysis page error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadOverviewData = async () => {
    const statsData = await analysisService.getAnalysisStats();
    setStats(statsData);
  };

  const loadFlaggedComments = async () => {
    const filters = {
      entityType: entityTypeFilter || undefined,
      sentiment: sentimentFilter || undefined,
      search: searchTerm || undefined
    };
    
    const response = await analysisService.getFlaggedComments(flaggedPage, pageSize, filters);
    setFlaggedComments(response.data);
    setFlaggedTotal(response.pagination.total);
  };

  const loadTrendData = async () => {
    const trends = await analysisService.getTrendData(undefined, undefined, trendDays);
    setTrendData(trends);
  };

  const loadJobs = async () => {
    const jobsData = await analysisService.getAllJobs();
    setJobs(jobsData.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()));
  };

  const loadAlerts = async () => {
    const response = await analysisService.getAlerts(alertsPage, pageSize);
    setAlerts(response.data);
    setAlertsTotal(response.pagination.total);
  };

  const handleRefresh = () => {
    loadData();
  };

  const handleViewDetails = (analysis: CommentAnalysis) => {
    setSelectedAnalysis(analysis);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedAnalysis(null);
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'flagged', name: 'Flagged Comments', icon: AlertTriangle },
    { id: 'trends', name: 'Trends', icon: TrendingUp },
    { id: 'jobs', name: 'Analysis Jobs', icon: Brain },
    { id: 'alerts', name: 'Alerts', icon: MessageCircle },
  ] as const;

  const renderTabContent = () => {
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
            <AlertTriangle className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={handleRefresh} icon={RefreshCw}>
            Try Again
          </Button>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'flagged':
        return renderFlaggedComments();
      case 'trends':
        return renderTrends();
      case 'jobs':
        return renderJobs();
      case 'alerts':
        return renderAlerts();
      default:
        return null;
    }
  };

  const renderOverview = () => {
    if (!stats) return null;

    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-blue-600">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">Total Analyzed</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalAnalyzed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-red-600">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">Flagged Comments</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.flaggedComments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-green-600">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">Positive Sentiment</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.sentimentBreakdown.positive}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-orange-600">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">Recent Alerts</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.recentAlerts.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sentiment Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-24 text-sm text-gray-600">Positive</div>
              <div className="flex-1 bg-gray-200 rounded-full h-2 mx-4">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ 
                    width: `${(stats.sentimentBreakdown.positive / stats.totalAnalyzed) * 100}%` 
                  }}
                />
              </div>
              <div className="w-16 text-sm text-gray-900 text-right">
                {stats.sentimentBreakdown.positive}
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-24 text-sm text-gray-600">Neutral</div>
              <div className="flex-1 bg-gray-200 rounded-full h-2 mx-4">
                <div 
                  className="bg-gray-500 h-2 rounded-full" 
                  style={{ 
                    width: `${(stats.sentimentBreakdown.neutral / stats.totalAnalyzed) * 100}%` 
                  }}
                />
              </div>
              <div className="w-16 text-sm text-gray-900 text-right">
                {stats.sentimentBreakdown.neutral}
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-24 text-sm text-gray-600">Negative</div>
              <div className="flex-1 bg-gray-200 rounded-full h-2 mx-4">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ 
                    width: `${(stats.sentimentBreakdown.negative / stats.totalAnalyzed) * 100}%` 
                  }}
                />
              </div>
              <div className="w-16 text-sm text-gray-900 text-right">
                {stats.sentimentBreakdown.negative}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Alerts */}
        {stats.recentAlerts.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
            <div className="space-y-3">
              {stats.recentAlerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className={`h-5 w-5 ${alert.severity === 'CRITICAL' ? 'text-red-600' : 'text-orange-600'}`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{alert.note}</p>
                      <p className="text-xs text-gray-600">{alert.entityType} - {dateUtils.formatDate(alert.createdAt)}</p>
                    </div>
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
    );
  };

  const renderFlaggedComments = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <Input
              placeholder="Search comments..."
              value={searchTerm}
              onChange={setSearchTerm}
              icon={Search}
            />
          </div>
          <Select
            value={entityTypeFilter}
            onChange={setEntityTypeFilter}
            options={[
              { value: '', label: 'All Types' },
              { value: 'POST', label: 'Posts' },
              { value: 'EVENT', label: 'Events' },
              { value: 'QUOTE', label: 'Quotes' },
              { value: 'PUBLICATION', label: 'Publications' }
            ]}
            className="w-40"
          />
          <Select
            value={sentimentFilter}
            onChange={setSentimentFilter}
            options={[
              { value: '', label: 'All Sentiments' },
              { value: 'positive', label: 'Positive' },
              { value: 'neutral', label: 'Neutral' },
              { value: 'negative', label: 'Negative' }
            ]}
            className="w-40"
          />
          <Button onClick={loadFlaggedComments} icon={Filter} variant="outline">
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Flagged Comments List */}
      <div className="grid gap-4">
        {flaggedComments.map((analysis) => (
          <AnalysisCard
            key={analysis.id}
            analysis={analysis}
            onViewDetails={() => handleViewDetails(analysis)}
          />
        ))}
      </div>

      {/* Pagination */}
      {flaggedTotal > pageSize && (
        <Pagination
          currentPage={flaggedPage}
          totalPages={Math.ceil(flaggedTotal / pageSize)}
          onPageChange={setFlaggedPage}
        />
      )}
    </div>
  );

  const renderTrends = () => (
    <div className="space-y-6">
      {/* Trend Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Sentiment Trends</h3>
          <div className="flex items-center space-x-4">
            <Select
              value={trendDays.toString()}
              onChange={(value) => setTrendDays(parseInt(value))}
              options={[
                { value: '7', label: '7 days' },
                { value: '30', label: '30 days' },
                { value: '90', label: '90 days' }
              ]}
              className="w-32"
            />
            <Button onClick={loadTrendData} icon={RefreshCw} variant="outline" size="sm">
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <TrendChart data={trendData} height={400} />
      </div>
    </div>
  );

  const renderJobs = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Analysis Jobs</h3>
            <Button onClick={loadJobs} icon={RefreshCw} variant="outline" size="sm">
              Refresh
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {job.id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {job.entityType} - {job.entityId.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      job.status === 'SUCCESS' ? 'bg-green-100 text-green-700' :
                      job.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                      job.status === 'RUNNING' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {job.processedComments} / {job.totalComments}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {dateUtils.formatDate(job.submittedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-6">
      <div className="grid gap-4">
        {alerts.map((alert) => (
          <div key={alert.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <AlertTriangle className={`h-6 w-6 mt-1 ${
                  alert.severity === 'CRITICAL' ? 'text-red-600' : 'text-orange-600'
                }`} />
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900">{alert.note}</h4>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <p>Entity: {alert.entityType} - {alert.entityId.substring(0, 8)}...</p>
                    <p>Metric: {alert.metric}</p>
                    <p>Current: {(alert.currentValue * 100).toFixed(1)}% | Baseline: {(alert.baselineValue * 100).toFixed(1)}%</p>
                    <p>Window: {dateUtils.formatDate(alert.windowStart)} - {dateUtils.formatDate(alert.windowEnd)}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  alert.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {alert.severity}
                </span>
                <p className="text-xs text-gray-500 mt-2">{dateUtils.formatDate(alert.createdAt)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {alertsTotal > pageSize && (
        <Pagination
          currentPage={alertsPage}
          totalPages={Math.ceil(alertsTotal / pageSize)}
          onPageChange={setAlertsPage}
        />
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Analysis</h1>
          <p className="text-gray-600 mt-2">Monitor comment sentiment and moderation insights</p>
        </div>
        <Button onClick={handleRefresh} icon={RefreshCw} variant="outline">
          Refresh
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Comment Details Modal */}
      <CommentDetailsModal
        analysis={selectedAnalysis}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
      />
    </div>
  );
};
