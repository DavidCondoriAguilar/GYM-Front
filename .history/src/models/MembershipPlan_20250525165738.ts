export interface MembershipPlan {
    id: string;
    name: string;
    durationMonths: number;
    cost: number;
    description: string;
    type: string; // o enum si tienes tipos fijos
  }