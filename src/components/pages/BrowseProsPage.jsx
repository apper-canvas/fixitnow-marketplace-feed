import React from 'react';
import ProListingSection from '@/components/organisms/ProListingSection';

const BrowseProsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Browse Professionals</h1>
          <p className="mt-2 text-gray-600">Find skilled professionals for your projects</p>
        </div>
        <ProListingSection />
      </div>
    </div>
  );
};

export default BrowseProsPage;