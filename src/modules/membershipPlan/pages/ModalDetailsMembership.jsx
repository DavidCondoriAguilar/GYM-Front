import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { XMarkIcon, ArrowLeftIcon, ClockIcon, CurrencyDollarIcon, TagIcon, CalendarIcon } from '@heroicons/react/24/outline';
import membershipPlanService from '../service/membershipPlan.service';

const fadeIn = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: { 
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1]
    }
  },
  exit: { 
    opacity: 0,
    scale: 0.98,
    transition: { 
      duration: 0.2,
      ease: [0.4, 0, 1, 1]
    }
  }
};

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: 'spring',
      damping: 25,
      stiffness: 300
    }
  },
  exit: { 
    y: -20, 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

const ModalDetailsMembership = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlanDetails = async () => {
      try {
        const data = await membershipPlanService.getPlanById(id);
        setPlan(data);
      } catch (err) {
        console.error('Error fetching plan details:', err);
        setError('No se pudo cargar la información del plan');
        toast.error('Error', {
          description: 'No se pudo cargar la información del plan.'
        });
        navigate('/membership-plans');
      } finally {
        setLoading(false);
      }
    };

    fetchPlanDetails();
  }, [id, navigate]);

  const handleClose = () => {
    navigate('/membership-plans');
  };

  const handleEdit = () => {
    navigate(`/membership-plans/${id}/edit`);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div 
          className="bg-gray-800 rounded-2xl p-6 max-w-md w-full text-center"
          variants={slideUp}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="text-red-500 text-lg font-medium mb-4">Error</div>
          <p className="text-gray-300 mb-6">{error || 'No se pudo cargar la información del plan'}</p>
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Volver
          </button>
        </motion.div>
      </div>
    );
  }

  // Format date if needed
  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-gray-900/90 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto z-50"
        onClick={handleClose}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={fadeIn}
      >
        <motion.div 
          className="bg-gray-800/95 rounded-2xl shadow-2xl w-full max-w-2xl my-8 relative border border-gray-700/50 overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-800/90 via-gray-900/90 to-gray-900/90"
          variants={slideUp}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-indigo-900/80 to-purple-900/80 p-6 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-purple-500/10 opacity-60"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <TagIcon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    {plan.name}
                  </h2>
                </div>
                <motion.button
                  onClick={handleClose}
                  className="p-1.5 rounded-full hover:bg-white/10 text-gray-200 hover:text-white transition-colors"
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Cerrar"
                >
                  <XMarkIcon className="w-6 h-6" />
                </motion.button>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 relative z-10">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                plan.type === 'PREMIUM' ? 'bg-yellow-500/20 text-yellow-300' :
                plan.type === 'VIP' ? 'bg-purple-500/20 text-purple-300' :
                'bg-blue-500/20 text-blue-300'
              }`}>
                {plan.type || 'ESTÁNDAR'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-700/50 text-gray-300">
                {plan.durationMonths} {plan.durationMonths === 1 ? 'mes' : 'meses'}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 relative z-10">
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-300 mb-2">Descripción</h3>
              <p className="text-gray-400 bg-gray-700/30 rounded-lg p-4">
                {plan.description || 'No hay descripción disponible para este plan.'}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* ID */}
              <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                  </div>
                  <h4 className="text-gray-300 font-medium">ID del Plan</h4>
                </div>
                <div className="ml-11">
                  <p className="text-gray-300 font-mono text-sm break-all">{plan.id}</p>
                  <motion.button
                    onClick={() => {
                      navigator.clipboard.writeText(plan.id);
                      toast.success('ID copiado al portapapeles');
                    }}
                    className="mt-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center group"
                    title="Copiar ID"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.span 
                      className="inline-block mr-1"
                      animate={{ x: [0, 2, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    >
                      📋
                    </motion.span>
                    Copiar ID
                  </motion.button>
                </div>
              </div>

              {/* Price */}
              <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-indigo-500/20 rounded-lg">
                    <CurrencyDollarIcon className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h4 className="text-gray-300 font-medium">Precio Total</h4>
                </div>
                <div className="ml-11">
                  <p className="text-2xl font-bold text-white">${plan.cost?.toFixed(2) || '0.00'}</p>
                  <p className="text-sm text-gray-400">
                    ${(plan.cost / plan.durationMonths)?.toFixed(2) || '0.00'} por mes
                  </p>
                </div>
              </div>

              {/* Duration */}
              <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <ClockIcon className="w-5 h-5 text-purple-400" />
                  </div>
                  <h4 className="text-gray-300 font-medium">Duración</h4>
                </div>
                <div className="ml-11">
                  <p className="text-2xl font-bold text-white">{plan.durationMonths}</p>
                  <p className="text-sm text-gray-400">
                    {plan.durationMonths === 1 ? 'Mes' : 'Meses'}
                  </p>
                </div>
              </div>

              {/* Created At */}
              <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <CalendarIcon className="w-5 h-5 text-blue-400" />
                  </div>
                  <h4 className="text-gray-300 font-medium">Creado el</h4>
                </div>
                <div className="ml-11">
                  <p className="text-gray-300">{formatDate(plan.createdAt)}</p>
                </div>
              </div>

              {/* Updated At */}
              <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <CalendarIcon className="w-5 h-5 text-green-400" />
                  </div>
                  <h4 className="text-gray-300 font-medium">Actualizado el</h4>
                </div>
                <div className="ml-11">
                  <p className="text-gray-300">{formatDate(plan.updatedAt)}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-2">
              <motion.button
                onClick={handleClose}
                className="px-6 py-2.5 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:border-indigo-500/50 hover:text-white transition-all duration-300 flex items-center justify-center space-x-2 group"
                whileHover={{ x: -2, borderColor: 'rgba(99, 102, 241, 0.7)' }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Volver</span>
              </motion.button>
              <motion.button
                onClick={handleEdit}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/20 flex items-center justify-center space-x-2 group relative overflow-hidden"
                whileHover={{ 
                  scale: 1.02, 
                  y: -1,
                  boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.3), 0 10px 10px -5px rgba(99, 102, 241, 0.1)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="relative z-10">Editar Plan</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModalDetailsMembership;
