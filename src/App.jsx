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
      <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
        {/* Sidebar Menu */}
        <Menu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
        
        {/* Main Content */}
        <div 
          className={`flex-1 flex flex-col transition-all duration-300 ${
            isMenuOpen ? 'md:ml-[250px]' : 'md:ml-[80px]'
          }`}
        >
          {/* El encabezado se maneja en otro componente */}

          {/* Page Content */}
          <main className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto custom-scrollbar">
              <AnimatePresence mode="wait">
                <AppRoutes />
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
