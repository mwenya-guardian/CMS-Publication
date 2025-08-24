import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Calendar, Quote, Star, BookOpen, UserCircle } from 'lucide-react';
import { mockChurchDetails, mockPastoralTeam } from '../../data/mockData';
import { Publication } from '../../types/Publication';
import { Event } from '../../types/Event';
import { Quote as QuoteType } from '../../types/Quote';
import { publicationService } from '../../services/publicationService';
import { eventService } from '../../services/eventService';
import { quoteService } from '../../services/quoteService';
import { membersService } from '../../services/memberService';
import { PublicationCard } from '../../components/publications/PublicationCard';
import { EventCard } from '../../components/events/EventCard';
import { QuoteCard } from '../../components/quotes/QuoteCard';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
// import { bulletinService } from '../../services/bulletinService';
import { ChurchBulletin } from '../../types/ChurchBulletin';
import { BulletinCard } from '../../components/bulletin/BulletinCard';
import sdalogo from "../../assets/icons/sdalogobluewhite.jpg";
import { preloadImage } from '../../utils/imageCache';
import { Member } from '../../types/Members';
import { Modal } from '../../components/common/Modal';
import { newsletterService } from '../../services/newsletterService';
import { NewsletterSubscriberCard } from '../../components/newsletterSubscriber/NewsletterSubscriberCard';

const HERO_ROTATE_INTERVAL_MS = 5500;

