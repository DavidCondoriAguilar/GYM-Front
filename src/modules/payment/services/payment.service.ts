import api from '../api/axiosInstance';
import { PAYMENTS_ENDPOINT } from '../api/endpoints';
import { Payment } from '../models/Payment';

const PaymentService = {
  createPayment: async (paymentData: Omit<Payment, 'id'>): Promise<Payment> => {
    const { data } = await api.post<Payment>(PAYMENTS_ENDPOINT, paymentData);
    return data;
  },

  getPaymentById: async (id: string): Promise<Payment> => {
    const { data } = await api.get<Payment>(`${PAYMENTS_ENDPOINT}/${id}`);
    return data;
  },

  getAllPayments: async (): Promise<Payment[]> => {
    const { data } = await api.get<Payment[]>(PAYMENTS_ENDPOINT);
    return data;
  },

  updatePayment: async (id: string, paymentData: Partial<Payment>): Promise<Payment> => {
    const { data } = await api.put<Payment>(`${PAYMENTS_ENDPOINT}/${id}`, paymentData);
    return data;
  },

  deletePayment: async (id: string): Promise<void> => {
    await api.delete(`${PAYMENTS_ENDPOINT}/${id}`);
  }
};

export default PaymentService;
