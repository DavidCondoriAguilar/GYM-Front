import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import GymMemberService from '../services/gymMember.service';
import MemberForm from '../components/MemberForm';
import membershipPlanService from '../../membershipPlan/service/membershipPlan.service';

// Estilos reutilizables
const glassEffect = 'bg-white/5 backdrop-blur-lg border border-white/10';
const inputStyles = 'w-full px-4 py-2.5 rounded-xl bg-gray-800/50 border border-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200';
const buttonStyles = 'px-6 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2';
const primaryButton = 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 focus:ring-2 focus:ring-blue-500/50 focus:outline-none';
const secondaryButton = 'bg-gray-700/50 text-gray-200 hover:bg-gray-600/50 border border-gray-600/50 hover:border-gray-500/50';
const cardStyles = 'rounded-2xl p-6 shadow-2xl';
const labelStyles = 'block text-sm font-medium text-gray-300 mb-1.5';
const errorText = 'text-sm text-red-400 mt-1';
const loadingShimmer = 'animate-pulse bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 bg-[length:200%_100%]';

// Variantes de animación
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  },
  exit: { y: -20, opacity: 0 }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

const modalVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: 'spring',
      damping: 25,
      stiffness: 500 
    }
  },
  exit: { 
    y: 50, 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

const ModalCreateMember = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [membershipPlans, setMembershipPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);

  // Load membership plans on component mount
  useEffect(() => {
    const loadMembershipPlans = async () => {
      try {
        console.log('Fetching membership plans...');
        const response = await membershipPlanService.getPlans();
        // The service already returns the data directly, no need for .content
        const plans = Array.isArray(response) ? response : [];
        console.log('Plans received:', plans);
        
        setMembershipPlans(plans);
        if (plans.length > 0) {
          console.log('Setting selected plan:', plans[0]);
          setSelectedPlan(plans[0]);
        } else {
          console.warn('No membership plans available');
          toast.warning('No hay planes de membresía disponibles');
        }
      } catch (error) {
        console.error('Error loading membership plans:', error);
        toast.error('Error al cargar los planes de membresía: ' + (error.message || 'Error desconocido'));
      } finally {
        setIsLoadingPlans(false);
      }
    };

    loadMembershipPlans();
  }, []);

  const handleSave = async (formData) => {
    console.log('=== INICIO handleSave ===');
    console.log('Datos del formulario recibidos:', JSON.stringify(formData, null, 2));
    
    try {
      if (!selectedPlan) {
        const errorMsg = 'No hay plan de membresía seleccionado';
        console.error(errorMsg);
        toast.error('Por favor selecciona un plan de membresía');
        return;
      }
      
      console.log('Plan seleccionado:', JSON.stringify(selectedPlan, null, 2));

      console.log('Plan seleccionado:', selectedPlan);
      setIsSubmitting(true);
      
      // Asegurarse de que las fechas estén en el formato correcto (YYYY-MM-DD)
      const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };

      // Crear el objeto miembro con los datos del formulario
      const memberData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone?.trim() || '',
        active: formData.active !== false,
        registrationDate: formatDate(new Date()) || new Date().toISOString().split('T')[0],
        membershipStart: formatDate(formData.membershipStart) || new Date().toISOString().split('T')[0],
        membershipEnd: formatDate(formData.membershipEnd) || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        membershipPlan: {
          id: selectedPlan.id,
          name: selectedPlan.name,
          cost: selectedPlan.cost,
          durationMonths: selectedPlan.durationMonths
        },
        payments: [],
        membershipRecords: [],
        promotions: []
      };
      
      console.log('=== PREPARANDO DATOS PARA ENVIAR ===');
      console.log('Datos del miembro a enviar:', memberData);
      
      try {
        console.log('=== LLAMANDO AL SERVICIO ===');
        console.log('Endpoint del servicio:', GymMemberService.GYM_MEMBERS_ENDPOINT);
        
        // Validar que el servicio esté disponible
        if (typeof GymMemberService.createMember !== 'function') {
          throw new Error('El servicio de creación de miembros no está disponible');
        }
        
        console.log('Llamando a GymMemberService.createMember...');
        const newMember = await GymMemberService.createMember(memberData);
        
        console.log('=== RESPUESTA DEL SERVICIO ===');
        console.log('Miembro creado exitosamente:', newMember);
        
        toast.success('Miembro creado exitosamente');
        
        // Esperar un momento antes de cerrar para que el usuario vea el mensaje de éxito
        setTimeout(() => {
          console.log('Cerrando el modal...');
          handleClose();
        }, 1000);
      } catch (apiError) {
        console.error('Error en la llamada a la API:', apiError);
        console.error('Detalles del error:', {
          message: apiError.message,
          response: apiError.response?.data,
          status: apiError.response?.status
        });
        
        let errorMessage = 'Error al crear el miembro';
        if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        } else if (apiError.message) {
          errorMessage = apiError.message;
        }
        
        toast.error(errorMessage);
        throw apiError; // Re-lanzar el error para manejarlo en el catch externo
      }
      
    } catch (error) {
      console.error('=== ERROR EN handleSave ===');
      console.error('Tipo de error:', error?.constructor?.name);
      console.error('Mensaje de error:', error?.message);
      console.error('Error completo:', error);
      
      if (error.response) {
        console.error('Respuesta del servidor:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      }
      
      // Si el error ya fue manejado en el bloque try interno, no mostrar otro mensaje
      if (!error.handled) {
        const errorMessage = error.response?.data?.message || error.message || 'Error al crear el miembro';
        console.error('Mensaje de error para el usuario:', errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      console.log('=== FINALIZANDO handleSave ===');
      console.log('Estableciendo isSubmitting = false');
      setIsSubmitting(false);
      console.log('=== FIN ===');
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setIsOpen(false);
      navigate(-1);
    }
  };

  const handleOverlayClick = (e) => {
    if (!isSubmitting) {
      handleClose();
    }
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleCancel = () => {
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
          onClick={handleOverlayClick}
        />
        
        <motion.div
          className={`relative w-full max-w-xl ${glassEffect} ${cardStyles} mx-auto`}
          variants={modalVariants}
          onClick={handleModalClick}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                Nuevo Miembro
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Complete la información del nuevo miembro
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
              aria-label="Cerrar modal"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Membership Plan Selector */}
            <motion.div variants={itemVariants}>
              <label htmlFor="membershipPlan" className={labelStyles}>
                Plan de Membresía <span className="text-red-400">*</span>
              </label>
              {isLoadingPlans ? (
                <div className={`h-12 rounded-xl ${loadingShimmer}`}></div>
              ) : (
                <div className="relative">
                  <select
                    id="membershipPlan"
                    value={selectedPlan?.id || ''}
                    onChange={(e) => {
                      const plan = membershipPlans.find(p => p.id === e.target.value);
                      setSelectedPlan(plan || null);
                    }}
                    className={`${inputStyles} pr-10 appearance-none`}
                    required
                  >
                    <option value="">Seleccione un plan</option>
                    {membershipPlans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} - S/{plan.cost} ({plan.durationMonths} meses)
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              )}
            </motion.div>

            <MemberForm
              onSave={handleSave}
              isSubmitting={isSubmitting}
              className="space-y-5"
            />
            
            {/* Form Actions */}
            <motion.div 
              className="flex justify-end gap-3 pt-2"
              variants={itemVariants}
            >
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className={`${buttonStyles} ${secondaryButton}`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="member-form"
                disabled={isSubmitting}
                className={`${buttonStyles} ${primaryButton}`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </>
                ) : 'Guardare'}
              </button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModalCreateMember;
