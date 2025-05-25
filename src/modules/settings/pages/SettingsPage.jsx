import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Cog6ToothIcon, 
  UserCircleIcon, 
  ShieldCheckIcon, 
  BellIcon, 
  CreditCardIcon,
  ArrowRightOnRectangleIcon,
  MoonIcon,
  SunIcon
} from '@heroicons/react/24/outline';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });

  const settingsTabs = [
    { id: 'profile', name: 'Profile', icon: UserCircleIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'billing', name: 'Billing', icon: CreditCardIcon },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
              <p className="mt-1 text-sm text-gray-500">Update your account's profile information and email address.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                  First name
                </label>
                <input
                  type="text"
                  name="first-name"
                  id="first-name"
                  defaultValue="John"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                  Last name
                </label>
                <input
                  type="text"
                  name="last-name"
                  id="last-name"
                  defaultValue="Doe"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  defaultValue="john@example.com"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Changes
              </button>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Update Password</h3>
              <p className="mt-1 text-sm text-gray-500">Ensure your account is using a long, random password to stay secure.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  type="password"
                  name="current-password"
                  id="current-password"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  name="new-password"
                  id="new-password"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirm-password"
                  id="confirm-password"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
              <p className="mt-1 text-sm text-gray-500">Manage when and how we send you notifications.</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Email notifications</h4>
                  <p className="text-sm text-gray-500">Receive email notifications about your account.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifications({ ...notifications, email: !notifications.email })}
                  className={`${
                    notifications.email ? 'bg-blue-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  role="switch"
                  aria-checked={notifications.email}
                >
                  <span className="sr-only">Toggle email notifications</span>
                  <span
                    aria-hidden="true"
                    className={`${
                      notifications.email ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">SMS notifications</h4>
                  <p className="text-sm text-gray-500">Get important updates via SMS.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifications({ ...notifications, sms: !notifications.sms })}
                  className={`${
                    notifications.sms ? 'bg-blue-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  role="switch"
                  aria-checked={notifications.sms}
                >
                  <span className="sr-only">Toggle SMS notifications</span>
                  <span
                    aria-hidden="true"
                    className={`${
                      notifications.sms ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Push notifications</h4>
                  <p className="text-sm text-gray-500">Receive push notifications on your device.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifications({ ...notifications, push: !notifications.push })}
                  className={`${
                    notifications.push ? 'bg-blue-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  role="switch"
                  aria-checked={notifications.push}
                >
                  <span className="sr-only">Toggle push notifications</span>
                  <span
                    aria-hidden="true"
                    className={`${
                      notifications.push ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  />
                </button>
              </div>
            </div>
          </div>
        );
      case 'billing':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Billing Information</h3>
              <p className="mt-1 text-sm text-gray-500">Manage your subscription and payment methods.</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-medium text-gray-900">Premium Plan</h4>
                    <p className="text-sm text-gray-500">Billed monthly</p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Payment Method</h4>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <CreditCardIcon className="h-6 w-6 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Visa ending in 4242</p>
                        <p className="text-xs text-gray-500">Expires 12/24</p>
                      </div>
                    </div>
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      Update
                    </button>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Billing History</h4>
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Monthly Subscription</p>
                          <p className="text-xs text-gray-500">May 25, 2023</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">$29.99</p>
                          <p className="text-xs text-gray-500">Paid</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-500">
                    View all billing history
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <motion.div 
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your account settings and preferences.</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <SunIcon className="h-5 w-5 text-yellow-500" />
            ) : (
              <MoonIcon className="h-5 w-5 text-gray-600" />
            )}
          </button>
          <button className="flex items-center text-sm font-medium text-red-600 hover:text-red-700">
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
            Sign out
          </button>
        </div>
      </motion.div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="lg:grid lg:grid-cols-12">
          {/* Sidebar navigation */}
          <div className="lg:col-span-3 border-r border-gray-200">
            <nav className="p-6 space-y-1">
              {settingsTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${
                      activeTab === tab.id ? 'text-blue-500' : 'text-gray-400'
                    }`} />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main content */}
          <div className="lg:col-span-9">
            <div className="p-8">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
