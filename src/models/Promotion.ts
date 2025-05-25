export interface Promotion {
    id: string;
    name: string;
    discountPercentage: number;
    startDate: string;
    endDate: string;
    gymMemberIds: string[];
    totalWithDiscount: number;
  }
  