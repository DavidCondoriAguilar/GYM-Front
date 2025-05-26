import React from 'react';
import { motion } from 'framer-motion';
import { 
  UserCircleIcon, 
  EnvelopeIcon, 
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  TagIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(amount);
};

const formatDate = (dateString) => {
  if (!dateString) return 'No especificada';
  return new Date(dateString + 'T00:00:00').toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    timeZone: 'UTC'
  });
};

const MemberDetailsModal = ({ member, onClose }) => {
  if (!member) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">{member.name}</h2>
            <p className="text-gray-400 flex items-center">
              <EnvelopeIcon className="h-4 w-4 mr-1" />
              {member.email}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Información Básica */}
            <div className="bg-gray-750 p-5 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <UserCircleIcon className="h-5 w-5 mr-2 text-blue-400" />
                Información Básica
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Teléfono</p>
                  <p className="text-white">{member.phone || 'No especificado'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Estado</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    member.active 
                      ? 'bg-green-900/30 text-green-400 border border-green-800'
                      : 'bg-red-900/30 text-red-400 border border-red-800'
                  }`}>
                    {member.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Fecha de Registro</p>
                  <p className="text-white">{formatDate(member.registrationDate)}</p>
                </div>
              </div>
            </div>

            {/* Membresía */}
            <div className="bg-gray-750 p-5 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <TagIcon className="h-5 w-5 mr-2 text-purple-400" />
                Membresía
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Tipo de Membresía</p>
                  <p className="text-white">{member.membershipType || 'No especificada'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Estado de Pago</p>
                  <div className="flex items-center">
                    {member.paymentStatus === 'paid' ? (
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <XCircleIcon className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={member.paymentStatus === 'paid' ? 'text-green-400' : 'text-red-400'}>
                      {member.paymentStatus === 'paid' ? 'Al día' : 'Pendiente'}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Próximo Pago</p>
                  <p className="text-white">{formatDate(member.nextPaymentDate)}</p>
                </div>
              </div>
            </div>

            {/* Resumen de Pagos */}
            <div className="bg-gray-750 p-5 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 mr-2 text-yellow-400" />
                Resumen de Pagos
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Mensualidad</p>
                  <p className="text-white">{formatCurrency(member.monthlyFee || 0)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Deuda Total</p>
                  <p className="text-white">{formatCurrency(member.totalDebt || 0)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Último Pago</p>
                  <div className="flex justify-between">
                    <span className="text-white">{formatDate(member.lastPaymentDate)}</span>
                    <span className="text-white">{member.lastPaymentAmount ? formatCurrency(member.lastPaymentAmount) : 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Promociones */}
            {member.promotions && member.promotions.length > 0 && (
              <div className="md:col-span-3 bg-gray-750 p-5 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <TagIcon className="h-5 w-5 mr-2 text-green-400" />
                  Promociones Activas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {member.promotions.map((promo, index) => (
                    <div key={index} className="bg-gray-700 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-white">{promo.name}</h4>
                          <p className="text-sm text-gray-300">{promo.description}</p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-800">
                          -{promo.discount}%
                        </span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-600">
                        <p className="text-xs text-gray-400 flex items-center">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          Vence: {formatDate(promo.expiryDate)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Historial de Asistencia */}
            <div className="md:col-span-3 bg-gray-750 p-5 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <ClockIcon className="h-5 w-5 mr-2 text-indigo-400" />
                Últimas Asistencias
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Hora de Entrada
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Hora de Salida
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Duración
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {member.attendance && member.attendance.length > 0 ? (
                      member.attendance.map((record, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                            {new Date(record.date).toLocaleDateString('es-ES')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {record.checkIn || '--:--'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {record.checkOut || '--:--'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {record.duration || '--'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-400">
                          No hay registros de asistencia recientes
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-700 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cerrar
          </button>
          <button
            type="button"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Editar Miembro
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default MemberDetailsModal;
