import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import paymentService from '../services/payment.service';
import { Payment, PaymentStatus } from '../models/Payment';
import { PAYMENTS_ENDPOINT } from '../api/endpoints';

const usePayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [viewMode, setViewMode] = useState('table');

  // Fetch payments from API
  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching payments from:', PAYMENTS_ENDPOINT);
      const data = await paymentService.getAllPayments();
      console.log('Payments received:', data);
      setPayments(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching payments:', err);
      console.error('Error details:', {
        message: err.message,
        status: err.status,
        data: err.data,
        isAxiosError: err.isAxiosError
      });
      setError('Error al cargar los pagos. Inténtalo de nuevo.');
      toast.error('Error al cargar los pagos');
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter payments based on search term
  const filteredPayments = useMemo(() => {
    if (!searchTerm.trim()) return payments;
    
    const term = searchTerm.toLowerCase();
    return payments.filter(payment => 
      payment.gymMemberId?.toLowerCase().includes(term) ||
      payment.paymentMethod?.toLowerCase().includes(term) ||
      payment.status?.toLowerCase().includes(term)
    );
  }, [payments, searchTerm]);

  // Count new payments made today
  const newPaymentsCount = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return payments.filter(payment => payment.paymentDate === today).length;
  }, [payments]);

  // Count active payments
  const activePaymentsCount = useMemo(() => {
    return payments.filter(payment => payment.status === PaymentStatus.PENDIENTE).length;
  }, [payments]);

  // Calculate total monthly revenue
  const monthlyRevenue = useMemo(() => {
    return payments
      .filter(payment => payment.status === PaymentStatus.COMPLETADO && payment.amount)
      .reduce((sum, payment) => sum + (payment.amount || 0), 0);
  }, [payments]);

  // Delete a payment
  const deletePayment = async (paymentId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este pago?')) {
      return;
    }

    try {
      await paymentService.deletePayment(paymentId);
      setPayments(prev => prev.filter(p => p.id !== paymentId));
      toast.success('Pago eliminado correctamente');
    } catch (err) {
      console.error('Error deleting payment:', err);
      toast.error('Error al eliminar el pago');
    }
  };

  // Initialize
  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return {
    payments,
    filteredPayments,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedPayment,
    setSelectedPayment,
    viewMode,
    setViewMode,
    newPaymentsCount,
    activePaymentsCount,
    monthlyRevenue,
    deletePayment,
    refreshPayments: fetchPayments,
    fetchPayments
  };
};

export default usePayments;
