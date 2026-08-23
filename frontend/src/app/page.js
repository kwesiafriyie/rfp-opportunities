

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WelcomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to another page after 2 seconds
    const timer = setTimeout(() => {
      router.push('/dashboard/explore-rfp'); // Replace with the target page
    }, 2000);

    // Cleanup timer
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
      {/* KPMG Logo */}
      <div className="mb-6">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/KPMG_logo.svg/512px-KPMG_logo.svg.png" 
          alt="Some Logo" 
          className="w-32 h-auto"
        />
      </div>
      
      {/* Welcome Message */}
      <h1 className="text-4xl font-bold mb-4 text-center drop-shadow-lg animate__animated animate__fadeIn">
        SImplified Opportunities Here!
      </h1>
      
      {/* Loading Message */}
      <p className="text-lg mb-6 opacity-80 animate__animated animate__fadeIn animate__delay-1s">
        We’re redirecting you to the dashboard...
      </p>
      
      {/* Optional Loading Spinner */}
      <div className="animate-spin w-10 h-10 border-4 border-t-4 border-white rounded-full mb-8"></div>
    </div>
  );
}
