export enum MembershipType {
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
  VIP = 'VIP'
}

export interface MembershipPlan {
  id: string;
  name: string;
  durationMonths: number;
  cost: number;
  description: string;
  type: MembershipType;
  gymMembers?: Array<{
    id: string;
    // Add other GymMember fields if needed
  }>;
}