export const Home: React.FC = () => {
  const [featuredPublications, setFeaturedPublications] = useState<Publication[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [featuredQuotes, setFeaturedQuotes] = useState<QuoteType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [latestBulletins, setLatestBulletins] = useState<ChurchBulletin[]>([]);
  const [pastoralTeam, setPastoralTeam] = useState<Member[]>([]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [subscribe, setSubscribe] = useState(false);
  const [email, setEmail] = useState('');
  const rotateRef = useRef<number | null>(null);
  const fetchedRef = useRef(false);

  const blobUrlsRef = useRef<string[]>([]);

  // slides use only string literals already present in the original file or values from mockChurchDetails
  const slides = [
    {
      id: 'slide-1',
      title: "University Seventh-Day Adventist Church",
      subtitle: "Welcome to our worship schedule service",
      description: "We would love to share the word with you.",
      image: sdalogo,
      ctaLabel: 'Register',
      ctaLink: '/register', 
    },
    {
      id: 'slide-2',
      title: 'Welcome',
      subtitle: '',
      description:
        'Welcome to University Seventh-day Adventist Church.' +
        'We invoke rich blessings upon you from our Father in heaven.' +
        'Special thanks and welcome go to all Visitors joining us in' +
        'Worship this Sabbath. Please be at home as we fellowship' + 
        'together and do come again. Please note that our services' +
        'are carried live on Facebook and YouTube.',
      image: sdalogo,
      ctaLabel: 'Register',
      ctaLink: '/register',
    },
    {
      id: 'slide-3',
      title: 'Our Mission',
      subtitle: '',
      description:
        'Our Mission is the Proclamation of the Everlasting Gospel of ' +
        'Jesus Christ in and around our territorial neighborhood. through Evangelism, ' +
        'Nurture and Stewardship. May God less you as we worship together in Spirit and Truth!',
      image: sdalogo,
      ctaLabel: 'Register',
      ctaLink: '/register',
    },
  ];

  const handleSubscribe = (userEmail: string)=>{
    if(userEmail.length > 0){
      newsletterService.subscribe({ email: userEmail });
      setSubscribe(true);
    }
  }


  console.log('Home render - currentSlide');

  useEffect(() => {
    let mounted = true;


    console.log('fetchFeaturedContent effect: mount');
    
    const fetchFeaturedContent = async () => {
      try {

        setIsLoading(true);

        const [publications, events, quotes, pastoral] = await Promise.all([
          publicationService.getPaginated(1, 3, { featured: true }),
          eventService.getPaginated(1, 3),
          quoteService.getPaginated(1, 3, { featured: true }),
          membersService.getByPositionType('Pastor'),
        ]);

        if (!mounted) return;
        // Preload publication images and convert to blob URLs
        const publicationsWithBlobs = await Promise.all(
          publications.data.map(async (pub: Publication) => {
            // pub.layoutType = "list"
            const { blobUrl } = await preloadImage(pub.imageUrl, pub.id);
              if(blobUrl){ 
                blobUrlsRef.current.push(blobUrl);
                  return {  
                    ...pub,
                    imageUrl: blobUrl
                  };
              } else {
                return pub;
              }
          })
        );

        const eventsWithBlobs = await Promise.all(
          events.data.map(async (event: Event) => {
            const { blobUrl } = await preloadImage(event.imageUrl, event.id);
              if(blobUrl){ 
                blobUrlsRef.current.push(blobUrl);
                  return {  
                    ...event,
                    imageUrl: blobUrl
                  };
              } else {
                return event;
              }
        })
        );

        const quotesWithBlobs = await Promise.all(
          quotes.data.map(async (quote: QuoteType) => {
            const { blobUrl } = await preloadImage(quote.imageUrl, quote.id);
              if(blobUrl){ 
                blobUrlsRef.current.push(blobUrl);
                  return {  
                    ...quote,
                    imageUrl: blobUrl
                  };
              } else {
                return quote;
              }
          })
        );

        setFeaturedPublications(publicationsWithBlobs);
 
        setUpcomingEvents(eventsWithBlobs);

        setFeaturedQuotes(quotesWithBlobs);

        setPastoralTeam(pastoral);

        setSubscribe(false);
        setEmail('');

        // latestBulletins left empty unless bulletinService is enabled (keeps parity with original)
      } catch (error) {
        console.error('Failed to fetch featured content:', error);
      } finally {
        fetchedRef.current = true;
        if (mounted) setIsLoading(false);
      }
    };

    
    fetchFeaturedContent();

    return () => {
      mounted = false;
      // revoke created blob URLs to avoid leaking memory
      blobUrlsRef.current.forEach((u) => {
        try { 
          URL.revokeObjectURL(u); } catch (e) { /* ignore */ }
        });
        blobUrlsRef.current = [];

      if (rotateRef.current) {
        clearInterval(rotateRef.current);
      }
    };
  }, []);

  // auto-rotate hero, pause-on-hover
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    rotateRef.current = window.setInterval(() => {
      setCurrentSlide(s => (s + 1) % slides.length);
    }, HERO_ROTATE_INTERVAL_MS);

    return () => {
      if (rotateRef.current) {
        clearInterval(rotateRef.current);
        rotateRef.current = null;
      }
    };
  }, [isPaused]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // fixed hero height so it won't resize with content or image
  const HeroSection = () => (
    <div className="relative shadow-md">
      <section
        className="w-full rounded-lg overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="bg-gradient-to-r from-white to-accent-50"  >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center" style={{ minHeight: '520px' }}>
              {/* Left column - large headline */}
              <div className="lg:col-span-7 py-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow">
                    <img src={sdalogo} alt="SDA Logo" className="w-10 h-10 object-cover" />
                  </div>
                  <div className="text-sm text-gray-600">Katima Mulilo Road, Lusaka</div>
                </div>

                <h1 className="text-6xl leading-tight font-extrabold tracking-tight text-gray-600 mb-4">
                  {slides[currentSlide].title}
                </h1>

                {slides[currentSlide].subtitle ? (
                  <p className="text-3xl text-secondary-500 font-semibold mb-4">{slides[currentSlide].subtitle}</p>
                ) : null}

                <p className="text-lg text-gray-600 mb-6 max-w-prose">{slides[currentSlide].description}</p>

                <div className="flex items-center gap-4">
                  <a href="#newsletter-signup">
                    <Button variant="ghost" size="lg">
                      {slides[currentSlide].ctaLabel}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                  <Link to="/about">
                    <Button variant="ghost" size="lg">
                      Contact Us
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  {/* <Link to="/contact" className="text-sm text-gray-700 hover:underline flex items-center">
                    Contact Us
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link> */}
                </div>

                {/* indicators (dots) - uses only existing UI strings in aria-labels */}
                <div className="flex items-center gap-3 mt-8" role="tablist" aria-label="Hero slides">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      aria-label={idx === 0 ? 'Welcome Message' : idx === 1 ? 'Welcome Message' : 'Our Mission'}
                      className={`rounded-full transition-all ${currentSlide === idx ? 'w-8 h-3 bg-green-600' : 'w-3 h-3 bg-gray-300'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Right column - illustration area fixed so it won't affect layout */}
              {/* <div className="lg:col-span-5 flex items-center justify-center py-12">
                <div className="w-80 h-80 bg-white rounded-lg flex items-center justify-center shadow-md overflow-hidden">
                  <img src={slides[currentSlide].image} alt="" className="max-w-full max-h-full object-contain" />
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const FeaturedSection: React.FC<{
    title: string;
    description: string;
    icon: React.ElementType;
    viewAllLink: string;
    children: React.ReactNode;
  }> = ({ title, description, icon: Icon, viewAllLink, children }) => (
    <div className="bg-gradient-to-r from-white to-primary-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-50 rounded-full">
              <Icon className="h-8 w-8 text-secondary-500" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{description}</p>
        </div>

        {children}

        <div className="text-center mt-8">
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

  return (
    <div className="bg-accent-50 p-4">
      <HeroSection />

      {/* clients / partners row aligned under hero */}
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-lg shadow-sm py-6 px-6 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 text-bold">Pastoral Team</h2>
            <p className="text-sm text-gray-500">We are proud of how hard working pastoral team</p>
          </div>
          <div className="flex items-center gap-6 overflow-x-auto py-2">
            <img src={sdalogo} alt="client" className="h-10 object-contain" />
            {/* <div className="h-10 w-24 bg-gray-100 rounded-md flex items-center justify-center text-sm text-gray-600">Logo</div> */}
          </div>
        </div>
      </div>

      {/* stats strip */}
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
            {
              pastoralTeam.map((member) => (
                <div key={member.id} className="bg-white rounded-lg p-3 flex flex-col items-center gap-2 shadow-sm">
                  <div className="w-full md:w-48">
                  {member.photoUrl ? <img src={member.photoUrl} alt={member.firstname} className="w-40 h-40 rounded-full mx-auto" /> : 
                  <div className="w-40 h-40 rounded-full bg-gray-50 flex items-center justify-center text-7xl font-semibold text-gray-600" > 
                    {member.firstname?.charAt(0).toUpperCase() ?? 'U'}
                  </div>}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 mx-auto">{member.firstname.toUpperCase()} {member.lastname.toUpperCase()}</div>
                    <div className="text-sm text-gray-500 mx-auto">{member.position.toUpperCase()}</div>
                    <div className="text-sm text-gray-500 mx-auto">{member.positionType.toUpperCase()}</div>
                  </div>
                </div>
              ))
            }
        </div>
      </div>

      <div id="featured-content" className="bg-gray-50 mt-8 py-10">
        {/* Featured Publications */}
        {featuredPublications.length > 0 && (
          <FeaturedSection
            title="Featured Publications"
            description="Discover our most popular and impactful publications"
            icon={FileText}
            viewAllLink="/publications"
          >
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-8">
              {featuredPublications.map((publication) => (
                <div key={publication.id} className="relative">
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-green-600 text-white p-2 rounded-full">
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
          <FeaturedSection
            title="Upcoming Events"
            description="Don't miss out on our upcoming events and activities"
            icon={Calendar}
            viewAllLink="/events"
          >
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-8">
              {upcomingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onView={() => {}}
                />
              ))}
            </div>
          </FeaturedSection>
        )}

        {/* Featured Quotes */}
        {featuredQuotes.length > 0 && (
          <FeaturedSection
            title="Inspiring Quotes"
            description="Words of wisdom to inspire and motivate you"
            icon={Quote}
            viewAllLink="/quotes"
          >
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-8">
              {featuredQuotes.map((quote) => (
                <div key={quote.id} className="relative">
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-green-600 text-white p-2 rounded-full">
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
          <FeaturedSection
            title="Latest Church Bulletins"
            description="Stay updated with our weekly church bulletins and worship schedules"
            icon={BookOpen}
            viewAllLink="/bulletins"
          >
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-8">
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
        )}
      </div>

      {/* Newsletter Signup */}
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-gradient-to-r from-secondary-600 to-secondary-400 text-white rounded-lg p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">Stay Connected</h2>
            <p className="text-green-100 mb-4 max-w-xl">
              Subscribe to our newsletter to receive updates about events, announcements, and church news.
            </p>
            <form id='newsletter-signup' onSubmit={(e) => { e.preventDefault(); handleSubscribe(email); }} className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Enter your email address"
                placeholder="Enter your email address"
                className="px-4 py-2 rounded-md text-gray-800 w-full max-w-md"
                required
              />
              <Button type='submit' variant='outline'  className="bg-white text-secondary-600 px-4 py-2 rounded-md font-medium">
                Subscribe
              </Button>
            </form>
          </div>
          <NewsletterSubscriberCard
            email={email}
            setEmail={setEmail}
            subscribe={subscribe}
            setSubscribe={setSubscribe}
          />
        </div>
      </div>

      <div className="h-8" />
    </div>
  );
};
