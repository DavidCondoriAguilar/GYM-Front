import { MembershipPlan } from "./MembershipPlan";
import { MembershipRecord } from "./MembershipRecord";
import { Payment } from "./Payment";
import { Promotion } from "./Promotion";

export interface GymMember {
    id: string;
    name: string;
    email: string;
    phone?: string;
    active?: boolean;
    registrationDate?: string;
    membershipStart?: string;
    membershipEnd?: string;
    membershipPlan?: MembershipPlan;
    payments?: Payment[];
    membershipRecords?: MembershipRecord[];
    promotions?: Promotion[];
  }