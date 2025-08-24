import React, { useEffect, useState } from 'react';
import { newsletterService } from '../../services/newsletterService';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { CalendarCheck } from 'lucide-react';

interface NewsletterSubscriberCardProps {
  email: string;
  setEmail: (email: string) => void;
  subscribe: boolean;
  setSubscribe: (subscribe: boolean) => void;
  className?: string;
}
export const handleSubscribe = (userEmail: string, setSubscribe: Function)=>{
      if(userEmail.length > 0){
        newsletterService.subscribe({ email: userEmail });
        setSubscribe(true);
      }
    }
export const NewsletterSubscriberCard: React.FC<NewsletterSubscriberCardProps> = ({
  email,
  setEmail,
  subscribe,
  setSubscribe,
  className = '',
})=>{
    // const [subscribe, setSubscribe] = useState(false);
    // const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      setVerificationCode('');
      setIsVerified(false);
      setError(null);
      
    }, [subscribe]);

    const handleVerify = (userEmail: string, code: string)=>{
      newsletterService.verify(code, userEmail ).then((data)=>{
        console.log('Verification successful:', data);
        setIsVerified(data);
        if(data){
          setVerificationCode('');
          setEmail('');
          // Set the timer using setTimeout
          const timerId = setTimeout(()=>setSubscribe(!data), 4000);
          setError(null);
          return () => {
            // Clear the timer when the component unmounts
            clearTimeout(timerId);
          }
        } else {
          setVerificationCode('');
          setError('Invalid verification code. Please try again.');
        }
      }).catch((error) => {
        console.error('Verification failed:', error);
      });
    }
  return (
          <Modal
            isOpen={subscribe}
            onClose={()=>setSubscribe(false)}
            title="Subscription Verification"
            className={className}
          >
            {isVerified ? (
                <div className='flex flex-col items-center my-2 p-2'>
                <CalendarCheck className="flex justify-center text-green-500 w-10 h-10" />
                <p className="text-green-500 my-6 p-2">Subscription verified! Thank you for subscribing.</p>
                </div>
              ) : (
            <div>
              <input
                type="email"
                value={email}
                aria-label="Enter your email address"
                placeholder="Enter your email address"
                className="my-3 px-4 py-2 rounded-md text-gray-800 w-full max-w-md"
                disabled
              />
              <input
                type="number"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                aria-label="Enter your verification code"
                placeholder="Enter your verification code from your email e.g 123456"
                className={"my-3 px-4 py-2 rounded-md text-gray-800 w-full max-w-md" + (error ? " border border-red-500" : "")}
              />
              {error && <p className="bg-accent-50 text-red-500 text-sm my-4 p-2">{error}</p>}

                <Button variant='outline' onClick={() => handleVerify(email, verificationCode)} className="bg-white text-secondary-600 px-4 py-2 rounded-md font-medium">
                  Verify
                </Button>
              
            </div>
            )}
          </Modal>
  )
};