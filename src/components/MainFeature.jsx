import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import { taskService } from '../services';

const MainFeature = () => {
  const [activeJobs, setActiveJobs] = useState([]);
  const [recentQuotes, setRecentQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const tasks = await taskService.getAll();
      const active = tasks.filter(task => 
        ['matched', 'inProgress'].includes(task.status)
      );
      const recent = tasks.filter(task => 
        task.status === 'posted' && task.estimatedPrice
      ).slice(0, 3);
      
      setActiveJobs(active);
      setRecentQuotes(recent);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = () => {
    navigate('/task/create');
  };

  const handleTrackJob = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  const handleBrowsePros = () => {
    navigate('/pros');
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-32 bg-surface-200 rounded-xl mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-surface-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[300px]">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-surface-900 mb-2">Something went wrong</h3>
        <p className="text-surface-600 text-center mb-4">{error}</p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={loadDashboardData}
          className="px-4 py-2 bg-primary text-white rounded-lg font-medium"
        >
          Try Again
        </motion.button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      {/* Quick Action Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary to-blue-600 rounded-xl p-6 text-white"
      >
        <h2 className="font-display font-bold text-xl mb-2">Need help with something?</h2>
        <p className="text-blue-100 mb-4">Get instant quotes from trusted professionals</p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreateTask}
          className="bg-white text-primary px-6 py-3 rounded-lg font-semibold flex items-center space-x-2"
        >
          <ApperIcon name="Plus" className="w-5 h-5" />
          <span>Get Help Now</span>
        </motion.button>
      </motion.div>

      {/* Active Jobs */}
      {activeJobs.length > 0 && (
        <div>
          <h3 className="font-display font-semibold text-lg text-surface-900 mb-4">Active Jobs</h3>
          <div className="space-y-3">
            <AnimatePresence>
              {activeJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border border-surface-200 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-surface-900 truncate">{job.category}</h4>
                      <p className="text-sm text-surface-600 truncate">{job.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          job.status === 'matched' 
                            ? 'bg-accent/10 text-accent' 
                            : 'bg-secondary/10 text-secondary'
                        }`}>
                          {job.status === 'matched' ? 'Pro Assigned' : 'In Progress'}
                        </span>
                        {job.estimatedPrice && (
                          <span className="text-sm font-semibold text-surface-900">
                            ${job.estimatedPrice}
                          </span>
                        )}
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTrackJob(job.id)}
                      className="ml-4 p-2 bg-primary text-white rounded-lg flex-shrink-0"
                    >
                      <ApperIcon name="MapPin" className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Recent Quotes */}
      {recentQuotes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-lg text-surface-900">Recent Quotes</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBrowsePros}
              className="text-primary text-sm font-medium"
            >
              Browse Pros
            </motion.button>
          </div>
          <div className="space-y-3">
            <AnimatePresence>
              {recentQuotes.map((quote, index) => (
                <motion.div
                  key={quote.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border border-surface-200 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-surface-900 truncate">{quote.category}</h4>
                      <p className="text-sm text-surface-600 truncate">{quote.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-sm text-surface-500">AI Estimate:</span>
                        <span className="font-semibold text-surface-900">${quote.estimatedPrice}</span>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                          <span className="text-xs text-secondary">95% confident</span>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleBrowsePros}
                      className="ml-4 px-4 py-2 bg-secondary text-white rounded-lg text-sm font-medium flex-shrink-0"
                    >
                      Find Pro
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleBrowsePros}
          className="bg-white border border-surface-200 rounded-lg p-4 text-left"
        >
          <ApperIcon name="Users" className="w-8 h-8 text-primary mb-3" />
          <h4 className="font-medium text-surface-900 mb-1">Browse Pros</h4>
          <p className="text-sm text-surface-600">Find verified professionals</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/messages')}
          className="bg-white border border-surface-200 rounded-lg p-4 text-left"
        >
          <ApperIcon name="MessageCircle" className="w-8 h-8 text-secondary mb-3" />
          <h4 className="font-medium text-surface-900 mb-1">Messages</h4>
          <p className="text-sm text-surface-600">Chat with your pros</p>
        </motion.button>
      </div>

      {/* Empty State */}
      {activeJobs.length === 0 && recentQuotes.length === 0 && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="Home" className="w-16 h-16 text-surface-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium text-surface-900">Ready to get started?</h3>
          <p className="mt-2 text-surface-500 mb-6">
            Post your first task and connect with trusted professionals in your area
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateTask}
            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold"
          >
            Create Your First Task
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default MainFeature;