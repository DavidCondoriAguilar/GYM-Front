import React, { useState, useEffect } from 'react';
import { MembershipType } from "../../../models/MembershipPlan";
import { DocumentTextIcon, CalendarIcon, CurrencyDollarIcon, HashtagIcon, TagIcon } from '@heroicons/react/24/outline';

const MembershipPlanForm = ({ plan, onSave, onCancel, isSubmitting, className = '' }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    durationMonths: 1,
    cost: 0,
    type: MembershipType.STANDARD
  });

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name || '',
        description: plan.description || '',
        durationMonths: plan.durationMonths || 1,
        cost: plan.cost ,
        type: plan.type || MembershipType.STANDARD
      });
    }
  }, [plan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'durationMonths' || name === 'cost' ? Number(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white">
          {plan?.id ? 'Editar Plan' : 'Nuevo Plan'}
        </h2>
        <p className="text-sm text-gray-400">
          Completa los detalles del plan de membresía
        </p>
      </div>
      <form onSubmit={handleSubmit} id="membership-form" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-5">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Nombre del Plan
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <TagIcon className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Ej: Plan Premium"
                  required
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Tipo de Membresía
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DocumentTextIcon className="h-5 w-5 text-indigo-400" />
                </div>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                  required
                >
                  {Object.values(MembershipType).map((type) => (
                    <option key={type} value={type} className="bg-gray-800 text-white">
                      {type}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Duración (meses)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  type="number"
                  name="durationMonths"
                  min="1"
                  value={formData.durationMonths}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Ej: 6"
                  required
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Costo (USD)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CurrencyDollarIcon className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  type="number"
                  name="cost"
                  min="0"
                  step="0.01"
                  value={formData.cost}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Descripción
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3">
              <DocumentTextIcon className="h-5 w-5 text-indigo-400" />
            </div>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Describe los beneficios y características del plan..."
              required
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default MembershipPlanForm;
