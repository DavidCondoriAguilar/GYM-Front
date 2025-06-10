import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  ArrowTopRightOnSquareIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ClockIcon,
  TagIcon,
  XMarkIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import ModalConfirm from '../components/ModalConfirm';
import gymMemberService from '../services/gymMember.service';
import GymMemberDetail from './GymMemberDetail';

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export default function GymMembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const navigate = useNavigate();

  // Filter and sort members
  const filteredMembers = useMemo(() => {
    const filtered = members.filter(member => 
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone?.includes(searchTerm)
    );
    
    // Sort by registration date (newest first)
    return [...filtered].sort((a, b) => 
      new Date(b.registrationDate) - new Date(a.registrationDate)
    );
  }, [members, searchTerm]);

  // Calculate total pages after filteredMembers is available
  const totalPages = useMemo(() => Math.ceil(filteredMembers.length / itemsPerPage), [filteredMembers, itemsPerPage]);

  // Stats calculations
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const total = members.length;
    const active = members.filter(m => m.active).length;
    const newToday = members.filter(member => 
      new Date(member.registrationDate).toISOString().split('T')[0] === today
    ).length;
    
    // Calculate total revenue from payments
    const totalRevenue = members.reduce((sum, member) => {
      if (!member.payments) return sum;
      return sum + member.payments.reduce((memberSum, payment) => 
        memberSum + (payment.amount || 0), 0
      );
    }, 0);
    
    return { total, active, newToday, totalRevenue };
  }, [members]);

  const { total: totalMembers, active: activeMembers, newToday: newTodayCount, totalRevenue } = stats;

  // Fetch members
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    // Función para formatear fechas sin desfase de zona horaria
    const formatDate = (dateString) => {
      if (!dateString) return '';
      // Añadimos la hora media del día en UTC para evitar desfases
      const date = new Date(dateString + 'T12:00:00Z');
      return date.toLocaleDateString('es-ES', { timeZone: 'UTC' });
    };

    const fetchMembers = async () => {
      if (!isMounted) return;
      
      try {
        setLoading(true);
        setError(null);
        console.log('Initiating members fetch...');
        
        const membersData = await gymMemberService.getAllMembers();
        console.log('Members data received:', membersData);
        
        if (!isMounted) return;
        
        // Ensure we have valid data
        if (!membersData) {
          throw new Error('No se recibieron datos');
        }
        
        // Check if membersData is an array or has a data property that's an array
        const membersArray = Array.isArray(membersData) 
          ? membersData 
          : (Array.isArray(membersData?.data) ? membersData.data : null);
        
        if (!membersArray) {
          console.error('Unexpected response format:', membersData);
          throw new Error('Formato de respuesta inesperado del servidor');
        }
        
        setMembers(membersArray);
        if (membersArray.length > 0) {
          toast.success(`${membersArray.length} miembros cargados exitosamente`);
        } else {
          toast.info('No hay miembros registrados');
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('Request was cancelled');
          return;
        }
        
        console.error('Error fetching members:', err);
        if (!isMounted) return;
        
        const errorMessage = err?.message || 'Error al cargar los miembros';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMembers();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-[60vh] bg-gray-900 p-6 rounded-xl"
      >
        <div className="text-center">
          <ArrowPathIcon className="w-16 h-16 mx-auto text-blue-400 animate-spin" />
          <p className="mt-4 text-lg font-medium text-gray-200">Cargando miembros...</p>
          <p className="mt-1 text-sm text-gray-400">Por favor espere un momento</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl p-8 mx-auto mt-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700"
      >
        <div className="text-center">
          <ExclamationTriangleIcon className="w-16 h-16 mx-auto text-red-400" />
          <h2 className="mt-4 text-2xl font-bold text-gray-100">Error al cargar los miembros</h2>
          <p className="mt-2 text-gray-300">{error}</p>
          <div className="mt-6">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRetry}
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <ArrowPathIcon className="w-5 h-5 mr-2" />
              Reintentar
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="h-full p-4 sm:p-6 bg-gray-900">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto h-full flex flex-col"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Miembros del Gimnasio
            </h1>
            <p className="mt-1 text-gray-400">
              {totalMembers} miembros en total • {activeMembers} activos • {newTodayCount} nuevos hoy
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Buscar por nombre, email o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-lg text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
              >
                {viewMode === 'table' ? (
                  <>
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Cuadrícula
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    Tabla
                  </>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/members/new')}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                Nuevo Miembro
              </motion.button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          <motion.div 
            variants={item}
            className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl shadow-lg border border-blue-700/50 hover:border-blue-500/50 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-500/20">
                  <UserGroupIcon className="h-6 w-6 text-blue-200" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-100">Total Miembros</p>
                  <p className="text-2xl font-bold text-white">{totalMembers}</p>
                </div>
              </div>
              <div className="text-blue-200 bg-blue-900/30 px-2 py-1 rounded-md text-xs">
                +{newTodayCount} hoy
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-blue-700/50">
              <p className="text-xs text-blue-200 flex items-center">
                <ArrowPathIcon className="h-3 w-3 mr-1" />
                Actualizado ahora
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            variants={item}
            className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-xl shadow-lg border border-green-700/50 hover:border-green-500/50 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-500/20">
                  <CheckCircleIcon className="h-6 w-6 text-green-200" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-100">Miembros Activos</p>
                  <p className="text-2xl font-bold text-white">{activeMembers}</p>
                </div>
              </div>
              <div className="text-green-200 bg-green-900/30 px-2 py-1 rounded-md text-xs">
                {Math.round((activeMembers / (totalMembers || 1)) * 100)}%
              </div>
            </div>
            <div className="mt-4 pt-3">
              <div className="w-full bg-green-900/30 rounded-full h-1.5">
                <div 
                  className="bg-green-400 h-1.5 rounded-full" 
                  style={{ width: `${(activeMembers / (totalMembers || 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            variants={item}
            className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-xl shadow-lg border border-purple-700/50 hover:border-purple-500/50 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-500/20">
                  <CurrencyDollarIcon className="h-6 w-6 text-purple-200" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-purple-100">Ingresos Totales</p>
                  <p className="text-2xl font-bold text-white">
                    {new Intl.NumberFormat('es-PE', {
                      style: 'currency',
                      currency: 'PEN'
                    }).format(totalRevenue)}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-purple-700/50">
              <p className="text-xs text-purple-200 flex items-center">
                <ClockIcon className="h-3 w-3 mr-1" />
                Actualizado hoy
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            variants={item}
            className="bg-gradient-to-br from-amber-600 to-amber-800 p-6 rounded-xl shadow-lg border border-amber-700/50 hover:border-amber-500/50 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-amber-500/20">
                  <XCircleIcon className="h-6 w-6 text-amber-200" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-amber-100">Miembros Inactivos</p>
                  <p className="text-2xl font-bold text-white">{totalMembers - activeMembers}</p>
                </div>
              </div>
              <div className="text-amber-200 bg-amber-900/30 px-2 py-1 rounded-md text-xs">
                {Math.round(((totalMembers - activeMembers) / (totalMembers || 1)) * 100)}%
              </div>
            </div>
            <div className="mt-4 pt-3">
              <div className="w-full bg-amber-900/30 rounded-full h-1.5">
                <div 
                  className="bg-amber-400 h-1.5 rounded-full" 
                  style={{ width: `${((totalMembers - activeMembers) / (totalMembers || 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Members Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 shadow-xl rounded-xl overflow-hidden border border-gray-700 flex-1 flex flex-col"
        >
          <div className="overflow-x-auto flex-1">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-850">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Miembro
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Membresía
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="relative px-6 py-4">
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                <AnimatePresence>
                  {filteredMembers
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((member) => (
                    <motion.tr 
                      key={member.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-gray-750/50 cursor-pointer"
                      onClick={() => setSelectedMember(member)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {member.photoUrl ? (
                              <img className="h-10 w-10 rounded-full" src={member.photoUrl} alt={member.name} />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
                                <UserCircleIcon className="h-6 w-6" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                              {member.name}
                            </div>
                            <div className="text-xs text-gray-400">ID: {member.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{member.email}</div>
                        <div className="text-xs text-gray-400 flex items-center mt-1">
                          <PhoneIcon className="h-3 w-3 mr-1" />
                          {member.phone || 'Sin teléfono'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {member.membershipPlan?.name || 'Sin membresía'}
                        </div>
                        <div className="text-xs text-gray-400">
                          {member.membershipEnd ? `Vence: ${new Date(member.membershipEnd).toLocaleDateString()}` : 'Sin fecha de vencimiento'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          member.active 
                            ? 'bg-green-900/30 text-green-400 border border-green-800'
                            : 'bg-red-900/30 text-red-400 border border-red-800'
                        }`}>
                          {member.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 p-1.5 rounded-lg transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle edit
                            }}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button 
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-1.5 rounded-lg transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMemberToDelete(member);
                            }}
                            title="Eliminar miembro"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="bg-gray-850 px-6 py-3 flex items-center justify-between border-t border-gray-700">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  Mostrando {currentPage * itemsPerPage - itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, filteredMembers.length)} de{' '}
                  <span className="font-medium">{filteredMembers.length}</span> resultados
                </p>
              </div>
              <div className="flex items-center">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentPage === 1 
                      ? 'text-gray-400 bg-gray-800 cursor-not-allowed'
                      : 'text-blue-400 hover:bg-blue-900/20 transition-colors'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      page === currentPage 
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:bg-blue-900/20 transition-colors'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentPage === totalPages 
                      ? 'text-gray-400 bg-gray-800 cursor-not-allowed'
                      : 'text-blue-400 hover:bg-blue-900/20 transition-colors'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Member Details Modal */}
        {selectedMember && (
          <GymMemberDetail 
            member={selectedMember} 
            onClose={() => setSelectedMember(null)} 
          />
        )}

        {/* Delete Confirmation Modal */}
        <ModalConfirm
          isOpen={!!memberToDelete}
          onClose={() => setMemberToDelete(null)}
          onConfirm={async () => {
            if (!memberToDelete) return;
            try {
              setLoading(true);
              await gymMemberService.deleteMember(memberToDelete.id);
              setMembers(members.filter(m => m.id !== memberToDelete.id));
              setMemberToDelete(null);
            } catch (error) {
              console.error('Error deleting member:', error);
              throw error; // This will be caught by the ModalConfirm component
            } finally {
              setLoading(false);
            }
          }}
          memberName={memberToDelete?.name || 'este miembro'}
        />
      </motion.div>
    </div>
  );
};