import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { XMarkIcon, PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import membershipPlanService from '../service/membershipPlan.service';
import MembershipPlanForm from '../components/MembershipPlanForm';
import { MembershipType } from '../../../models/MembershipPlan';

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
      stiffness: 300
    }
  },
  exit: { 
    y: -50, 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

const ModalCreateMembership = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      await membershipPlanService.createPlan(formData);
      toast.success('Plan creado exitosamente', {
        description: 'El nuevo plan ha sido agregado correctamente.',
      });
      navigate('/membership-plans');
    } catch (error) {
      console.error('Error creating plan:', error);
      toast.error('Error al crear el plan', {
        description: error.message || 'Por favor, inténtalo de nuevo.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/membership-plans');
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto z-50"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={overlayVariants}
        onClick={handleCancel}
      >
        <motion.div 
          className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl my-8 relative border border-gray-700/50"
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div 
            className="px-8 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-2xl shadow-lg"
            variants={itemVariants}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <PlusIcon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  Nuevo Plan de Membresía
                </h2>
              </div>
              <motion.button
                onClick={handleCancel}
                className="p-1.5 rounded-full hover:bg-white/10 text-gray-200 hover:text-white transition-colors"
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Cerrar"
              >
                <XMarkIcon className="w-6 h-6" />
              </motion.button>
            </div>
          </motion.div>
          
          <motion.div 
            className="p-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <MembershipPlanForm
              onSave={handleSubmit}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
              initialData={{
                name: '',
                description: '',
                durationMonths: 1,
                cost: 0,
                type: MembershipType.STANDARD
              }}
              className="space-y-6"
            />
            
            <motion.div 
              className="mt-8 pt-6 border-t border-gray-700 flex justify-end space-x-3"
              variants={itemVariants}
            >
              <motion.button
                onClick={handleCancel}
                className="px-6 py-2.5 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500 hover:text-white transition-colors flex items-center space-x-2"
                whileHover={{ x: -2 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
              >
                <XMarkIcon className="w-5 h-5" />
                <span>Cancelar</span>
              </motion.button>
              <motion.button
                type="submit"
                form="membership-form"
                className={`px-6 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/20 flex items-center space-x-2 ${
                  isSubmitting ? 'opacity-80 cursor-not-allowed' : ''
                }`}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <ArrowPathIcon className="w-5 h-5 animate-spin" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <PlusIcon className="w-5 h-5" />
                    <span>Crear Plan</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModalCreateMembership;