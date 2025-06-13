import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { userService, taskService } from '../services';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate current user
      const currentUser = {
        id: 'user_1',
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1 (555) 123-4567',
        type: 'customer',
        location: { lat: 40.7128, lng: -74.0060 },
        avatar: null,
        joinDate: new Date('2023-01-15'),
        completedJobs: 12,
        totalSpent: 2450,
        averageRating: 4.8,
        savedAddresses: [
          { id: 1, label: 'Home', address: '123 Main St, New York, NY 10001' },
          { id: 2, label: 'Office', address: '456 Business Ave, New York, NY 10002' }
        ]
      };

      setUser(currentUser);

      // Load user's tasks
      const allTasks = await taskService.getAll();
      const userTasks = allTasks.filter(task => task.customerId === currentUser.id);
      setTasks(userTasks);
    } catch (err) {
      setError(err.message || 'Failed to load profile data');
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (updatedData) => {
    try {
      // Simulate profile update
      setUser(prev => ({ ...prev, ...updatedData }));
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'User' },
    { id: 'tasks', label: 'My Tasks', icon: 'List' },
    { id: 'settings', label: 'Settings', icon: 'Settings' }
  ];

  if (loading) {
    return (
      <div className="min-h-full bg-surface-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-surface-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-surface-200 rounded w-48"></div>
                  <div className="h-4 bg-surface-200 rounded w-32"></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-surface-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-full bg-surface-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-900 mb-2">Failed to load profile</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={loadProfileData}
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
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-surface-900">
                {user.name}
              </h1>
              <p className="text-surface-600">{user.email}</p>
              <p className="text-sm text-surface-500">
                Member since {user.joinDate.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-surface-100 p-1 rounded-lg">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-surface-600 hover:text-surface-900'
              }`}
            >
              <ApperIcon name={tab.icon} className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg p-6 text-center"
              >
                <ApperIcon name="CheckCircle" className="w-8 h-8 text-secondary mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-surface-900 mb-1">
                  {user.completedJobs}
                </h3>
                <p className="text-surface-600">Completed Jobs</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg p-6 text-center"
              >
                <ApperIcon name="DollarSign" className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-surface-900 mb-1">
                  ${user.totalSpent.toLocaleString()}
                </h3>
                <p className="text-surface-600">Total Spent</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg p-6 text-center"
              >
                <ApperIcon name="Star" className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-surface-900 mb-1">
                  {user.averageRating}
                </h3>
                <p className="text-surface-600">Average Rating</p>
              </motion.div>
            </div>

            {/* Saved Addresses */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg text-surface-900">Saved Addresses</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-primary text-sm font-medium"
                >
                  Add New
                </motion.button>
              </div>
              
              <div className="space-y-3">
                {user.savedAddresses.map((address) => (
                  <div key={address.id} className="flex items-center justify-between p-3 bg-surface-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <ApperIcon name="MapPin" className="w-5 h-5 text-surface-500" />
                      <div>
                        <h4 className="font-medium text-surface-900">{address.label}</h4>
                        <p className="text-sm text-surface-600">{address.address}</p>
                      </div>
                    </div>
                    <button className="text-surface-400 hover:text-surface-600">
                      <ApperIcon name="MoreHorizontal" className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="bg-white rounded-lg">
            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <ApperIcon name="List" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-surface-900 mb-2">No tasks yet</h3>
                <p className="text-surface-500 mb-6">
                  Start by posting your first task to get help from professionals
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-primary text-white rounded-lg font-medium"
                >
                  Post a Task
                </motion.button>
              </div>
            ) : (
              <div className="p-6">
                <h3 className="font-semibold text-lg text-surface-900 mb-4">Recent Tasks</h3>
                <div className="space-y-4">
                  {tasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-surface-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-surface-900 capitalize">
                          {task.category}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.status === 'completed' ? 'bg-secondary/10 text-secondary' :
                          task.status === 'inProgress' ? 'bg-primary/10 text-primary' :
                          task.status === 'posted' ? 'bg-accent/10 text-accent' :
                          'bg-surface-100 text-surface-600'
                        }`}>
                          {task.status}
                        </span>
                      </div>
                      <p className="text-sm text-surface-600 mb-3">{task.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-surface-500">
                          {task.urgency && `Urgency: ${task.urgency}`}
                        </span>
                        {task.estimatedPrice && (
                          <span className="font-semibold text-surface-900">
                            ${task.estimatedPrice}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Profile Settings */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-lg text-surface-900 mb-4">Profile Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user.name}
                    className="w-full px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={user.email}
                    className="w-full px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    defaultValue={user.phone}
                    className="w-full px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSaveProfile({ name: user.name, email: user.email, phone: user.phone })}
                  className="px-6 py-2 bg-primary text-white rounded-lg font-medium"
                >
                  Save Changes
                </motion.button>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-lg text-surface-900 mb-4">Notifications</h3>
              
              <div className="space-y-4">
                {[
                  { id: 'email', label: 'Email notifications', description: 'Receive updates via email' },
                  { id: 'sms', label: 'SMS notifications', description: 'Receive updates via SMS' },
                  { id: 'push', label: 'Push notifications', description: 'Receive push notifications' },
                  { id: 'marketing', label: 'Marketing emails', description: 'Receive promotional content' }
                ].map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-surface-900">{setting.label}</h4>
                      <p className="text-sm text-surface-600">{setting.description}</p>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        defaultChecked={setting.id !== 'marketing'}
                        className="sr-only"
                        id={setting.id}
                      />
                      <label
                        htmlFor={setting.id}
                        className="flex items-center cursor-pointer"
                      >
                        <div className="w-10 h-6 bg-surface-200 rounded-full shadow-inner transition-colors"></div>
                        <div className="w-4 h-4 bg-white rounded-full shadow absolute left-1 top-1 transition-transform"></div>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-lg text-surface-900 mb-4">Account</h3>
              
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full text-left p-3 rounded-lg hover:bg-surface-50 flex items-center justify-between"
                >
                  <span className="text-surface-900">Change Password</span>
                  <ApperIcon name="ChevronRight" className="w-4 h-4 text-surface-400" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full text-left p-3 rounded-lg hover:bg-surface-50 flex items-center justify-between"
                >
                  <span className="text-surface-900">Privacy Settings</span>
                  <ApperIcon name="ChevronRight" className="w-4 h-4 text-surface-400" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full text-left p-3 rounded-lg hover:bg-red-50 text-red-600 flex items-center justify-between"
                >
                  <span>Delete Account</span>
                  <ApperIcon name="ChevronRight" className="w-4 h-4 text-red-400" />
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;