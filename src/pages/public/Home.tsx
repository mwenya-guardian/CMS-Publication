import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Calendar, Quote, Star } from 'lucide-react';
import { Publication } from '../../types/Publication';
import { Event } from '../../types/Event';
import { Quote as QuoteType } from '../../types/Quote';
import { publicationService } from '../../services/publicationService';
import { eventService } from '../../services/eventService';
import { quoteService } from '../../services/quoteService';
import { PublicationCard } from '../../components/publications/PublicationCard';
import { EventCard } from '../../components/events/EventCard';
import { QuoteCard } from '../../components/quotes/QuoteCard';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const Home: React.FC = () => {
  const [featuredPublications, setFeaturedPublications] = useState<Publication[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [featuredQuotes, setFeaturedQuotes] = useState<QuoteType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedContent = async () => {
      try {
        setIsLoading(true);
        
        const [publications, events, quotes] = await Promise.all([
          publicationService.getAll({ featured: true }),
          eventService.getAll(),
          quoteService.getAll({ featured: true }),
        ]);

        // Get featured publications (limit to 3)
        setFeaturedPublications(publications.slice(0, 3));

        // Get upcoming events (limit to 3)
        const upcoming = events
          .filter(event => new Date(event.startDate) > new Date())
          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
          .slice(0, 3);
        setUpcomingEvents(upcoming);

        // Get featured quotes (limit to 3)
        setFeaturedQuotes(quotes.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch featured content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedContent();
        // This is just a placeholder to initialize the state
    let featuredPublications: Publication[] = [];
    let upcomingEvents: Event[] = [];
    let featuredQuotes: QuoteType[] = [];
    let publicationDummyData: Publication = {
      id: '1',
      title: 'Sample Publication',
      content: 'This is a sample publication content. More details can be found in the full article.',
      // imageUrl: 'https://via.placeholder.com/150',
      date: '2023-10-01',
      layoutType: 'grid',
      author: "mutende the name", //?
      tags: ["mwenya", "guardian"], //?
      featured: true, //?
      createdAt: "2023-10-01T00:00:00Z",
      updatedAt: "2023-10-01T00:00:00Z"
    }
    let eventDummyData: Event = {
      id: '1',
      title: 'Sample Event',
      description: 'This is a sample event description. More details can be found in the event page. The event will cover various topics and feature guest speakers.',
      startDate: '2023-10-15T10:00:00Z',
      endDate: '2023-10-15T12:00:00Z',
      location: 'University Church',
      // imageUrl: 'https://via.placeholder.com/150',
      createdAt: "2023-10-01T00:00:00Z",
      updatedAt: "2023-10-01T00:00:00Z",
      category: 'conference',
    }
    /** 
     * export interface Quote {
       id: string;
       text: string;
       author: string;
       source?: string;
       category?: string;
       imageUrl?: string;
       featured?: boolean;
       createdAt: string;
       updatedAt: string;
     }
    */
    let quoteDummyData: QuoteType = {
      id: '1',
      text: 'This is a sample quote. More inspirational quotes can be found in the quotes section. The quote aims to inspire and motivate readers.',
      author: 'john doe',
      createdAt: '2023-10-01T00:00:00Z',
      updatedAt: '2023-10-01T00:00:00Z',
    }
    upcomingEvents.push(eventDummyData);
    featuredQuotes.push(quoteDummyData);
    featuredPublications.push(publicationDummyData);
        upcomingEvents.push(eventDummyData);
    featuredQuotes.push(quoteDummyData);
    featuredPublications.push(publicationDummyData);
        upcomingEvents.push(eventDummyData);
    featuredQuotes.push(quoteDummyData);
    featuredPublications.push(publicationDummyData);
        upcomingEvents.push(eventDummyData);
    featuredQuotes.push(quoteDummyData);
    featuredPublications.push(publicationDummyData);
    setFeaturedPublications(featuredPublications);
    setUpcomingEvents(upcomingEvents);
    setFeaturedQuotes(featuredQuotes);
  }, []);

  const HeroSection = () => (
    <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Welcome to Our
            <span className="block text-accent-300">Content Hub</span>
          </h1>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Discover our latest publications, upcoming events, and inspiring quotes. 
            Stay connected with content that matters to you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="accent"
              size="lg"
              onClick={() => document.getElementById('featured-content')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Content
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Link to="/publications">
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-primary-600">
                View All Publications
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  const FeaturedSection: React.FC<{
    title: string;
    description: string;
    icon: React.ElementType;
    viewAllLink: string;
    children: React.ReactNode;
  }> = ({ title, description, icon: Icon, viewAllLink, children }) => (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary-100 rounded-full">
              <Icon className="h-8 w-8 text-primary-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{description}</p>
        </div>
        {children}
        <div className="text-center mt-12">
          <Link to={viewAllLink}>
            <Button variant="outline" size="lg">
              View All
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  //initializing featured publications, upcoming events, and featured quotes
  // useEffect(() => {
  //   // This is just a placeholder to initialize the state
  //   let featuredPublications: Publication[] = [];
  //   let upcomingEvents: Event[] = [];
  //   let featuredQuotes: QuoteType[] = [];
  //   let publicationDummyData: Publication = {
  //     id: '1',
  //     title: 'Sample Publication',
  //     content: 'This is a sample publication content.',
  //     imageUrl: 'https://via.placeholder.com/150',
  //     date: '2023-10-01',
  //     layoutType: 'grid',
  //     author: "mutende", //?
  //     tags: ["mwenya", "guardian"], //?
  //     featured: true, //?
  //     createdAt: "2023-10-01T00:00:00Z",
  //     updatedAt: "2023-10-01T00:00:00Z"
  //   }
  //   let eventDummyData: Event = {
  //     id: '1',
  //     title: 'Sample Event',
  //     description: 'This is a sample event description.',
  //     startDate: '2023-10-15T10:00:00Z',
  //     endDate: '2023-10-15T12:00:00Z',
  //     location: 'Online',
  //     imageUrl: 'https://via.placeholder.com/150',
  //     createdAt: "2023-10-01T00:00:00Z",
  //     updatedAt: "2023-10-01T00:00:00Z",
  //     category: 'conference',
  //   }
  //   /** 
  //    * export interface Quote {
  //      id: string;
  //      text: string;
  //      author: string;
  //      source?: string;
  //      category?: string;
  //      imageUrl?: string;
  //      featured?: boolean;
  //      createdAt: string;
  //      updatedAt: string;
  //    }
  //   */
  //   let quoteDummyData: QuoteType = {
  //     id: '1',
  //     text: 'This is a sample quote.',
  //     author: 'john doe',
  //     createdAt: '2023-10-01T00:00:00Z',
  //     updatedAt: '2023-10-01T00:00:00Z',
  //   }
  //   upcomingEvents.push(eventDummyData);
  //   featuredQuotes.push(quoteDummyData);
  //   featuredPublications.push(publicationDummyData);
  //   setFeaturedPublications(featuredPublications);
  // }, []);
  return (
    <div>
      <HeroSection />
      
      <div id="featured-content" className="bg-gray-50">
        {/* Featured Publications */}
        {featuredPublications.length > 0 && (
          <FeaturedSection
            title="Featured Publications"
            description="Discover our most popular and impactful publications"
            icon={FileText}
            viewAllLink="/publications"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPublications.map((publication) => (
                <div key={publication.id} className="relative">
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-accent-500 text-white p-2 rounded-full">
                      <Star className="h-4 w-4" />
                    </div>
                  </div>
                  <PublicationCard
                    publication={publication}
                    onView={() => {}}
                  />
                </div>
              ))}
            </div>
          </FeaturedSection>
        )}

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div className="bg-white">
            <FeaturedSection
              title="Upcoming Events"
              description="Don't miss out on our upcoming events and activities"
              icon={Calendar}
              viewAllLink="/events"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onView={() => {}}
                  />
                ))}
              </div>
            </FeaturedSection>
          </div>
        )}

        {/* Featured Quotes */}
        {featuredQuotes.length > 0 && (
          <FeaturedSection
            title="Inspiring Quotes"
            description="Words of wisdom to inspire and motivate you"
            icon={Quote}
            viewAllLink="/quotes"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredQuotes.map((quote) => (
                <div key={quote.id} className="relative">
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-accent-500 text-white p-2 rounded-full">
                      <Star className="h-4 w-4" />
                    </div>
                  </div>
                  <QuoteCard
                    quote={quote}
                    onView={() => {}}
                  />
                </div>
              ))}
            </div>
          </FeaturedSection>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-primary-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl text-primary-100 mb-8">
            Subscribe to our newsletter to get the latest updates on new publications, events, and inspiring content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <form className="flex w-full">
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
            <Button variant="accent" size="lg"  className="ml-2" type='submit'>
              Subscribe
            </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};