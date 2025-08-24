import React, { useEffect, useState } from 'react';
import { CreditCard, Building, Phone, Heart, Calendar } from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import givingService from '../../services/givingService';
import { Giving as Give } from '../../types/Giving';

const Giving: React.FC = () => {
  const [gives, setGives] = useState<Give[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await givingService.getAll();
        if (!mounted) return;
        setGives(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch Gives', err);
        if (mounted) setError('Failed to load Give data');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, []);

  const isMobileMoneyFirst = (g: Give) => {
    const first = (g.method && g.method[0]) || '';
    return String(first).toLowerCase().includes('mobile money');
  };

  if (loading) {
    return (
      <div className="min-h-[240px] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Calendar className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
              {error}
          </h3>
        </div>
    );
  }

  return (
    <div className="bg-accent-50 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Giving</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Your generous contributions help support our church ministries, community outreach,
          and the spreading of God's love. Thank you for your faithful stewardship.
        </p>
      </div>

      {/* Grid of giving items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gives.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-600">No giving methods available yet.</p>
          </div>
        ) : (
          gives.map((g) => {
            const mobileFirst = isMobileMoneyFirst(g);
            const Icon = mobileFirst ? Phone : Building;

            return (
              <div key={g.id ?? g.title} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center border">
                      {mobileFirst ? (
                        <Phone className="w-6 h-6 text-green-600" />
                      ) : (
                        <Building className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{g.title.charAt(0).toUpperCase() + g.title.slice(1)}</h3>
                      <div className="text-sm text-gray-500">
                        {g.method?.length ? `${g.method.length} method(s)` : 'No methods'}
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500">{/* reserved for actions if needed */}</div>
                </div>

                {/* Methods list */}
                {g.method && g.method.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Methods</h4>
                    <ul className="space-y-1">
                      {g.method.map((m, i) => (
                        <li key={i} className="text-sm text-gray-600">
                          • {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Bank details (render if present) */}
                {(g as any).bankName || (g as any).accountNumber ? (
                  <div className="mb-4 bg-blue-50 rounded-md p-3">
                    <h5 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                      <CreditCard className="w-4 h-4 mr-2 text-blue-600" /> Bank Transfer
                    </h5>
                    <div className="text-sm text-gray-700 space-y-1">
                      {(g as any).bankName && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bank Name:</span>
                          <span className="font-medium">{(g as any).bankName}</span>
                        </div>
                      )}
                      {(g as any).accountName && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Account Name:</span>
                          <span className="font-medium">{(g as any).accountName}</span>
                        </div>
                      )}
                      {(g as any).accountNumber && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Account Number:</span>
                          <span className="font-medium font-mono">{(g as any).accountNumber}</span>
                        </div>
                      )}
                      {(g as any).branchCode && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Branch Code:</span>
                          <span className="font-medium">{(g as any).branchCode}</span>
                        </div>
                      )}
                      {(g as any).branchName && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Branch Name:</span>
                          <span className="font-medium">{(g as any).branchName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}

                {/* Mobile money details (render if present) */}
                {(g as any).mobileMoneyName || (g as any).mobileMoneyProcess ? (
                  <div className="mb-4 bg-green-50 rounded-md p-3">
                    <h5 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-green-600" /> Mobile Money
                    </h5>
                    <div className="text-sm text-gray-700 space-y-1">
                      {(g as any).mobileMoneyName && (
                        <div>
                          <span className="text-gray-600 block">Service Name:</span>
                          <span className="font-medium">{(g as any).mobileMoneyName}</span>
                        </div>
                      )}
                      {(g as any).mobileMoneyProcess && (
                        <div>
                          <span className="text-gray-600 block">Process:</span>
                          <span className="font-medium">{(g as any).mobileMoneyProcess}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}

                {/* Short description/purpose if present */}
                {(g as any).description && (
                  <div className="text-sm text-gray-600 mt-2">
                    {(g as any).description}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Giving Purposes (static as before) */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Giving Supports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Building className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Church Operations</h3>
            <p className="text-sm text-gray-600">Supporting daily church operations and facility maintenance</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Community Outreach</h3>
            <p className="text-sm text-gray-600">Feeding programs and community service initiatives</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Mission Work</h3>
            <p className="text-sm text-gray-600">Supporting local and global mission activities</p>
          </div>
        </div>
      </div>

      {/* Scripture */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-lg p-6 text-center">
        <blockquote className="text-lg italic mb-4">
          "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."
        </blockquote>
        <p className="text-blue-100">— 2 Corinthians 9:7</p>
      </div>
    </div>
  );
};

export default Giving;
