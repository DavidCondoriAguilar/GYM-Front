import React from 'react';
import { motion } from 'framer-motion';
import { HomeIcon, UserGroupIcon, CurrencyDollarIcon, ClockIcon } from '@heroicons/react/24/outline';

const DashboardPage = () => {
  const stats = [
    { name: 'Total Members', value: '1,234', icon: UserGroupIcon, change: '+12%', changeType: 'increase' },
    { name: 'Active Now', value: '89', icon: UserGroupIcon, change: '+5%', changeType: 'increase' },
    { name: 'Monthly Revenue', value: '$12,345', icon: CurrencyDollarIcon, change: '+8.2%', changeType: 'increase' },
    { name: 'Avg. Session', value: '45 min', icon: ClockIcon, change: '-2.3%', changeType: 'decrease' },
  ];

  return (
    <div className="p-6">
      <motion.h1 
        className="text-3xl font-bold mb-6 text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Dashboard
      </motion.h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.name}
              className="bg-white rounded-xl shadow p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${
                  stat.name === 'Total Members' ? 'bg-blue-100 text-blue-600' :
                  stat.name === 'Active Now' ? 'bg-green-100 text-green-600' :
                  stat.name === 'Monthly Revenue' ? 'bg-purple-100 text-purple-600' :
                  'bg-yellow-100 text-yellow-600'
                }`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <div className={`mt-2 text-sm ${
                stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change} from last month
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <motion.div 
        className="bg-white rounded-xl shadow p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mr-4">
                <UserGroupIcon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New member registered</p>
                <p className="text-sm text-gray-500">John Doe joined the gym today</p>
              </div>
              <span className="text-sm text-gray-400">2h ago</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
