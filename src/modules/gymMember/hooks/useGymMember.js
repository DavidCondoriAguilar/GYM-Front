import { useState, useCallback } from 'react';
import { message } from 'antd';

// This would typically be an API service call
const mockApi = {
  getMembers: async () => {
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            firstName: 'Juan',
            lastName: 'Pérez',
            email: 'juan@example.com',
            phone: '+51 999 888 777',
            membershipPlan: { id: '1', name: 'Premium' },
            status: 'active',
            birthDate: '1990-01-01',
            gender: 'male',
            address: 'Av. Ejemplo 123',
            notes: 'Cliente frecuente',
            createdAt: '2023-01-15T00:00:00Z',
            updatedAt: '2023-01-15T00:00:00Z',
          },
          // Add more mock data as needed
        ]);
      }, 500);
    });
  },
  
  getMemberById: async (id) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id,
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan@example.com',
          phone: '+51 999 888 777',
          membershipPlan: { id: '1', name: 'Premium' },
          status: 'active',
          birthDate: '1990-01-01',
          gender: 'male',
          address: 'Av. Ejemplo 123',
          notes: 'Cliente frecuente',
          createdAt: '2023-01-15T00:00:00Z',
          updatedAt: '2023-01-15T00:00:00Z',
        });
      }, 500);
    });
  },
  
  createMember: async (data) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ...data,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }, 500);
    });
  },
  
  updateMember: async (id, data) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id,
          ...data,
          updatedAt: new Date().toISOString(),
        });
      }, 500);
    });
  },
  
  deleteMember: async (id) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  },
};

const useGymMember = () => {
  const [members, setMembers] = useState([]);
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMembers = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await mockApi.getMembers(params);
      setMembers(data);
      return data;
    } catch (err) {
      console.error('Error fetching members:', err);
      setError('Error al cargar los miembros');
      message.error('Error al cargar los miembros');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMemberById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await mockApi.getMemberById(id);
      setMember(data);
      return data;
    } catch (err) {
      console.error(`Error fetching member with id ${id}:`, err);
      setError('Error al cargar el miembro');
      message.error('Error al cargar el miembro');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createMember = useCallback(async (memberData) => {
    try {
      setLoading(true);
      setError(null);
      const newMember = await mockApi.createMember(memberData);
      setMembers(prev => [...prev, newMember]);
      message.success('Miembro creado exitosamente');
      return newMember;
    } catch (err) {
      console.error('Error creating member:', err);
      setError('Error al crear el miembro');
      message.error('Error al crear el miembro');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMember = useCallback(async (id, updates) => {
    try {
      setLoading(true);
      setError(null);
      const updatedMember = await mockApi.updateMember(id, updates);
      
      setMembers(prev => 
        prev.map(m => m.id === id ? { ...m, ...updatedMember } : m)
      );
      
      if (member && member.id === id) {
        setMember(prev => ({ ...prev, ...updatedMember }));
      }
      
      message.success('Miembro actualizado exitosamente');
      return updatedMember;
    } catch (err) {
      console.error(`Error updating member with id ${id}:`, err);
      setError('Error al actualizar el miembro');
      message.error('Error al actualizar el miembro');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [member]);

  const deleteMember = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await mockApi.deleteMember(id);
      
      setMembers(prev => prev.filter(m => m.id !== id));
      
      if (member && member.id === id) {
        setMember(null);
      }
      
      message.success('Miembro eliminado exitosamente');
      return true;
    } catch (err) {
      console.error(`Error deleting member with id ${id}:`, err);
      setError('Error al eliminar el miembro');
      message.error('Error al eliminar el miembro');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [member]);

  return {
    members,
    member,
    loading,
    error,
    fetchMembers,
    fetchMemberById,
    createMember,
    updateMember,
    deleteMember,
  };
};

export default useGymMember;
