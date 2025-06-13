import React, { useState, useEffect } from 'react';
import ProCard from '@/components/molecules/ProCard';
import EmptyState from '@/components/atoms/EmptyState';
import Spinner from '@/components/atoms/Spinner';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import { userService } from '@/services';

const ProListingSection = () => {
  const [pros, setPros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'carpentry', label: 'Carpentry' },
    { value: 'painting', label: 'Painting' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'landscaping', label: 'Landscaping' }
  ];

  const sortOptions = [
    { value: 'rating', label: 'Highest Rated' },
    { value: 'reviews', label: 'Most Reviews' },
    { value: 'price', label: 'Price: Low to High' },
    { value: 'distance', label: 'Nearest First' }
  ];

  useEffect(() => {
    const fetchPros = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await userService.getAllPros();
        setPros(response?.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load professionals');
        console.error('Error fetching pros:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPros();
  }, []);

  const filteredPros = pros.filter(pro => {
    const matchesSearch = pro?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pro?.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || 
                           pro?.category?.toLowerCase() === selectedCategory.toLowerCase() ||
                           pro?.skills?.some(skill => skill.toLowerCase().includes(selectedCategory.toLowerCase()));
    
    return matchesSearch && matchesCategory;
  });

  const sortedPros = [...filteredPros].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b?.rating || 0) - (a?.rating || 0);
      case 'reviews':
        return (b?.reviewCount || 0) - (a?.reviewCount || 0);
      case 'price':
        return (a?.hourlyRate || 0) - (b?.hourlyRate || 0);
      case 'distance':
        return (a?.distance || 0) - (b?.distance || 0);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-lg font-medium text-gray-900">Failed to load professionals</p>
          <p className="text-gray-600 mt-1">{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Trusted Professionals</h1>
        <p className="text-gray-600">Browse and connect with skilled professionals in your area</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Professionals
            </label>
            <Input
              type="text"
              placeholder="Search by name or skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              options={categories}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={sortOptions}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Showing {sortedPros.length} of {pros.length} professionals
        </p>
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Professionals Grid */}
      {sortedPros.length === 0 ? (
        <EmptyState
          icon="Users"
          title="No professionals found"
          description={searchTerm || selectedCategory !== 'all' 
            ? "Try adjusting your search criteria or filters"
            : "No professionals are available at the moment"
          }
          action={searchTerm || selectedCategory !== 'all' ? {
            label: "Clear filters",
            onClick: () => {
              setSearchTerm('');
              setSelectedCategory('all');
            }
          } : null}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPros.map((pro) => (
            <ProCard
              key={pro?.id || Math.random()}
              pro={pro}
              onContact={() => {
                // Handle contact action
                console.log('Contact pro:', pro?.id);
              }}
              onViewProfile={() => {
                // Handle view profile action
                console.log('View profile:', pro?.id);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProListingSection;