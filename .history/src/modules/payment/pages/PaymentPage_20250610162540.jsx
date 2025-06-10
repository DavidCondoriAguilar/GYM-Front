import React, { useState, useEffect } from 'react';
import usePayments from '../hooks/usePayments';
import { PaymentMethod, PaymentStatus } from '../models/Payment';
import paymentService from '../services/paymentService';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowPathIcon, 
  XMarkIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ClockIcon,
  TagIcon
} from '@heroicons/react/24/outline';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export default function PaymentPage() {
  console.log('PaymentPage mounted');
  console.log('Payments:', payments);
  console.log('Loading:', loading);
  console.log('Error:', error);
  const {
    payments,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    newPaymentsCount,
    activePaymentsCount,
    monthlyRevenue,
    deletePayment,
    refreshPayments,
    fetchPayments
  } = usePayments();

  useEffect(() => {
    refreshPayments();
  }, [refreshPayments]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  const handleCreatePayment = (memberId) => {
    setSelectedMemberId(memberId);
    setShowCreateModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div 
          className="flex justify-between items-center mb-8"
          variants={slideUp}
        >
          <h1 className="text-3xl font-bold text-white">Gestión de Pagos</h1>
          <div className="flex space-x-4">
            <motion.button
              onClick={refreshPayments}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              <ArrowPathIcon className="w-5 h-5 inline-block mr-2" />
              Refrescar
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"
          variants={fadeIn}
        >
          <motion.div 
            className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors duration-200"
            variants={slideUp}
          >
            <h3 className="text-sm font-medium text-gray-400">Nuevos Pagos Hoy</h3>
            <p className="text-3xl font-bold text-blue-400 mt-2">{newPaymentsCount}</p>
          </motion.div>
          <motion.div 
            className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors duration-200"
            variants={slideUp}
          >
            <h3 className="text-sm font-medium text-gray-400">Pagos Activos</h3>
            <p className="text-3xl font-bold text-green-400 mt-2">{activePaymentsCount}</p>
          </motion.div>
          <motion.div 
            className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors duration-200"
            variants={slideUp}
          >
            <h3 className="text-sm font-medium text-gray-400">Ingreso Mensual</h3>
            <p className="text-3xl font-bold text-yellow-400 mt-2">S/. {monthlyRevenue.toFixed(2)}</p>
          </motion.div>
        </motion.div>

        {/* Search */}
        <motion.div 
          className="flex justify-between items-center mb-8"
          variants={slideUp}
        >
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar pagos..."
                className="w-80 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => handleCreatePayment('')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Nuevo Pago
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              <PencilIcon className="w-5 h-5 inline-block mr-1" />
              Exportar
            </motion.button>
          </div>
        </motion.div>

        {/* Payments Table */}
        <motion.div 
          className="bg-gray-800 rounded-xl overflow-hidden"
          variants={fadeIn}
        >
          <motion.table 
            className="min-w-full divide-y divide-gray-700"
            variants={slideUp}
          >
            <thead className="bg-gray-700">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-8 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Miembro
                </th>
                <th className="px-8 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-8 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-8 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Método
                </th>
                <th className="px-8 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-8 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {payments.map((payment) => (
                <motion.tr 
                  key={payment.id}
                  whileHover={{ backgroundColor: 'rgb(64, 64, 64)' }}
                  className="transition-colors duration-200"
                >
                  <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-300">
                    {payment.id}
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-300">
                    {payment.gymMemberId}
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-300">
                    S/. {payment.amount.toFixed(2)}
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(payment.paymentDate).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-300">
                    {payment.paymentMethod}
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap text-sm">
                    <span className={`px-3 inline-flex text-xs leading-5 font-semibold rounded-full ${payment.status === PaymentStatus.PENDIENTE ? 'bg-yellow-100 text-yellow-800' :
                        payment.status === PaymentStatus.COMPLETADO ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                      }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <motion.button
                      onClick={() => deletePayment(payment.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="text-red-400 hover:text-red-300 flex items-center transition-colors duration-200"
                    >
                      <TrashIcon className="w-5 h-5 inline-block mr-1" />
                      Eliminar
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        </motion.div>
      </motion.div>
    </div>
  );
}