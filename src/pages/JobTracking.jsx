import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { taskService, userService } from '../services';

const JobTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [pro, setPro] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [liveLocation, setLiveLocation] = useState(null);

  const statusSteps = [
    { key: 'accepted', label: 'Job Accepted', icon: 'Check', color: 'text-secondary' },
    { key: 'enRoute', label: 'En Route', icon: 'Car', color: 'text-accent' },
    { key: 'onSite', label: 'On Site', icon: 'MapPin', color: 'text-primary' },
    { key: 'working', label: 'Working', icon: 'Wrench', color: 'text-primary' },
    { key: 'completed', label: 'Completed', icon: 'CheckCircle', color: 'text-secondary' }
  ];

  useEffect(() => {
    if (id) {
      loadJobDetails();
      // Simulate live location updates
      const interval = setInterval(updateLiveLocation, 5000);
      return () => clearInterval(interval);
    }
  }, [id]);

  const loadJobDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const tasks = await taskService.getAll();
      const currentJob = tasks.find(task => task.id === id);
      
      if (!currentJob) {
        setError('Job not found');
        return;
      }

      setJob(currentJob);

      if (currentJob.proId) {
        const users = await userService.getAll();
        const jobPro = users.find(user => user.id === currentJob.proId);
        setPro(jobPro);
      }
    } catch (err) {
      setError(err.message || 'Failed to load job details');
      toast.error('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const updateLiveLocation = () => {
    // Simulate live location updates
    if (job?.status === 'enRoute' || job?.status === 'onSite') {
      setLiveLocation({
        lat: 40.7128 + (Math.random() - 0.5) * 0.01,
        lng: -74.0060 + (Math.random() - 0.5) * 0.01,
        lastUpdated: new Date()
      });
    }
  };

  const handleContactPro = () => {
    navigate('/messages');
  };

  const handleCompleteJob = async () => {
    try {
      await taskService.update(job.id, { status: 'completed' });
      setJob(prev => ({ ...prev, status: 'completed' }));
      toast.success('Job marked as completed!');
    } catch (error) {
      toast.error('Failed to update job status');
    }
  };

  const getCurrentStepIndex = () => {
    return statusSteps.findIndex(step => step.key === job?.status);
  };

  const getEstimatedArrival = () => {
    if (!job || job.status !== 'enRoute') return null;
    // Simulate ETA calculation
    const eta = new Date();
    eta.setMinutes(eta.getMinutes() + Math.floor(Math.random() * 30) + 10);
    return eta;
  };

  if (loading) {
    return (
      <div className="min-h-full bg-surface-50 p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="animate-pulse">
            <div className="h-8 bg-surface-200 rounded-lg mb-6"></div>
            <div className="bg-white rounded-lg p-6 mb-4">
              <div className="h-32 bg-surface-200 rounded-lg mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                <div className="h-4 bg-surface-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-full bg-surface-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-900 mb-2">Job not found</h3>
          <p className="text-surface-600 mb-4">{error || 'This job does not exist or has been removed'}</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium"
          >
            Back to Home
          </motion.button>
        </div>
      </div>
    );
  }

  const eta = getEstimatedArrival();
  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="min-h-full bg-surface-50">
      {/* Header */}
      <div className="bg-white border-b border-surface-200 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center">
          <button
            onClick={() => navigate('/')}
            className="mr-4 p-2 rounded-lg hover:bg-surface-100 transition-colors"
          >
            <ApperIcon name="ArrowLeft" className="w-5 h-5 text-surface-600" />
          </button>
          <div>
            <h1 className="font-display font-bold text-xl text-surface-900">Job Tracking</h1>
            <p className="text-sm text-surface-600">Real-time updates</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Map Placeholder */}
        <div className="bg-white rounded-lg p-6">
          <div className="bg-surface-100 rounded-lg h-48 flex items-center justify-center mb-4">
            <div className="text-center">
              <ApperIcon name="Map" className="w-12 h-12 text-surface-400 mx-auto mb-2" />
              <p className="text-surface-600">Live tracking map</p>
              {liveLocation && (
                <p className="text-xs text-surface-500 mt-1">
                  Last updated: {liveLocation.lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
          
          {eta && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-accent/10 border border-accent/20 rounded-lg p-4"
            >
              <div className="flex items-center space-x-2">
                <ApperIcon name="Clock" className="w-5 h-5 text-accent" />
                <span className="font-medium text-accent">
                  Estimated arrival: {eta.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Job Status Timeline */}
        <div className="bg-white rounded-lg p-6">
          <h3 className="font-semibold text-lg text-surface-900 mb-4">Job Progress</h3>
          
          <div className="space-y-4">
            {statusSteps.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              
              return (
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-4"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted 
                      ? 'bg-secondary text-white' 
                      : 'bg-surface-100 text-surface-400'
                  } ${isCurrent ? 'ring-4 ring-secondary/20' : ''}`}>
                    <ApperIcon 
                      name={step.icon} 
                      className={`w-5 h-5 ${isCurrent ? 'animate-pulse' : ''}`} 
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${
                        isCompleted ? 'text-surface-900' : 'text-surface-500'
                      }`}>
                        {step.label}
                      </span>
                      {isCurrent && (
                        <span className="text-sm text-secondary font-medium">Current</span>
                      )}
                      {isCompleted && !isCurrent && (
                        <ApperIcon name="Check" className="w-4 h-4 text-secondary" />
                      )}
                    </div>
                    {isCurrent && job.status === 'working' && (
                      <p className="text-sm text-surface-600 mt-1">
                        Professional is working on your task
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Pro Info */}
        {pro && (
          <div className="bg-white rounded-lg p-6">
            <h3 className="font-semibold text-lg text-surface-900 mb-4">Your Professional</h3>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                   style={{ backgroundColor: pro.avatarColor || '#6B7280' }}>
                {pro.name?.charAt(0)}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-surface-900">{pro.name}</h4>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Star" className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{pro.rating}</span>
                  </div>
                  <span className="text-sm text-surface-500">•</span>
                  <span className="text-sm text-surface-600">{pro.completedJobs} jobs</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContactPro}
                className="flex-1 bg-primary text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center space-x-2"
              >
                <ApperIcon name="MessageCircle" className="w-4 h-4" />
                <span>Message</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 border border-surface-300 text-surface-700 rounded-lg font-medium"
              >
                <ApperIcon name="Phone" className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        )}

        {/* Job Details */}
        <div className="bg-white rounded-lg p-6">
          <h3 className="font-semibold text-lg text-surface-900 mb-4">Job Details</h3>
          
          <div className="space-y-3">
            <div>
              <span className="text-sm text-surface-600">Category:</span>
              <p className="font-medium text-surface-900 capitalize">{job.category}</p>
            </div>
            
            <div>
              <span className="text-sm text-surface-600">Description:</span>
              <p className="text-surface-900">{job.description}</p>
            </div>
            
            {job.estimatedPrice && (
              <div>
                <span className="text-sm text-surface-600">Estimated Price:</span>
                <p className="font-semibold text-surface-900">${job.estimatedPrice}</p>
              </div>
            )}
            
            <div>
              <span className="text-sm text-surface-600">Urgency:</span>
              <p className="capitalize text-surface-900">{job.urgency}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {job.status === 'working' && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCompleteJob}
            className="w-full bg-secondary text-white py-3 rounded-lg font-semibold"
          >
            Mark as Complete
          </motion.button>
        )}

        {job.status === 'completed' && (
          <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4 text-center">
            <ApperIcon name="CheckCircle" className="w-12 h-12 text-secondary mx-auto mb-2" />
            <h3 className="font-semibold text-surface-900 mb-1">Job Completed!</h3>
            <p className="text-sm text-surface-600 mb-4">
              Please review your experience with this professional
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 bg-secondary text-white rounded-lg font-medium"
            >
              Leave Review
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobTracking;