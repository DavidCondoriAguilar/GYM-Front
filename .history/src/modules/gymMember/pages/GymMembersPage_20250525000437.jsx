import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import gymMemberService from '../services/gymMember.service';
import { toast } from 'sonner';

// Icons
import {
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserPlusIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

// Navigation items
const navigation = [
  { name: 'Dashboard', href: '#', icon: UserGroupIcon, current: false },
  { name: 'Miembros', href: '#', icon: UserGroupIcon, current: true },
  { name: 'Pagos', href: '#', icon: CurrencyDollarIcon, current: false },
  { name: 'Horarios', href: '#', icon: ClockIcon, current: false },
  { name: 'Nuevo Miembro', href: '#', icon: UserPlusIcon, current: false },
  { name: 'Configuración', href: '#', icon: Cog6ToothIcon, current: false },
];

// Status styles
const statusStyles = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  inactive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
};

// Mock data for demonstration
const mockMembers = [
  {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    phone: '+1234567890',
    membershipType: 'Mensual',
    status: 'active',
    joinDate: '2023-01-15',
    lastPayment: '2023-10-01',
    nextPayment: '2023-11-01',
  },
  {
    id: '2',
    name: 'María García',
    email: 'maria@example.com',
    phone: '+1234567891',
    membershipType: 'Anual',
    status: 'active',
    joinDate: '2023-03-22',
    lastPayment: '2023-10-01',
    nextPayment: '2024-10-01',
  },
  {
    id: '3',
    name: 'Carlos López',
    email: 'carlos@example.com',
    phone: '+1234567892',
    membershipType: 'Trimestral',
    status: 'pending',
    joinDate: '2023-09-10',
    lastPayment: '2023-09-10',
    nextPayment: '2023-12-10',
  },
];

