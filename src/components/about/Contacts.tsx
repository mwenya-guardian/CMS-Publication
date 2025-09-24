import React, { useEffect, useState } from 'react';
// import { mockContacts, mockPrayerLines } from '../../data/mockData';
import { Phone, Mail, Users, Heart, Link2 } from 'lucide-react';
import { newsletterService } from '../../services/newsletterService';
import { NewsletterSubscriberCard } from '../newsletterSubscriber/NewsletterSubscriberCard';
import { Button } from '../common/Button';
import { membersService } from '../../services/memberService';
import { churchDetailsService } from '../../services/churchDetailsService';
import { Member } from '../../types/Members';
import { ChurchDetails } from '../../types/ChurchDetails';


const Contacts: React.FC = () => {
    const [subscribe, setSubscribe] = useState(false);
    const [email, setEmail] = useState('');
    const [pastoral, setPastoral] = useState<Member[]>([]);
    const [departmental, setDepartmental] = useState<Member[]>([]);
    const [elders, setElders] = useState<Member[]>([]);
    const [churchDetails, setChurchDetails] = useState<ChurchDetails | null>(null);

    const handleSubscribe = (userEmail: string) => {
        if (userEmail.length > 0) {
          newsletterService.subscribe({ email: userEmail });
          setSubscribe(true);
        }
      };
    useEffect(() => {
        const fetchData = async () => {
            const [pastoralData, departmentalData, eldersData, churchDetailsData] = await Promise.all([
                membersService.getByPositionType('Pastor'),
                membersService.getByPositionType('Department'),
                membersService.getByPositionType('Elder'),
                churchDetailsService.getAll(),
            ]);

            setPastoral(pastoralData);
            setDepartmental(departmentalData);
            setElders(eldersData);
            setChurchDetails(churchDetailsData.length > 0 ? churchDetailsData[0] : null);
        };
        fetchData();

        setEmail('');
        setSubscribe(false);
    }, []);
  return (
    <div className="bg-accent-50 space-y-5">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Church Contacts</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get in touch with our church leadership and departments. We're here to serve you and answer any questions you may have.
        </p>
      </div>

      {/* Church Leadership */}
      {pastoral.length > 0 &&  <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Users className="w-6 h-6 mr-2 text-blue-600" />
            Pastoral
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastoral.map((contact) => (
            <div key={contact.id} className="bg-gray-50 rounded-lg p-4">
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  {contact.firstname.charAt(0).toUpperCase() + contact.firstname.slice(1) + " " + contact.lastname.charAt(0).toUpperCase() + contact.lastname.slice(1)}
                  </h3>
                <p className="text-blue-600 font-medium">{contact.position.charAt(0).toUpperCase() + contact.position.slice(1).toLowerCase()}</p>
                <p className="text-gray-600 text-sm">{contact.positionType.charAt(0).toUpperCase() + contact.positionType.slice(1).toLowerCase()}</p>
              </div>
              <div className="space-y-2">
                  <div key={contact.id} className="flex items-center text-sm">
                        <Mail className="w-4 h-4 mr-2 text-gray-500" />
                        <a href={`mailto:${contact.email}`} className="text-blue-600 hover:text-blue-800">
                          {contact.email}
                        </a>
                  </div>
                  <div key={contact.id} className="flex items-center text-sm">
                        <Phone className="w-4 h-4 mr-2 text-gray-500" />
                        <a href={`tel:${contact?.phone}`} className="text-blue-600 hover:text-blue-800">
                          {contact?.phone}
                        </a>
                  </div>
              </div>
            </div>
          ))}
        </div>
      </div>}

        {/* Church Leadership */}
      {departmental.length > 0 &&  <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Users className="w-6 h-6 mr-2 text-blue-600" />
            Departments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departmental.map((contact) => (
            <div key={contact.id} className="bg-gray-50 rounded-lg p-4">
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  {contact.firstname.charAt(0).toUpperCase() + contact.firstname.slice(1) + " " + contact.lastname.charAt(0).toUpperCase() + contact.lastname.slice(1)}
                  </h3>
                <p className="text-blue-600 font-medium">{contact.position.charAt(0).toUpperCase() + contact.position.slice(1).toLowerCase()}</p>
                <p className="text-gray-600 text-sm">{contact.positionType.charAt(0).toUpperCase() + contact.positionType.slice(1).toLowerCase()}</p>
              </div>
              <div className="space-y-2">
                  <div key={contact.id} className="flex items-center text-sm">
                        <Mail className="w-4 h-4 mr-2 text-gray-500" />
                        <a href={`mailto:${contact.email}`} className="text-blue-600 hover:text-blue-800">
                          {contact.email}
                        </a>
                  </div>
                  <div key={contact.id} className="flex items-center text-sm">
                        <Phone className="w-4 h-4 mr-2 text-gray-500" />
                        <a href={`tel:${contact?.phone}`} className="text-blue-600 hover:text-blue-800">
                          {contact?.phone}
                        </a>
                  </div>
              </div>
            </div>
          ))}
        </div>
      </div>}

      {/* Church Leadership */}
      {elders.length > 0 &&  <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Users className="w-6 h-6 mr-2 text-blue-600" />
            Elders
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {elders.map((contact) => (
            <div key={contact.id} className="bg-gray-50 rounded-lg p-4">
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  {contact.firstname.charAt(0).toUpperCase() + contact.firstname.slice(1) + " " + contact.lastname.charAt(0).toUpperCase() + contact.lastname.slice(1)}
                  </h3>
                <p className="text-blue-600 font-medium">{contact.position.charAt(0).toUpperCase() + contact.position.slice(1).toLowerCase()}</p>
                <p className="text-gray-600 text-sm">{contact.positionType.charAt(0).toUpperCase() + contact.positionType.slice(1).toLowerCase()}</p>
              </div>
              <div className="space-y-2">
                  <div key={contact.id} className="flex items-center text-sm">
                        <Mail className="w-4 h-4 mr-2 text-gray-500" />
                        <a href={`mailto:${contact.email}`} className="text-blue-600 hover:text-blue-800">
                          {contact.email}
                        </a>
                  </div>
                  <div key={contact.id} className="flex items-center text-sm">
                        <Phone className="w-4 h-4 mr-2 text-gray-500" />
                        <a href={`tel:${contact?.phone}`} className="text-blue-600 hover:text-blue-800">
                          {contact?.phone}
                        </a>
                  </div>
              </div>
            </div>
          ))}
        </div>
      </div>}


      {/* Prayer Lines */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Heart className="w-6 h-6 mr-2 text-red-600" />
          Prayer Lines
        </h2>
        <div className="bg-red-50 rounded-lg p-6">
          <p className="text-gray-700 mb-4">
            Need prayer? Our prayer team is available to pray with you and for you. 
            Don't hesitate to reach out during times of need, celebration, or when you simply need spiritual support.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center bg-white rounded-lg p-4">
                <Phone className="w-5 h-5 mr-3 text-red-600" />
                <a 
                  href={`tel: +260954542182`} 
                  className="text-lg font-medium text-red-600 hover:text-red-800"
                >
                  +260954542182 or +26079442225
                </a>
              </div>
              <div className="flex items-center bg-white rounded-lg p-4">
                <Mail className="w-5 h-5 mr-3 text-red-600" />
                <a 
                  href={`mailto: prayerband@universitysdachurch.org`} 
                  className="text-lg font-medium text-red-600 hover:text-red-800"
                >
                  prayerband@universitysdachurch.org
                </a>
              </div>
          </div>
        </div>
      </div>

      {/* Church Details */}
      <div className="bg-gradient-to-b from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-yellow-800 mb-4">{churchDetails?.name}</h2>
        <p className="text-yellow-700 mb-4">
          P.O.Box {churchDetails?.poBox},  {churchDetails?.address}, {churchDetails?.city}, {churchDetails?.province}, {churchDetails?.country}.
        </p>
        <div className="space-y-2">
          <div className="flex items-center">
            <Phone className="w-4 h-4 mr-2 text-yellow-600" />
            <span className="font-medium text-yellow-800">Tel: </span>
            <a href={`tel:${churchDetails?.tel}`} className="text-yellow-700 hover:text-yellow-900 ml-2">
              {churchDetails?.tel} 
            </a>
            <span> {" | "} </span>
            <span className="font-medium text-yellow-800">Cell: </span>
            <a className="text-yellow-700 hover:text-yellow-900 ml-2">
              {churchDetails?.cell.join(", ")}            
            </a>
          </div>
          <div className="flex items-center">
            <Mail className="w-4 h-4 mr-2 text-yellow-600" />
            <span className="font-medium text-yellow-800">Email: </span>
            <a href={`mailto:${churchDetails?.email}`} className="text-yellow-700 hover:text-yellow-900 ml-2">
              {churchDetails?.email}
            </a>
          </div>
          <div className="flex items-center">
            <Link2 className="w-4 h-4 mr-2 text-yellow-600" />
            <span className="font-medium text-yellow-800">URL: </span>
            <a href={`mailto:${churchDetails?.website}`} className="text-yellow-700 hover:text-yellow-900 ml-2">
              {churchDetails?.website}
            </a>
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-t from-primary-700 to-primary-400 text-white rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Stay Connected</h2>
        <p className="text-blue-100 mb-6">
          Subscribe to our newsletter to receive updates about events, announcements, and church news.
        </p>
        <form onSubmit={(e) => { e.preventDefault(); handleSubscribe(email); }} className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 px-4 py-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
          <Button type='submit' className="bg-blue-800 hover:bg-blue-600 px-6 py-2 rounded-md font-medium transition-colors">
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
  );
};

export default Contacts;