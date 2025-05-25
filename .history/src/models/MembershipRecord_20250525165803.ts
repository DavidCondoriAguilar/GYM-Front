export interface MembershipRecord {
    id: string;
    gymMemberId: string;
    membershipPlanId: string;
    startDate: string;
    endDate: string;
    status: string;
    cancellationDate?: string | null;
  }