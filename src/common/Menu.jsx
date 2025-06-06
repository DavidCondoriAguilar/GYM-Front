import { motion } from 'framer-motion';
import { HomeIcon, UserGroupIcon, CurrencyDollarIcon, ChartBarIcon, Cog6ToothIcon, ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { name: 'Dashboard', icon: HomeIcon, path: '/' },
  { name: 'Members', icon: UserGroupIcon, path: '/members' },
  { name: 'Membership Plans', icon: CurrencyDollarIcon, path: '/membership-plans' },
  { name: 'Analytics', icon: ChartBarIcon, path: '/analytics' },
  { name: 'Settings', icon: Cog6ToothIcon, path: '/settings' },
];

export default function Menu({ isOpen, toggleMenu }) {
  const location = useLocation();
  
  const sidebarVariants = {
    open: { width: '250px', opacity: 1 },
    closed: { width: '80px', opacity: 1 },
  };

  const itemVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -20 },
  };

  return (
    <motion.div
      className="fixed top-0 left-0 h-full bg-gray-900 text-white shadow-lg z-50"
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      variants={sidebarVariants}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex flex-col h-full p-4">
        {/* Logo */}
        <div className="flex items-center justify-between mb-8 p-2">
          <motion.div
            className="text-xl font-bold whitespace-nowrap"
            variants={itemVariants}
          >
            {isOpen ? 'GYM PRO' : 'GP'}
          </motion.div>
          <button
            onClick={toggleMenu}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            <ArrowLeftStartOnRectangleIcon 
              className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-0' : 'rotate-180'}`} 
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link to={item.path} key={item.name}>
                <motion.div
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="h-6 w-6" />
                  {isOpen && <span className="ml-3">{item.name}</span>}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Settings */}
        <div className="mt-auto pt-4 border-t border-gray-800">
          <Link to="/settings">
            <motion.div
              className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Cog6ToothIcon className="h-6 w-6" />
              {isOpen && <span className="ml-3">Settings</span>}
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}