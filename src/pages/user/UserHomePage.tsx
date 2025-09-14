import React, { useState, useEffect } from 'react';
import { PostCard } from '../../components/posts/PostCard';
import { EventCard } from '../../components/events/EventCard';
import { QuoteCard } from '../../components/quotes/QuoteCard';
import { PublicationCard } from '../../components/publications/PublicationCard';
import { ReactionWrapper } from '../../components/common/ReactionWrapper';
import { Pagination } from '../../components/common/Pagination';
import { Post } from '../../types/Post';
import { Event } from '../../types/Event';
import { Quote } from '../../types/Quote';
import { Publication } from '../../types/Publication';
import { postService } from '../../services/postService';
import { eventService } from '../../services/eventService';
import { quoteService } from '../../services/quoteService';
import { publicationService } from '../../services/publicationService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { FileText, Calendar, Quote as QuoteIcon, BookOpen } from 'lucide-react';

export const UserHome: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'events' | 'quotes' | 'publications'>('posts');
  
  // Pagination states
  const [postsPage, setPostsPage] = useState(1);
  const [eventsPage, setEventsPage] = useState(1);
  const [quotesPage, setQuotesPage] = useState(1);
  const [publicationsPage, setPublicationsPage] = useState(1);
  
  const [postsTotalPages, setPostsTotalPages] = useState(1);
  const [eventsTotalPages, setEventsTotalPages] = useState(1);
  const [quotesTotalPages, setQuotesTotalPages] = useState(1);
  const [publicationsTotalPages, setPublicationsTotalPages] = useState(1);

  useEffect(() => {
    loadData();
  }, [activeTab, postsPage, eventsPage, quotesPage, publicationsPage]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'posts') {
        const postsData = await postService.getPeginated(postsPage, 5);
        setPosts(postsData.data || []);
        setPostsTotalPages(postsData.pagination?.totalPages || 1);
      } else if (activeTab === 'events') {
        const eventsData = await eventService.getPaginated(eventsPage, 5);
        setEvents(eventsData.data || []);
        setEventsTotalPages(1); // Assuming no pagination for events for now
      } else if (activeTab === 'quotes') {
        const quotesData = await quoteService.getPaginated(quotesPage, 5);
        setQuotes(quotesData.data || []);
        setQuotesTotalPages(1); // Assuming no pagination for quotes for now
      } else if (activeTab === 'publications') {
        const publicationsData = await publicationService.getPaginated(publicationsPage, 5);
        setPublications(publicationsData.data || []);
        setPublicationsTotalPages(1); // Assuming no pagination for publications for now
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const handlePageChange = (page: number) => {
    if (activeTab === 'posts') {
      setPostsPage(page);
    } else if (activeTab === 'events') {
      setEventsPage(page);
    } else if (activeTab === 'quotes') {
      setQuotesPage(page);
    } else if (activeTab === 'publications') {
      setPublicationsPage(page);
    }
  };

  const getCurrentPage = () => {
    switch (activeTab) {
      case 'posts': return postsPage;
      case 'events': return eventsPage;
      case 'quotes': return quotesPage;
      case 'publications': return publicationsPage;
      default: return 1;
    }
  };

  const getTotalPages = () => {
    switch (activeTab) {
      case 'posts': return postsTotalPages;
      case 'events': return eventsTotalPages;
      case 'quotes': return quotesTotalPages;
      case 'publications': return publicationsTotalPages;
      default: return 1;
    }
  };

  const tabs = [
    { id: 'posts', name: 'Posts', count: posts.length, icon: FileText },
    { id: 'events', name: 'Events', count: events.length, icon: Calendar },
    { id: 'quotes', name: 'Quotes', count: quotes.length, icon: QuoteIcon },
    { id: 'publications', name: 'Publications', count: publications.length, icon: BookOpen },
  ] as const;

useEffect(() => {
  loadData();
}, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Your Dashboard</h1>
        <p className="text-gray-600">
          Stay connected with the latest posts, events, quotes, and publications from your community.
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto scrollbar-hide px-2 sm:px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 sm:px-4 border-b-2 font-medium text-sm whitespace-nowrap flex-shrink-0 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`h-4 w-4 flex-shrink-0 sm:mx-auto ${activeTab === tab.id ? 'text-blue-600' : ''}`} />
                  <span className="hidden sm:inline">{tab.name}</span>
                  <span className={`bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-blue-100 text-blue-800' : ''
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab content */}

        {isLoading && (
          <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
        ) || 
        (<div className="p-6">
          {activeTab === 'posts' && (
            <div className="space-y-4">
              {posts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No posts available at the moment.</p>
                </div>
              ) : (
                posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                  />
                ))
              )}
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-4">
              {events.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No events available at the moment.</p>
                </div>
              ) : (
                events.map((event) => (
                  <ReactionWrapper
                    key={event.id}
                    targetId={event.id}
                    targetType="EVENT"
                    initialLikes={0} // You might want to get this from the event data
                    initialDislikes={0}
                    initialComments={0}
                  >
                    <div className="p-4">
                      <EventCard event={event} />
                    </div>
                  </ReactionWrapper>
                ))
              )}
            </div>
          )}

          {activeTab === 'quotes' && (
            <div className="space-y-4">
              {quotes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No quotes available at the moment.</p>
                </div>
              ) : (
                quotes.map((quote) => (
                  <ReactionWrapper
                    key={quote.id}
                    targetId={quote.id}
                    targetType="QUOTE"
                    initialLikes={0} // You might want to get this from the quote data
                    initialDislikes={0}
                    initialComments={0}
                  >
                    <div className="p-4">
                      <QuoteCard quote={quote} />
                    </div>
                  </ReactionWrapper>
                ))
              )}
            </div>
          )}

          {activeTab === 'publications' && (
            <div className="space-y-4">
              {publications.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No publications available at the moment.</p>
                </div>
              ) : (
                publications.map((publication) => (
                  <ReactionWrapper
                    key={publication.id}
                    targetId={publication.id}
                    targetType="PUBLICATION"
                    initialLikes={0} // You might want to get this from the publication data
                    initialDislikes={0}
                    initialComments={0}
                  >
                    <div className="p-4">
                      <PublicationCard publication={publication} />
                    </div>
                  </ReactionWrapper>
                ))
              )}
            </div>
          )}
        </div>)}

        {/* Pagination */}
        {getTotalPages() > 1 && (
          <Pagination
            currentPage={getCurrentPage()}
            totalPages={getTotalPages()}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};
