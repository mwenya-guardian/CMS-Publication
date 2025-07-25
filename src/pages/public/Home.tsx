import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Calendar, Quote, Star, BookOpen, MapPin, Phone, Mail, Globe  } from 'lucide-react';
import { mockChurchDetails, mockPastoralTeam } from '../../data/mockData';
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
// import { bulletinService } from '../../services/bulletinService';
import { ChurchBulletin } from '../../types/ChurchBulletin';
import { BulletinCard } from '../../components/bulletin/BulletinCard';
import sdalogo from "../../assets/icons/sdalogobluewhite.jpg";

export const Home: React.FC = () => {
  const [featuredPublications, setFeaturedPublications] = useState<Publication[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [featuredQuotes, setFeaturedQuotes] = useState<QuoteType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [latestBulletins, setLatestBulletins] = useState<ChurchBulletin[]>([]);

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
    // let featuredPublications: Publication[] = [];
    // let upcomingEvents: Event[] = [];
    // let featuredQuotes: QuoteType[] = [];
    // let publicationDummyData: Publication = {
    //   id: '1',
    //   title: 'Sample Publication',
    //   content: 'This is a sample publication content. More details can be found in the full article.',
    //   // imageUrl: 'https://via.placeholder.com/150',
    //   date: '2023-10-01',
    //   layoutType: 'grid',
    //   author: "mutende the name", //?
    //   tags: ["mwenya", "guardian"], //?
    //   featured: true, //?
    //   createdAt: "2023-10-01T00:00:00Z",
    //   updatedAt: "2023-10-01T00:00:00Z"
    // }
    // let eventDummyData: Event = {
    //   id: '1',
    //   title: 'Sample Event',
    //   description: 'This is a sample event description. More details can be found in the event page. The event will cover various topics and feature guest speakers.',
    //   startDate: '2023-10-15T10:00:00Z',
    //   endDate: '2023-10-15T12:00:00Z',
    //   location: 'University Church',
    //   // imageUrl: 'https://via.placeholder.com/150',
    //   createdAt: "2023-10-01T00:00:00Z",
    //   updatedAt: "2023-10-01T00:00:00Z",
    //   category: 'CONFERENCE',
    // }
    // /** 
    //  * export interface Quote {
    //    id: string;
    //    text: string;
    //    author: string;
    //    source?: string;
    //    category?: string;
    //    imageUrl?: string;
    //    featured?: boolean;
    //    createdAt: string;
    //    updatedAt: string;
    //  }
    // */
    // let quoteDummyData: QuoteType = {
    //   id: '1',
    //   text: 'This is a sample quote. More inspirational quotes can be found in the quotes section. The quote aims to inspire and motivate readers.',
    //   author: 'john doe',
    //   createdAt: '2023-10-01T00:00:00Z',
    //   updatedAt: '2023-10-01T00:00:00Z',
    // }
    // upcomingEvents.push(eventDummyData);
    // featuredQuotes.push(quoteDummyData);
    // featuredPublications.push(publicationDummyData);
    //     upcomingEvents.push(eventDummyData);
    // featuredQuotes.push(quoteDummyData);
    // featuredPublications.push(publicationDummyData);
    //     upcomingEvents.push(eventDummyData);
    // featuredQuotes.push(quoteDummyData);
    // featuredPublications.push(publicationDummyData);
    // //     upcomingEvents.push(eventDummyData);
    // // featuredQuotes.push(quoteDummyData);
    // // featuredPublications.push(publicationDummyData);
    // setFeaturedPublications(featuredPublications);
    // setUpcomingEvents(upcomingEvents);
    // setFeaturedQuotes(featuredQuotes);
  }, []);

  const HeroSection = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-600 text-white rounded-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
              {/* <img src={sdalogo} alt="SDA Logo" className="w-10 h-10 mb-4" /> */}
            </div>
          </div>
        <h1 className="text-4xl font-bold mb-4">{mockChurchDetails.name}</h1>
        <div className="flex items-center justify-center space-x-2 mb-4">
          <MapPin className="w-5 h-5" />
          <span className="text-blue-100">{mockChurchDetails.address}</span>
        </div>
        <p className="text-xl mb-4">{mockChurchDetails.greeting}</p>
        <p className="text-blue-100">{mockChurchDetails.message}</p>
      </div>

      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome Message</h2>
        <div className="prose max-w-none">
          <p className="text-gray-700 mb-4">
            Welcome to our church family! We are delighted to have you join us in worship and fellowship. 
            Our church is a place where all are welcome to experience God's love, grow in faith, and serve our community.
          </p>
          <p className="text-gray-700 mb-4">
            Whether you're a longtime member or visiting for the first time, we invite you to participate 
            in our various ministries and activities designed to strengthen your spiritual journey.
          </p>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="bg-blue-100 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
        <p className="text-gray-700 text-lg">
          To make disciples of Jesus Christ for the transformation of the world through worship, 
          fellowship, spiritual growth, and service to others in our community and beyond.
        </p>
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
    <div className="py-5 rounded-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-5">
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
    <div className='p-2'>
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

      {/* Latest Bulletins */}
        {latestBulletins.length > 0 && (
          <div className="bg-white">
            <FeaturedSection
              title="Latest Church Bulletins"
              description="Stay updated with our weekly church bulletins and worship schedules"
              icon={BookOpen}
              viewAllLink="/bulletins"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {latestBulletins.map((bulletin) => (
                  <BulletinCard
                    key={bulletin.id}
                    bulletin={bulletin}
                    onView={() => {}}
                    onDownloadPdf={() => {}}
                  />
                ))}
              </div>
            </FeaturedSection>
          </div>
        )}
      </div>
  
        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-700 text-white rounded-lg p-6 mt-5">
        <h2 className="text-2xl font-bold mb-4">Stay Connected</h2>
        <p className="text-blue-100 mb-6">
          Subscribe to our newsletter to receive updates about events, announcements, and church news.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-1 px-4 py-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button className="bg-blue-800 hover:bg-blue-600 px-6 py-2 rounded-md font-medium transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
};