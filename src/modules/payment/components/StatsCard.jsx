import React from 'react';

const StatsCard = ({ title, value, icon: Icon, trend, trendText, iconBgColor, trendColor }) => {
  return (
    <div className="bg-gray-800 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/20 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="mt-1 text-3xl font-semibold text-white">{value}</p>
          {trend && (
            <p className={`mt-2 flex items-center text-sm ${trendColor || 'text-green-400'}`}>
              {trend}
              <span className="ml-1 text-gray-400">{trendText}</span>
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${iconBgColor || 'bg-blue-500/10'}`}>
          <Icon className="h-6 w-6 text-blue-400" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