const GymMembersPage = () => {
  // State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    membershipType: 'Mensual',
    status: 'active',
    joinDate: new Date().toISOString().split('T')[0],
    lastPayment: new Date().toISOString().split('T')[0],
    nextPayment: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
  });

  // Load members on component mount
  useEffect(() => {
    fetchMembers();
  }, []);

  // Open member modal for adding/editing
  const openMemberModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        email: member.email,
        phone: member.phone,
        membershipType: member.membershipType,
        status: member.status,
        joinDate: member.joinDate,
        lastPayment: member.lastPayment,
        nextPayment: member.nextPayment,
      });
    } else {
      setEditingMember(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        membershipType: 'Mensual',
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
        lastPayment: new Date().toISOString().split('T')[0],
        nextPayment: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
      });
    }
    setIsModalOpen(true);
  };

  // Fetch members from API
  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      // Simulate API call with mock data if needed
      const mockMembers = Array.from({ length: 12 }, (_, i) => ({
        id: `mem-${i + 1}`,
        name: `Member ${i + 1}`,
        email: `member${i + 1}@gym.com`,
        phone: `+57 3${Math.floor(1000000 + Math.random() * 9000000)}`,
        membershipType: ['Mensual', 'Trimestral', 'Anual'][Math.floor(Math.random() * 3)],
        status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)],
        joinDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
        lastPayment: new Date(Date.now() - Math.floor(Math.random() * 100000000)).toISOString(),
        nextPayment: new Date(Date.now() + Math.floor(Math.random() * 1000000000)).toISOString(),
      }));
      
      setMembers(mockMembers);
      toast.success('Miembros cargados exitosamente');
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Error al cargar los miembros');
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMember) {
        // Update existing member
        await gymMemberService.updateMember(editingMember.id, formData);
        toast.success('Miembro actualizado exitosamente');
      } else {
        // Create new member
        await gymMemberService.createMember(formData);
        toast.success('Miembro creado exitosamente');
      }
      
      setIsModalOpen(false);
      setEditingMember(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        membershipType: 'Mensual',
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
        lastPayment: new Date().toISOString().split('T')[0],
        nextPayment: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
      });
      
      fetchMembers();
    } catch (error) {
      console.error('Error saving member:', error);
      toast.error('Error al guardar el miembro');
    }
  };

  // Handle member deletion
  const handleDelete = async (id) => {
    try {
      await gymMemberService.deleteMember(id);
      toast.success('Miembro eliminado exitosamente');
      fetchMembers();
    } catch (error) {
      console.error('Error deleting member:', error);
      toast.error('Error al eliminar el miembro');
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filter members based on search text
  const filteredMembers = members.filter(member => {
    if (!searchText) return true;
    return (
      member.name.toLowerCase().includes(searchText.toLowerCase()) ||
      member.email.toLowerCase().includes(searchText.toLowerCase()) ||
      member.phone?.toLowerCase().includes(searchText.toLowerCase()) ||
      member.membershipType.toLowerCase().includes(searchText.toLowerCase())
    );
  });
  
  // Stats for the dashboard
  const stats = [
    { name: 'Total Miembros', value: members.length },
    { name: 'Activos', value: members.filter(m => m.status === 'active').length },
    { name: 'Pendientes', value: members.filter(m => m.status === 'pending').length },
    { name: 'Inactivos', value: members.filter(m => m.status === 'inactive').length },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile menu button */}
      <div className="lg:hidden">
        <button
          type="button"
          className="fixed top-4 left-4 z-50 p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="sr-only">Open sidebar</span>
          {mobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-gray-800 text-white transition-transform duration-300 ease-in-out lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 flex-shrink-0 items-center px-6">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-md bg-indigo-500 flex items-center justify-center">
                <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                  <path d="M12 4.75L19.25 9L12 13.25L4.75 9L12 4.75Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M9.25 12L4.75 15L12 19.25L19.25 15L14.75 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </div>
              <span className="ml-3 text-xl font-bold">FitPro</span>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="mt-6 px-3">
            <div className="space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href="#"
                  className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                    item.current
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-6 w-6 flex-shrink-0 ${
                      item.current ? 'text-indigo-400' : 'text-gray-400 group-hover:text-gray-300'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </a>
              ))}
            </div>
          </nav>
          
          {/* User profile */}
          <div className="mt-auto p-4 border-t border-gray-700">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                <span className="text-sm font-medium">AD</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Admin User</p>
                <button className="text-xs font-medium text-gray-400 hover:text-gray-200">
                  Ver perfil
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Miembros</h1>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                className="rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 flex items-center"
                onClick={() => openMemberModal()}
              >
                <PlusIcon className="h-5 w-5 mr-1" />
                Nuevo Miembro
              </button>
            </div>
          </div>
        </header>

        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Stats */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              {stats.map((stat) => (
                <div key={stat.name} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{stat.name}</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{stat.value}</dd>
                  </div>
                </div>
              ))}
            </div>

            {/* Search and filters */}
            <div className="mb-6 bg-white dark:bg-gray-800 shadow sm:rounded-lg p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative flex-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Buscar miembros..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                    onClick={fetchMembers}
                  >
                    <ArrowPathIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                    Actualizar
                  </button>
                </div>
              </div>
            </div>

            {/* Members table */}
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Contacto
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Membresía
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Estado
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Próximo Pago
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Acciones</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredMembers.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                              <span className="text-indigo-600 dark:text-indigo-200 font-medium">
                                {member.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">ID: {member.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{member.email}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{member.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            member.membershipType === 'Anual' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : member.membershipType === 'Trimestral'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                          }`}>
                            {member.membershipType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[member.status] || 'bg-gray-100 text-gray-800'}`}>
                            {member.status === 'active' ? 'Activo' : member.status === 'inactive' ? 'Inactivo' : 'Pendiente'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {member.nextPayment ? format(new Date(member.nextPayment), 'PPP', { locale: es }) : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => openMemberModal(member)}
                              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('¿Estás seguro de que deseas eliminar este miembro?')) {
                                  handleDelete(member.id);
                                }
                              }}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add/Edit Member Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              {/* Background overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                onClick={() => setIsModalOpen(false)}
              />

              {/* Modal panel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="inline-block transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-headline"
              >
                <div>
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white" id="modal-headline">
                      {editingMember ? 'Editar Miembro' : 'Nuevo Miembro'}
                    </h3>
                    <div className="mt-4">
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Nombre Completo
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Email
                            </label>
                            <input
                              type="email"
                              name="email"
                              id="email"
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              className="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Teléfono
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              id="phone"
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              className="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="membershipType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Tipo de Membresía
                            </label>
                            <select
                              id="membershipType"
                              name="membershipType"
                              value={formData.membershipType}
                              onChange={(e) => setFormData({...formData, membershipType: e.target.value})}
                              className="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                              <option value="Mensual">Mensual</option>
                              <option value="Trimestral">Trimestral</option>
                              <option value="Anual">Anual</option>
                            </select>
                          </div>
                          <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Estado
                            </label>
                            <select
                              id="status"
                              name="status"
                              value={formData.status}
                              onChange={(e) => setFormData({...formData, status: e.target.value})}
                              className="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                              <option value="active">Activo</option>
                              <option value="inactive">Inactivo</option>
                              <option value="pending">Pendiente</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label htmlFor="joinDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Fecha de Ingreso
                            </label>
                            <input
                              type="date"
                              name="joinDate"
                              id="joinDate"
                              value={formData.joinDate}
                              onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
                              className="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label htmlFor="lastPayment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Último Pago
                            </label>
                            <input
                              type="date"
                              name="lastPayment"
                              id="lastPayment"
                              value={formData.lastPayment}
                              onChange={(e) => setFormData({...formData, lastPayment: e.target.value})}
                              className="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label htmlFor="nextPayment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Próximo Pago
                            </label>
                            <input
                              type="date"
                              name="nextPayment"
                              id="nextPayment"
                              value={formData.nextPayment}
                              onChange={(e) => setFormData({...formData, nextPayment: e.target.value})}
                              className="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                    onClick={handleSubmit}
                  >
                    {editingMember ? 'Actualizar' : 'Crear'}
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2 text-base font-medium text-gray-700 dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GymMembersPage;
