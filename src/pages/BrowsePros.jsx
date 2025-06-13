import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { userService, taskService } from '../services';

const BrowsePros = () => {
  const [pros, setPros] = useState([]);
  const [filteredPros, setFilteredPros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    distance: 'all',
    rating: 'all',
    availability: 'all'
  });
  const [selectedPro, setSelectedPro] = useState(null);
  const navigate = useNavigate();

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'carpentry', label: 'Carpentry' },
    { value: 'painting', label: 'Painting' },
    { value: 'appliance', label: 'Appliance Repair' },
    { value: 'general', label: 'General Maintenance' }
  ];

  useEffect(() => {
    loadPros();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [pros, filters]);

  const loadPros = async () => {
    setLoading(true);
    setError(null);
    try {
      const allUsers = await userService.getAll();
      const professionals = allUsers.filter(user => user.type === 'pro');
      setPros(professionals);
    } catch (err) {
      setError(err.message || 'Failed to load professionals');
      toast.error('Failed to load professionals');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...pros];

    if (filters.category !== 'all') {
      filtered = filtered.filter(pro => 
        pro.skills && pro.skills.includes(filters.category)
      );
    }

    if (filters.rating !== 'all') {
      const minRating = parseFloat(filters.rating);
      filtered = filtered.filter(pro => pro.rating >= minRating);
    }

    if (filters.availability !== 'all') {
      filtered = filtered.filter(pro => 
        pro.availability === filters.availability
      );
    }

    // Sort by rating and distance
    filtered.sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return (a.distance || 0) - (b.distance || 0);
    });

    setFilteredPros(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const handleProSelect = async (pro) => {
    setSelectedPro(pro);
    // In a real app, this would create a quote request
    toast.success(`Message sent to ${pro.name}!`);
    navigate('/messages');
  };

  const handleProProfile = (proId) => {
    // Navigate to pro profile page
    navigate(`/pro/${proId}`);
  };

  if (loading) {
    return (
      <div className="min-h-full bg-surface-50 p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="animate-pulse">
            <div className="h-10 bg-surface-200 rounded-lg mb-6"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-surface-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                    <div className="h-4 bg-surface-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full bg-surface-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-900 mb-2">Something went wrong</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={loadPros}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium"
          >
            Try Again
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-surface-50">
      {/* Header */}
      <div className="bg-white border-b border-surface-200 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display font-bold text-2xl text-surface-900 mb-2">
            Find Professionals
          </h1>
          <p className="text-surface-600">
            {filteredPros.length} verified professionals available
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Filters */}
        <div className="bg-white rounded-lg p-4 mb-6 space-y-4">
          <h3 className="font-medium text-surface-900">Filters</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Rating
              </label>
              <select
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
                className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">Any Rating</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Distance
              </label>
              <select
                value={filters.distance}
                onChange={(e) => handleFilterChange('distance', e.target.value)}
                className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">Any Distance</option>
                <option value="5">Within 5 miles</option>
                <option value="10">Within 10 miles</option>
                <option value="25">Within 25 miles</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Availability
              </label>
              <select
                value={filters.availability}
                onChange={(e) => handleFilterChange('availability', e.target.value)}
                className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">Any Availability</option>
                <option value="available">Available Now</option>
                <option value="today">Available Today</option>
                <option value="thisWeek">Available This Week</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pro List */}
        {filteredPros.length === 0 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-12 bg-white rounded-lg"
          >
            <ApperIcon name="Users" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-900 mb-2">No professionals found</h3>
            <p className="text-surface-500 mb-6">
              Try adjusting your filters to see more results
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilters({ category: 'all', distance: 'all', rating: 'all', availability: 'all' })}
              className="px-4 py-2 bg-primary text-white rounded-lg font-medium"
            >
              Clear Filters
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredPros.map((pro, index) => (
                <motion.div
                  key={pro.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
                >
                  <div className="flex items-start space-x-4">
                    {/* Profile Image */}
                    <div className="relative flex-shrink-0">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                        pro.verificationStatus?.verified ? 'ring-2 ring-secondary' : ''
                      }`} style={{ backgroundColor: pro.avatarColor || '#6B7280' }}>
                        {pro.name?.charAt(0)}
                      </div>
                      {pro.verificationStatus?.verified && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                          <ApperIcon name="Check" className="w-3 h-3 text-white" />
                        </div>
                      )}
                      {pro.availability === 'available' && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full animate-pulse"></div>
                      )}
                    </div>

                    {/* Pro Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg text-surface-900 truncate">
                          {pro.name}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Star" className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-medium text-surface-900">{pro.rating}</span>
                          <span className="text-sm text-surface-500">({pro.completedJobs})</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="MapPin" className="w-4 h-4 text-surface-400" />
                          <span className="text-sm text-surface-600">
                            {pro.distance ? `${pro.distance} miles away` : 'Location available'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Clock" className="w-4 h-4 text-surface-400" />
                          <span className={`text-sm font-medium ${
                            pro.availability === 'available' ? 'text-secondary' :
                            pro.availability === 'today' ? 'text-accent' : 'text-surface-600'
                          }`}>
                            {pro.availability === 'available' ? 'Available now' :
                             pro.availability === 'today' ? 'Available today' :
                             pro.availability === 'thisWeek' ? 'Available this week' : 'Schedule available'}
                          </span>
                        </div>
                      </div>

                      {/* Skills */}
                      {pro.skills && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {pro.skills.slice(0, 4).map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="px-2 py-1 bg-surface-100 text-surface-700 text-xs rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                          {pro.skills.length > 4 && (
                            <span className="px-2 py-1 bg-surface-100 text-surface-700 text-xs rounded-full">
                              +{pro.skills.length - 4} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Bio */}
                      {pro.bio && (
                        <p className="text-sm text-surface-600 mb-4 line-clamp-2">
                          {pro.bio}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleProSelect(pro)}
                          className="flex-1 bg-primary text-white py-2 px-4 rounded-lg font-medium text-sm"
                        >
                          Send Message
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleProProfile(pro.id)}
                          className="px-4 py-2 border border-surface-300 text-surface-700 rounded-lg font-medium text-sm"
                        >
                          View Profile
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowsePros;