import React from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const SchedulePage = () => {
  const classes = [
    { id: 1, name: 'Yoga Matutino', time: '08:00 - 09:00', trainer: 'Ana López', capacity: '12/15' },
    { id: 2, name: 'Spinning', time: '10:00 - 11:00', trainer: 'Carlos M.', capacity: '10/12' },
    { id: 3, name: 'CrossFit', time: '17:00 - 18:00', trainer: 'María G.', capacity: '8/10' },
    { id: 4, name: 'Zumba', time: '18:30 - 19:30', trainer: 'Luisa F.', capacity: '20/25' },
  ];

  return (
    <div className="p-6">
      <motion.div 
        className="flex justify-between items-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800">Class Schedule</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Add New Class
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls, index) => (
          <motion.div
            key={cls.id}
            className="bg-white rounded-xl shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{cls.name}</h3>
                <div className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  {cls.capacity}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <ClockIcon className="h-5 w-5 mr-2 text-blue-500" />
                  <span>{cls.time}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <UserGroupIcon className="h-5 w-5 mr-2 text-green-500" />
                  <span>Trainer: {cls.trainer}</span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Capacity</span>
                  <div className="w-3/4 bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${(parseInt(cls.capacity) / 20) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
              <button className="text-sm text-gray-600 hover:text-gray-900">Edit</button>
              <button className="text-sm text-red-600 hover:text-red-800">Cancel</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SchedulePage;
