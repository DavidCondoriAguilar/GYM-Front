import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import gymMemberService from '../services/gymMember.service';

const useGymMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [viewMode, setViewMode] = useState('table');

  // Fetch members from API
  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await gymMemberService.getAllMembers();
      setMembers(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching members:', err);
      setError('Error al cargar los miembros. Inténtalo de nuevo.');
      toast.error('Error al cargar los miembros');
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter members based on search term
  const filteredMembers = useMemo(() => {
    if (!searchTerm.trim()) return members;
    
    const term = searchTerm.toLowerCase();
    return members.filter(member => 
      member.name?.toLowerCase().includes(term) ||
      member.email?.toLowerCase().includes(term) ||
      member.phone?.includes(term)
    );
  }, [members, searchTerm]);

  // Count new members registered today
  const newMembersCount = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return members.filter(member => member.registrationDate === today).length;
  }, [members]);

  // Count active members
  const activeMembersCount = useMemo(() => {
    return members.filter(member => member.active).length;
  }, [members]);

  // Calculate total monthly revenue
  const monthlyRevenue = useMemo(() => {
    return members
      .filter(member => member.active && member.monthlyFee)
      .reduce((sum, member) => sum + (member.monthlyFee || 0), 0);
  }, [members]);

  // Delete a member
  const deleteMember = async (memberId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este miembro?')) {
      return;
    }

    try {
      await gymMemberService.deleteMember(memberId);
      setMembers(prev => prev.filter(m => m.id !== memberId));
      toast.success('Miembro eliminado correctamente');
    } catch (err) {
      console.error('Error deleting member:', err);
      toast.error('Error al eliminar el miembro');
    }
  };

  // Initialize
  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return {
    members,
    filteredMembers,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedMember,
    setSelectedMember,
    viewMode,
    setViewMode,
    newMembersCount,
    activeMembersCount,
    monthlyRevenue,
    deleteMember,
    refreshMembers: fetchMembers
  };
};

export default useGymMembers;
