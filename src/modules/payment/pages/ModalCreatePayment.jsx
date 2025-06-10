import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import paymentService from '../services/payment.service';
import { toast } from "sonner";
import { PaymentMethod } from "../models/Payment";

const getMemberDetails = async (memberId) => {
  try {
    // Obtener miembro
    const memberResponse = await fetch(`http://localhost:8080/members/${memberId}`);
    if (!memberResponse.ok) throw new Error('Error al obtener el miembro');
    const member = await memberResponse.json();

    // Obtener pagos usando el servicio existente
    const payments = await paymentService.getPaymentsByMemberId(memberId);
    
    // Calcular totales
    const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalDue = member.balance + totalPaid;
    
    return {
      balance: member.balance || 0,
      totalPaid: totalPaid,
      totalDue: totalDue,
      memberName: member.name || 'Miembro no encontrado'
    };
  } catch (error) {
    console.error('Error getting member details:', error);
    throw error;
  }
};

const ModalCreatePayment = ({ isOpen, onClose, gymMemberId, onRefresh }) => {
  const [formData, setFormData] = useState({
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: PaymentMethod.EFECTIVO,
    status: 'PENDIENTE',
    gymMemberId: ''
  });
  const [loading, setLoading] = useState(false);
  const [memberDetails, setMemberDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('Campo cambiado:', name, value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Obtener detalles del miembro
  useEffect(() => {
    if (formData.gymMemberId && formData.gymMemberId.length > 0) {
      setLoadingDetails(true);
      getMemberDetails(formData.gymMemberId)
        .then(details => {
          setMemberDetails(details);
        })
        .catch(error => {
          toast.error('Error al obtener los detalles del miembro');
          setMemberDetails(null);
        })
        .finally(() => {
          setLoadingDetails(false);
        });
    }
  }, [formData.gymMemberId]);

  const validateForm = () => {
    if (!formData.gymMemberId) {
      toast.error('Debe ingresar el ID del miembro');
      return false;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('El monto debe ser mayor a 0');
      return false;
    }
    if (!formData.paymentMethod) {
      toast.error('Debe seleccionar un método de pago');
      return false;
    }
    if (memberDetails && parseFloat(formData.amount) > memberDetails.balance) {
      toast.error(`El monto excede el saldo pendiente (${memberDetails.balance.toFixed(2)})`);
      return false;
    }
    return true;
  };

  const handleErrors = (error) => {
    console.error('=== Error al crear el pago ===');
    console.error('Error:', error);
    console.error('Mensaje:', error.response?.data?.message);
    console.error('Estado:', error.response?.status);
    
    let errorMessage = 'Error al crear el pago';
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    toast.error(errorMessage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validar campos
      if (!validateForm()) {
        return;
      }

      const paymentData = {
        gymMemberId: formData.gymMemberId,
        amount: parseFloat(formData.amount),
        paymentDate: formData.paymentDate,
        paymentMethod: formData.paymentMethod,
        status: formData.status
      };

      console.log('=== Datos del formulario ===');
      console.log('formData:', formData);
      console.log('=== Datos enviados al backend ===');
      console.log('paymentData:', paymentData);
      
      const response = await paymentService.createPayment(paymentData);
      console.log('=== Respuesta del servidor ===');
      console.log('response:', response);
      
      toast.success('Pago creado exitosamente');
      onClose();
      onRefresh && onRefresh();
    } catch (error) {
      handleErrors(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-gray-800 rounded-lg p-6 max-w-md w-full"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Nuevo Pago</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  ID del Miembro
                </label>
                <input
                  type="text"
                  name="gymMemberId"
                  value={formData.gymMemberId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Ingrese el ID del miembro"
                />
                {loadingDetails ? (
                  <div className="mt-2 flex justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  </div>
                ) : memberDetails ? (
                  <div className="mt-4 space-y-4">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-300 mb-2">Detalles del Miembro</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-400">Nombre:</p>
                          <p className="font-medium text-white">{memberDetails.memberName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Total a Pagar:</p>
                          <p className="font-medium text-white">S/. {memberDetails.totalDue.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Total Pagado:</p>
                          <p className="font-medium text-white">S/. {memberDetails.totalPaid.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Saldo Pendiente:</p>
                          <p className="font-medium text-white">S/. {memberDetails.balance.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Monto
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">S/.</span>
                  </div>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full pl-8 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Fecha de Pago
                </label>
                <input
                  type="date"
                  name="paymentDate"
                  value={formData.paymentDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Método de Pago
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value={PaymentMethod.EFECTIVO}>Efectivo</option>
                  <option value={PaymentMethod.TARJETA_CREDITO}>Tarjeta de Crédito</option>
                  <option value={PaymentMethod.TRANSFERENCIA}>Transferencia</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Creando...' : 'Crear Pago'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalCreatePayment;