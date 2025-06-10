export enum PaymentMethod {
  EFECTIVO = 'EFECTIVO',
  TARJETA_CREDITO = 'TARJETA_CREDITO',
  TRANSFERENCIA = 'TRANSFERENCIA'
}

export enum PaymentStatus {
  PENDIENTE = 'PENDIENTE',
  COMPLETADO = 'COMPLETADO'
}

export interface Payment {
  id: string;
  gymMemberId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  discountedAmount?: number;
}

export interface CreatePaymentDto {
  gymMemberId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  discountedAmount?: number;
}

export interface UpdatePaymentDto {
  status?: PaymentStatus;
  amount?: number;
  paymentMethod?: PaymentMethod;
  discountedAmount?: number;
}
