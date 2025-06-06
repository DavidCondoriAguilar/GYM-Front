import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import membershipPlanService from '../service/membershipPlan.service';
import MembershipPlanForm from '../components/MembershipPlanForm';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { MembershipType } from '../../../models/MembershipPlan';

// Animaciones
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  },
  exit: { opacity: 0, y: -20 }
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { 
    opacity: 1,
    transition: { duration: 0.3 }
  }
};

const MembershipPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await membershipPlanService.getPlans();
      setPlans(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching plans:', err);
      setError(err.message || 'Error al cargar los planes');
      toast.error('Error al cargar los planes de membresía');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleCreatePlan = () => {
    navigate('/membership-plans/new');
  };

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    navigate(`/membership-plans/${plan.id}/edit`);
  };

  const handleDeleteClick = (plan) => {
    setSelectedPlan(plan);
    setShowDeleteDialog(true);
  };

  const handleUpdatePlan = async (formData) => {
    try {
      setIsProcessing(true);
      await membershipPlanService.updatePlan(selectedPlan.id, formData);
      toast.success('Plan actualizado exitosamente', {
        description: 'Los cambios se han guardado correctamente.',
      });
      setSelectedPlan(null);
      fetchPlans();
    } catch (error) {
      console.error('Error updating plan:', error);
      toast.error('Error al actualizar el plan', {
        description: error.message || 'Por favor, inténtalo de nuevo.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPlan) return;
    
    try {
      setIsProcessing(true);
      await membershipPlanService.deletePlan(selectedPlan.id);
      toast.success('Plan eliminado exitosamente', {
        description: 'El plan ha sido eliminado correctamente.',
      });
      setShowDeleteDialog(false);
      fetchPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast.error('Error al eliminar el plan', {
        description: error.message || 'No se pudo eliminar el plan. Por favor, inténtalo de nuevo.',
      });
    } finally {
      setIsProcessing(false);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando planes de membresía...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 w-full max-w-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="flex justify-between items-center mb-8"
          variants={item}
        >
          <div>
            <motion.h1 
              className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Nuestros Planes de Membresía
            </motion.h1>
            <motion.p 
              className="mt-2 text-xl text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Administra los planes de membresía de tu gimnasio
            </motion.p>
          </div>
          <motion.button
            onClick={handleCreatePlan}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            whileHover={{ scale: 1.05, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 20 }}
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Nuevo Plan
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {plans.length === 0 ? (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{ scale: [0.9, 1.1, 1] }}
                transition={{ duration: 0.5 }}
              >
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </motion.div>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No hay planes disponibles
              </h3>
              <p className="mt-1 text-gray-500">
                No se encontraron planes de membresía en este momento.
              </p>
              <motion.div 
                className="mt-6"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.button
                  onClick={handleCreatePlan}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Crear primer plan
                </motion.button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {plans.map((plan) => (
                <motion.div
                  key={plan.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                  variants={item}
                  whileHover={{ 
                    y: -5,
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                  }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="p-6">
                    <motion.div 
                      className="flex items-center justify-between"
                      whileHover={{ x: 5 }}
                    >
                      <h2 className="text-2xl font-bold text-gray-900">
                        {plan.name}
                      </h2>
                      <motion.span 
                        className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${
                          plan.type === MembershipType.PREMIUM ? 'bg-purple-100 text-purple-800' :
                          plan.type === MembershipType.VIP ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {plan.type}
                      </motion.span>
                    </motion.div>
                    <p className="mt-2 text-gray-600">{plan.description}</p>
                    <motion.div 
                      className="mt-6"
                      whileHover={{ scale: 1.02 }}
                    >
                      <p className="text-4xl font-extrabold text-gray-900">
                        ${plan.cost.toFixed(2)}
                        <span className="text-base font-medium text-gray-500">
                          /{plan.durationMonths} {plan.durationMonths === 1 ? 'mes' : 'meses'}
                        </span>
                      </p>
                    </motion.div>

                    <motion.div 
                      className="mt-8 grid grid-cols-2 gap-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <motion.button
                        type="button"
                        onClick={() => handleEditPlan(plan)}
                        className="flex-1 flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        whileHover={{ scale: 1.03, backgroundColor: '#f9fafb' }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <svg className="h-5 w-5 mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Editar
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={() => handleDeleteClick(plan)}
                        className="flex-1 flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        whileHover={{ scale: 1.03, backgroundColor: '#dc2626' }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <svg className="h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Eliminar
                      </motion.button>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Form Modal */}
        <AnimatePresence>
          {selectedPlan && (
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPlan(null)}
            >
              <motion.div 
                className="bg-white rounded-lg w-full max-w-2xl p-6 mx-auto"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                onClick={e => e.stopPropagation()}
              >
                <MembershipPlanForm
                  plan={selectedPlan}
                  onSave={handleUpdatePlan}
                  onCancel={() => setSelectedPlan(null)}
                  isEditing={true}
                  isSubmitting={isProcessing}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Plan de Membresía"
        message="¿Estás seguro de que deseas eliminar este plan de membresía? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        isProcessing={isProcessing}
      />

      <div className="mt-16 text-center">
        <p className="text-base font-medium text-gray-500">
          ¿Necesitas ayuda para elegir?{' '}
          <a
            href="#"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Contáctanos
          </a>
        </p>
      </div>
      </div>
    </div>
  );
};

export default MembershipPage;