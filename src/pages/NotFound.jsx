import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-surface-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 3,
            ease: "easeInOut"
          }}
          className="mb-8"
        >
          <ApperIcon name="Home" className="w-24 h-24 text-surface-300 mx-auto" />
        </motion.div>
        
        <h1 className="font-display font-bold text-6xl text-surface-900 mb-4">404</h1>
        <h2 className="font-display font-semibold text-xl text-surface-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-surface-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
            className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2"
          >
            <ApperIcon name="Home" className="w-5 h-5" />
            <span>Go Home</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(-1)}
            className="w-full border border-surface-300 text-surface-700 py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2"
          >
            <ApperIcon name="ArrowLeft" className="w-5 h-5" />
            <span>Go Back</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;