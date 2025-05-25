import React, { useState, useEffect } from 'react';
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
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import gymMemberService from '../services/gymMember.service';

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
  
  // Filter members based on search term
  const filteredMembers = members.filter(member => 
    member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone?.includes(searchTerm)
  );
  
  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.active).length;

  // Fetch members
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

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
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Miembros del Gimnasio</h1>
            <p className="mt-1 text-gray-400">
              {totalMembers} miembros en total • {activeMembers} activos
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
                className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Buscar miembros..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Nuevo Miembro
            </motion.button>
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
            className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-500/20">
                <UserGroupIcon className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-200">Total Miembros</p>
                <p className="text-2xl font-bold text-white">{totalMembers}</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            variants={item}
            className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-500/20">
                <CheckCircleIcon className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-green-200">Miembros Activos</p>
                <p className="text-2xl font-bold text-white">{activeMembers}</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            variants={item}
            className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-500/20">
                <ArrowTopRightOnSquareIcon className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-200">Nuevos Hoy</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            variants={item}
            className="bg-gradient-to-br from-amber-600 to-amber-800 p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-amber-500/20">
                <XCircleIcon className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-amber-200">Inactivos</p>
                <p className="text-2xl font-bold text-white">{totalMembers - activeMembers}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 shadow-xl rounded-xl overflow-hidden border border-gray-700"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
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
              <tbody>
                <AnimatePresence>
                  {filteredMembers.map((member) => (
                    <motion.tr 
                      key={member.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="hover:bg-gray-700/50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <UserCircleIcon className="h-10 w-10 text-gray-400" aria-hidden="true" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{member.name}</div>
                            <div className="text-xs text-gray-400">Registrado el {new Date(member.registrationDate).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-300">
                          <EnvelopeIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {member.email}
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-400">
                          <PhoneIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {member.phone || 'Sin teléfono'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {member.membershipPlan?.name || 'Sin membresía'}
                        </div>
                        {member.membershipEnd && (
                          <div className="text-xs text-gray-400">
                            Vence: {new Date(member.membershipEnd).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {member.active ? (
                          <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900/30 text-green-400 border border-green-800">
                            <CheckCircleIcon className="-ml-0.5 mr-1.5 h-3.5 w-3.5 text-green-400" />
                            Activo
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-900/30 text-red-400 border border-red-800">
                            <XCircleIcon className="-ml-0.5 mr-1.5 h-3.5 w-3.5 text-red-400" />
                            Inactivo
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-blue-400 hover:text-blue-300 mr-4"
                          title="Editar miembro"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-red-400 hover:text-red-300"
                          title="Eliminar miembro"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                  {filteredMembers.length === 0 && (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-32"
                    >
                      <td colSpan={5} className="text-center py-10">
                        <UserGroupIcon className="mx-auto h-12 w-12 text-gray-600" />
                        <p className="mt-2 text-sm text-gray-400">
                          {searchTerm ? 'No se encontraron miembros que coincidan con la búsqueda' : 'No hay miembros registrados'}
                        </p>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
        
        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Mostrando <span className="font-medium">1</span> a <span className="font-medium">{filteredMembers.length}</span> de <span className="font-medium">{totalMembers}</span> miembros
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
              Anterior
            </button>
            <button className="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
              Siguiente
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}