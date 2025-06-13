import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from './components/ApperIcon';

const Layout = () => {
  const location = useLocation();

  const bottomNavItems = [
    { path: '/', icon: 'Home', label: 'Home' },
    { path: '/task/create', icon: 'Plus', label: 'Create' },
    { path: '/messages', icon: 'MessageCircle', label: 'Messages' },
    { path: '/profile', icon: 'User', label: 'Profile' }
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-surface-200 px-4 flex items-center justify-between z-40">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <ApperIcon name="Wrench" className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl text-surface-900">FixItNow</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-lg hover:bg-surface-100 transition-colors">
            <ApperIcon name="Bell" className="w-5 h-5 text-surface-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-surface-100 transition-colors">
            <ApperIcon name="Search" className="w-5 h-5 text-surface-600" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="flex-shrink-0 bg-white border-t border-surface-200 px-4 py-2 z-40">
        <div className="flex justify-around">
          {bottomNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="flex flex-col items-center py-2 px-3 rounded-lg transition-colors"
              >
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center ${
                    isActive ? 'text-primary' : 'text-surface-500'
                  }`}
                >
                  <ApperIcon 
                    name={item.icon} 
                    className={`w-6 h-6 mb-1 ${
                      isActive ? 'text-primary' : 'text-surface-500'
                    }`} 
                  />
                  <span className={`text-xs font-medium ${
                    isActive ? 'text-primary' : 'text-surface-500'
                  }`}>
                    {item.label}
                  </span>
                </motion.div>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;