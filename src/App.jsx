import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router } from 'react-router-dom';
import Menu from './common/Menu';
import AppRoutes from './router';
import './App.css';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // On mobile, start with menu closed; on desktop, start with it open
      setIsMenuOpen(!mobile);
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
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="flex items-center space-x-4">
                <button 
                  className="p-2 rounded-full text-gray-600 hover:bg-gray-100 relative"
                  aria-label="Notifications"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold cursor-pointer">
                  U
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto p-4">
            <AnimatePresence mode="wait">
              <AppRoutes />
            </AnimatePresence>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
