import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon,
  CurrencyDollarIcon,
  TagIcon,
  XMarkIcon,
  ArrowRightIcon,
  PencilIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';
import PaymentsHistory from '../components/PaymentsHistory';

const GymMemberDetail = ({ member, onClose }) => {
  const [showPaymentsHistory, setShowPaymentsHistory] = useState(false);
  const [showCopiedNotification, setShowCopiedNotification] = useState(false);
  if (!member) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setShowCopiedNotification(true);
    setTimeout(() => setShowCopiedNotification(false), 2000);
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
            <div className="flex items-center space-x-2">
              <p className="text-gray-400 flex items-center">
                <TagIcon className="h-4 w-4 mr-1" />
                ID: {member.id}
              </p>
              <div className="relative">
                <button
                  onClick={() => copyToClipboard(member.id)}
                  className="p-1 rounded hover:bg-gray-700 transition-colors"
                  title="Copiar ID"
                >
                  <ClipboardDocumentCheckIcon className="h-4 w-4 text-gray-400 hover:text-white" />
                </button>
                <AnimatePresence>
                  {showCopiedNotification && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 bg-green-600/90 text-white text-xs rounded-full"
                    >
                      Copiado!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
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
              {member.membershipPlan ? (
                <>
                  <div className="mb-3">
                    <p className="text-sm text-gray-400">Plan</p>
                    <p className="text-white font-medium">{member.membershipPlan.name}</p>
                    <p className="text-sm text-gray-400">{member.membershipPlan.description}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Inicio:</span>
                      <span className="text-white">{formatDate(member.membershipStart)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Fin:</span>
                      <span className="text-white">{formatDate(member.membershipEnd)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Estado:</span>
                      <span className="text-green-400">Activa</span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-gray-400">Sin membresía activa</p>
              )}
            </div>

            {/* Resumen de Pagos */}
            <div className="bg-gray-750 p-5 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 mr-2 text-green-400" />
                Resumen de Pagos
              </h3>
              {member.payments?.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Total Pagado:</span>
                    <span className="text-white font-medium">
                      {formatCurrency(member.payments.reduce((sum, p) => sum + p.amount, 0))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Último Pago:</span>
                    <span className="text-white">
                      {formatDate(member.payments[0]?.paymentDate)}
                    </span>
                  </div>
                  <div className="pt-2">
                    <button 
                      onClick={() => setShowPaymentsHistory(true)}
                      className="text-sm text-blue-400 hover:text-blue-300 flex items-center"
                    >
                      Ver todos los pagos <ArrowRightIcon className="h-3 w-3 ml-1" />
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">No hay registros de pago</p>
              )}
            </div>
          </div>

          {/* Promociones */}
          {member.promotions?.length > 0 && (
            <div className="mt-6 bg-gray-750 p-5 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <TagIcon className="h-5 w-5 mr-2 text-yellow-400" />
                Promociones Aplicadas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {member.promotions.map((promo, idx) => (
                  <div key={idx} className="bg-gray-700 p-3 rounded-lg">
                    <p className="font-medium text-white">{promo.name}</p>
                    <p className="text-sm text-yellow-300">{promo.discountPercentage}% de descuento</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Válido hasta: {formatDate(promo.endDate)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-850 border-t border-gray-700 flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            Cerrar
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center">
            <PencilIcon className="h-4 w-4 mr-2" />
            Editar Miembro
          </button>
        </div>
      </motion.div>
      
      <AnimatePresence>
        {showPaymentsHistory && (
          <PaymentsHistory 
            payments={member.payments || []} 
            onClose={() => setShowPaymentsHistory(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GymMemberDetail;