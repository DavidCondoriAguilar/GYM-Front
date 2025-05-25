import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/24/outline';
import Menu from './common/Menu';
import './App.css';

// Sample components for routes
const Dashboard = () => (
  <div className="p-6">
    <motion.h1 
      className="text-3xl font-bold mb-6 text-gray-800"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      Dashboard
    </motion.h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <motion.div
          key={item}
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: item * 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <HomeIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">Card {item}</h3>
              <p className="text-gray-500">Description for card {item}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

// Simple components for other routes
const Members = () => <div className="p-6"><h1 className="text-3xl font-bold mb-6">Members</h1></div>;
const Schedule = () => <div className="p-6"><h1 className="text-3xl font-bold mb-6">Schedule</h1></div>;
const Analytics = () => <div className="p-6"><h1 className="text-3xl font-bold mb-6">Analytics</h1></div>;
const Settings = () => <div className="p-6"><h1 className="text-3xl font-bold mb-6">Settings</h1></div>;

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsMenuOpen(false);
      } else {
        setIsMenuOpen(true);
      }
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Router>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Sidebar Menu */}
        <Menu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
        
        {/* Main Content */}
        <div 
          className={`flex-1 flex flex-col overflow-auto transition-all duration-300 ${
            isMenuOpen ? 'md:ml-[250px]' : 'md:ml-[80px]'
          }`}
        >
          {/* Top Bar */}
          <header className="bg-white shadow-sm z-40">
            <div className="flex items-center justify-between p-4">
              <button 
                onClick={toggleMenu}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 md:hidden"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="flex items-center space-x-4">
                <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                  U
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto p-4">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/members" element={<Members />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
