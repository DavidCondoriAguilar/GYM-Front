export interface Payment {
    id: string;
    gymMemberId: string;
    amount: number;
    paymentDate: string; // o Date si parseas
    paymentMethod: string; // mejor enum
    status: string; // mejor enum
  }