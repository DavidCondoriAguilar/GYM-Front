import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import GymMemberService from '../services/gymMember.service';
import MemberForm from '../components/MemberForm';
import membershipPlanService from '../../membershipPlan/service/membershipPlan.service';

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

const ModalCreateMember = ({ onClose }) => {
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
    try {
      if (!selectedPlan) {
        toast.error('Por favor selecciona un plan de membresía');
        return;
      }

      setIsSubmitting(true);
      
      // Format the member data according to the API requirements
      const memberData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        active: formData.active !== false,
        registrationDate: new Date().toISOString().split('T')[0],
        membershipStart: formData.membershipStart,
        membershipEnd: formData.membershipEnd,
        membershipPlan: {
          id: selectedPlan.id
        },
        payments: [],
        membershipRecords: [],
        promotions: []
      };
      
      console.log('Creating member with data:', memberData);
      const newMember = await GymMemberService.createMember(memberData);
      
      toast.success('Miembro creado exitosamente');
      onClose?.(newMember);
      
    } catch (error) {
      console.error('Error creating member:', error);
      const errorMessage = error.response?.data?.message || 'Error al crear el miembro';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        
        <motion.div
          className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
          variants={modalVariants}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Nuevo Miembro
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              disabled={isSubmitting}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <div className="p-6">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <div className="space-y-6">
                {/* Membership Plan Selector */}
                <div>
                  <label htmlFor="membershipPlan" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Plan de Membresía *
                  </label>
                  {isLoadingPlans ? (
                    <div className="animate-pulse h-10 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                  ) : (
                    <select
                      id="membershipPlan"
                      value={selectedPlan?.id || ''}
                      onChange={(e) => {
                        const plan = membershipPlans.find(p => p.id === e.target.value);
                        setSelectedPlan(plan || null);
                      }}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-white"
                      required
                    >
                      <option value="">Seleccionar plan</option>
                      {membershipPlans.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                          {plan.name} - S/{plan.cost} ({plan.durationMonths} meses)
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <MemberForm
                  onSave={handleSave}
                  onCancel={onClose}
                  isSubmitting={isSubmitting}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModalCreateMember;
