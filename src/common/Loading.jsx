import { motion } from 'framer-motion';

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="relative">
          <div className="h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-12 w-12 bg-white rounded-full"></div>
        </div>
        <motion.p 
          className="mt-4 text-gray-600 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Loading...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Loading;
