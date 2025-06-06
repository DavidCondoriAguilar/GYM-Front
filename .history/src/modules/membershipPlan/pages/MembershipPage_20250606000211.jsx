import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { MagnifyingGlassIcon, EyeIcon, PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
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
  const [searchId, setSearchId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const fetchPlans = async (id = '') => {
    try {
      setLoading(true);
      setIsSearching(!!id);
      
      if (id) {
        // Search for a specific plan by ID
        const plan = await membershipPlanService.getPlanById(id);
        setPlans([plan]);
      } else {
        // Fetch all plans
        const data = await membershipPlanService.getPlans();
        setPlans(data);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching plans:', err);
      setError(id ? 'No se encontró el plan con el ID especificado' : 'Error al cargar los planes de membresía');
      setPlans([]);
      
      if (id) {
        toast.error('Plan no encontrado', {
          description: 'No se encontró ningún plan con el ID especificado.'
        });
      } else {
        toast.error('Error', {
          description: 'No se pudieron cargar los planes de membresía.'
        });
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    fetchPlans(searchId);
  };
  
  const handleClearSearch = () => {
    setSearchId('');
    fetchPlans();
  };

  const handleCreatePlan = () => {
    navigate('/membership-plans/new');
  };

  const handleViewPlan = (plan) => {
    navigate(`/membership-plans/${plan.id}`);
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

  useEffect(() => {
    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Cargando planes de membresía...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="bg-gray-800 border-l-4 border-red-500 p-6 w-full max-w-md rounded-lg shadow-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-white">Error</h3>
              <div className="mt-2 text-sm text-gray-300">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => fetchPlans()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="flex flex-col space-y-6"
          variants={fadeIn}
          initial="hidden"
          animate="show"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Planes de Membresía</h1>
              <p className="text-gray-400 mt-2">Administra los planes de membresía de tu gimnasio</p>
            </div>
            <motion.button
              onClick={handleCreatePlan}
              className="mt-4 md:mt-0 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/20 flex items-center space-x-2 transition-all duration-200"
              whileHover={{ scale: 1.03, y: -1, boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)' }}
              whileTap={{ scale: 0.98 }}
            >
              <PlusIcon className="w-5 h-5" />
              <span>Nuevo Plan</span>
            </motion.button>
          </div>
          
          {/* Search Bar */}
          <motion.form 
            onSubmit={handleSearch}
            className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50 shadow-xl"
            variants={fadeIn}
          >
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Buscar plan por ID..."
                  className="pl-10 pr-4 py-2.5 w-full bg-gray-700/80 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="flex space-x-2">
                <motion.button
                  type="submit"
                  className={`px-4 py-2.5 rounded-lg flex items-center space-x-2 ${
                    searchId.trim() 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/20'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                  whileHover={searchId.trim() ? { scale: 1.02, boxShadow: '0 0 15px rgba(99, 102, 241, 0.3)' } : {}}
                  whileTap={{ scale: 0.98 }}
                  disabled={!searchId.trim()}
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                  <span>Buscar</span>
                </motion.button>
                {isSearching && (
                  <motion.button
                    type="button"
                    onClick={handleClearSearch}
                    className="px-4 py-2.5 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 flex items-center space-x-2 border border-gray-600/50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Limpiar</span>
                  </motion.button>
                )}
              </div>
            </div>
          </motion.form>
        </motion.div>

        <AnimatePresence>
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {plans.length === 0 ? (
              <motion.div 
                className="col-span-full text-center py-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  animate={{ scale: [0.9, 1.1, 1] }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
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
                      strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-200">
                    No se encontraron planes
                  </h3>
                  <p className="mt-2 text-gray-400">
                    {isSearching 
                      ? 'No hay planes que coincidan con tu búsqueda.' 
                      : 'Comienza creando un nuevo plan de membresía.'}
                  </p>
                  <div className="mt-6">
                    <motion.button
                      onClick={handleCreatePlan}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                      Crear Plan de Membresía
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              plans.map((plan) => (
                <motion.div
                  key={plan.id}
                  variants={item}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-indigo-500/30 transition-all duration-300 shadow-xl hover:shadow-indigo-500/10"
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <motion.span 
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          plan.type === 'PREMIUM' ? 'bg-yellow-500/10 text-yellow-300 border border-yellow-500/20' :
                          plan.type === 'VIP' ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20' :
                          'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                        }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {plan.type}
                      </motion.span>
                      <h3 className="mt-3 text-xl font-bold text-white">
                        {plan.name}
                      </h3>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        ${plan.cost.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-400">
                        por {plan.durationMonths} {plan.durationMonths === 1 ? 'mes' : 'meses'}
                      </div>
                    </div>
                  </div>
                  
                  <p className="mt-4 text-gray-400">
                    {plan.description || 'Sin descripción'}
                  </p>
                  
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <motion.button
                      onClick={() => handleViewPlan(plan)}
                      className="flex items-center justify-center px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 rounded-lg border border-gray-600/50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <EyeIcon className="w-4 h-4 mr-2" />
                      Ver
                    </motion.button>
                    <motion.button
                      onClick={() => handleEditPlan(plan)}
                      className="flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <PencilSquareIcon className="w-4 h-4 mr-2" />
                      Editar
                    </motion.button>
                    <motion.button
                      onClick={() => handleDeleteClick(plan)}
                      className="col-span-2 flex items-center justify-center px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-lg border border-red-600/20 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <TrashIcon className="w-4 h-4 mr-2" />
                      Eliminar
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
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
                className="bg-gray-800 rounded-lg w-full max-w-2xl p-6 mx-auto border border-gray-700 shadow-2xl"
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
          title="Eliminar Plan"
          message={`¿Estás seguro de que deseas eliminar el plan "${selectedPlan?.name}"? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          isProcessing={isProcessing}
          theme="dark"
        />

        <div className="mt-16 text-center">
          <p className="text-base font-medium text-gray-400">
            ¿Necesitas ayuda para elegir?{' '}
            <button
              onClick={() => {}}
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              Contáctanos
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MembershipPage;