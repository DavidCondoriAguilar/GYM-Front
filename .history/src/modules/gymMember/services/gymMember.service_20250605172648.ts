// src/services/gymMemberService.ts

import { GymMember } from '@/models/GymMember';
import api from '../api/axiosInstance';
import { GYM_MEMBERS_ENDPOINT } from '../api/endpoints';

const GymMemberService = {
  getAllMembers: async (): Promise<GymMember[]> => {
    const { data } = await api.get<GymMember[]>(GYM_MEMBERS_ENDPOINT);
    return data;
  },

  getMemberById: async (id: string): Promise<GymMember> => {
    const { data } = await api.get<GymMember>(`${GYM_MEMBERS_ENDPOINT}/${id}`);
    return data;
  },

  createMember: async (memberData: Omit<GymMember, 'id'>): Promise<GymMember> => {
    const { data } = await api.post<GymMember>(GYM_MEMBERS_ENDPOINT, memberData);
    return data;
  },

  updateMember: async (id: string, memberData: Partial<GymMember>): Promise<GymMember> => {
    const { data } = await api.put<GymMember>(`${GYM_MEMBERS_ENDPOINT}/${id}`, memberData);
    return data;
  },

  deleteMember: async (id: string): Promise<void> => {
    await api.delete(`${GYM_MEMBERS_ENDPOINT}/${id}`);
  },
};

export default GymMemberService;
