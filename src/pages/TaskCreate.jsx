import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { taskService } from '../services';

const TaskCreate = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [taskData, setTaskData] = useState({
    category: '',
    description: '',
    urgency: 'flexible',
    photos: [],
    location: { lat: 40.7128, lng: -74.0060 } // Default NYC
  });
  const [aiQuote, setAiQuote] = useState(null);
  const navigate = useNavigate();

  const categories = [
    { id: 'plumbing', name: 'Plumbing', icon: 'Droplets', color: 'bg-blue-500' },
    { id: 'electrical', name: 'Electrical', icon: 'Zap', color: 'bg-yellow-500' },
    { id: 'carpentry', name: 'Carpentry', icon: 'Hammer', color: 'bg-amber-600' },
    { id: 'painting', name: 'Painting', icon: 'Palette', color: 'bg-purple-500' },
    { id: 'appliance', name: 'Appliance Repair', icon: 'Refrigerator', color: 'bg-green-500' },
    { id: 'general', name: 'General Maintenance', icon: 'Wrench', color: 'bg-gray-500' }
  ];

  const urgencyOptions = [
    { value: 'immediate', label: 'Immediate', description: 'Within 2 hours', color: 'text-red-600' },
    { value: 'today', label: 'Today', description: 'Within 24 hours', color: 'text-orange-600' },
    { value: 'thisWeek', label: 'This Week', description: 'Within 7 days', color: 'text-blue-600' },
    { value: 'flexible', label: 'Flexible', description: 'No rush', color: 'text-green-600' }
  ];

  const handleCategorySelect = (categoryId) => {
    setTaskData(prev => ({ ...prev, category: categoryId }));
    setCurrentStep(2);
  };

  const handleDescriptionSubmit = async () => {
    if (!taskData.description.trim()) {
      toast.error('Please provide a description');
      return;
    }
    
    setLoading(true);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate AI quote based on category and description
      const basePrice = {
        plumbing: 150, electrical: 200, carpentry: 120,
        painting: 100, appliance: 180, general: 90
      }[taskData.category] || 100;
      
      const urgencyMultiplier = {
        immediate: 1.5, today: 1.2, thisWeek: 1.0, flexible: 0.9
      }[taskData.urgency];
      
      const estimatedPrice = Math.round(basePrice * urgencyMultiplier);
      
      const quote = {
        price: estimatedPrice,
        confidence: 95,
        breakdown: {
          labor: Math.round(estimatedPrice * 0.7),
          materials: Math.round(estimatedPrice * 0.3)
        },
        factors: ['Task complexity', 'Local market rates', 'Urgency level']
      };
      
      setAiQuote(quote);
      setCurrentStep(3);
    } catch (error) {
      toast.error('Failed to generate quote');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSubmit = async () => {
    setLoading(true);
    try {
      const newTask = {
        ...taskData,
        estimatedPrice: aiQuote.price,
        aiClassification: {
          confidence: aiQuote.confidence,
          breakdown: aiQuote.breakdown
        },
        status: 'posted'
      };
      
      await taskService.create(newTask);
      toast.success('Task posted successfully!');
      navigate('/pros');
    } catch (error) {
      toast.error('Failed to post task');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    const newPhotos = files.map(file => URL.createObjectURL(file));
    setTaskData(prev => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos].slice(0, 3)
    }));
  };

  const removePhoto = (index) => {
    setTaskData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-full bg-surface-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-surface-600">Step {currentStep} of 3</span>
            <button
              onClick={() => navigate('/')}
              className="text-surface-500 hover:text-surface-700"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>
          <div className="w-full bg-surface-200 rounded-full h-2">
            <motion.div
              className="bg-primary h-2 rounded-full"
              initial={{ width: '33%' }}
              animate={{ width: `${(currentStep / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <div>
                <h1 className="font-display font-bold text-2xl text-surface-900 mb-2">
                  What do you need help with?
                </h1>
                <p className="text-surface-600">Choose the category that best fits your task</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {categories.map((category, index) => (
                  <motion.button
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCategorySelect(category.id)}
                    className="bg-white border border-surface-200 rounded-xl p-6 text-left hover:border-primary hover:shadow-md transition-all"
                  >
                    <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mb-4`}>
                      <ApperIcon name={category.icon} className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-medium text-surface-900 mb-1">{category.name}</h3>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <div>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center text-primary mb-4"
                >
                  <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
                  Back
                </button>
                <h1 className="font-display font-bold text-2xl text-surface-900 mb-2">
                  Tell us more about your task
                </h1>
                <p className="text-surface-600">Provide details to get an accurate quote</p>
              </div>

              <div className="bg-white rounded-xl p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-3">
                    Describe your task
                  </label>
                  <textarea
                    value={taskData.description}
                    onChange={(e) => setTaskData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what needs to be done, include any specific details..."
                    className="w-full h-32 px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-3">
                    When do you need this done?
                  </label>
                  <div className="space-y-2">
                    {urgencyOptions.map((option) => (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setTaskData(prev => ({ ...prev, urgency: option.value }))}
                        className={`w-full p-4 rounded-lg border text-left transition-all ${
                          taskData.urgency === option.value
                            ? 'border-primary bg-primary/5'
                            : 'border-surface-200 hover:border-surface-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className={`font-medium ${option.color}`}>{option.label}</span>
                            <p className="text-sm text-surface-600 mt-1">{option.description}</p>
                          </div>
                          {taskData.urgency === option.value && (
                            <ApperIcon name="Check" className="w-5 h-5 text-primary" />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-3">
                    Add photos (optional)
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-surface-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      <ApperIcon name="Camera" className="w-8 h-8 text-surface-400 mb-2" />
                      <span className="text-sm text-surface-600">Click to add photos</span>
                    </label>

                    {taskData.photos.length > 0 && (
                      <div className="flex space-x-2">
                        {taskData.photos.map((photo, index) => (
                          <div key={index} className="relative">
                            <img
                              src={photo}
                              alt={`Upload ${index + 1}`}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => removePhoto(index)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                            >
                              <ApperIcon name="X" className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDescriptionSubmit}
                disabled={loading}
                className="w-full bg-primary text-white py-4 rounded-lg font-semibold disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Generating Quote...</span>
                  </>
                ) : (
                  <>
                    <ApperIcon name="Sparkles" className="w-5 h-5" />
                    <span>Get AI Quote</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          )}

          {currentStep === 3 && aiQuote && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <div>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center text-primary mb-4"
                >
                  <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
                  Back
                </button>
                <h1 className="font-display font-bold text-2xl text-surface-900 mb-2">
                  Your AI-powered quote
                </h1>
                <p className="text-surface-600">Based on similar tasks in your area</p>
              </div>

              <div className="bg-white rounded-xl p-6 space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-surface-900 mb-2">
                    ${aiQuote.price}
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                      <span className="text-sm text-secondary font-medium">{aiQuote.confidence}% confident</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-surface-200 pt-6">
                  <h3 className="font-medium text-surface-900 mb-3">Price Breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-surface-600">Labor</span>
                      <span className="font-medium">${aiQuote.breakdown.labor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-surface-600">Materials (estimated)</span>
                      <span className="font-medium">${aiQuote.breakdown.materials}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-surface-200 pt-6">
                  <h3 className="font-medium text-surface-900 mb-3">Pricing Factors</h3>
                  <div className="space-y-2">
                    {aiQuote.factors.map((factor, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <ApperIcon name="Check" className="w-4 h-4 text-secondary" />
                        <span className="text-sm text-surface-600">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-surface-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <ApperIcon name="Info" className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-surface-700">
                        This is an AI-generated estimate. Final prices may vary based on specific requirements and pro availability.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleTaskSubmit}
                disabled={loading}
                className="w-full bg-primary text-white py-4 rounded-lg font-semibold disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Posting Task...</span>
                  </>
                ) : (
                  <>
                    <ApperIcon name="Users" className="w-5 h-5" />
                    <span>Find Professionals</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TaskCreate;