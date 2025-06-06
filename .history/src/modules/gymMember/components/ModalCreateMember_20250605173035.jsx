// src/components/members/ModalCreateMember.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GymMemberService from '@/services/gymMemberService';
import api from '@/api/axiosInstance';

export default function ModalCreateMember() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    registrationDate: '',
    membershipStart: '',
    membershipEnd: '',
    membershipPlanId: '',
    promotionIds: [],
  });

  const [plans, setPlans] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar planes y promociones
  useEffect(() => {
    const fetchData = async () => {
      try {
        const planRes = await api.get('/membership-plans');
        const promoRes = await api.get('/promotions');
        setPlans(planRes.data);
        setPromotions(promoRes.data);
      } catch (err) {
        setError('Error al cargar planes o promociones');
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    if (name === 'promotionIds') {
      const newPromotions = [...formData.promotionIds];
      if (checked) {
        newPromotions.push(value);
      } else {
        const index = newPromotions.indexOf(value);
        if (index !== -1) newPromotions.splice(index, 1);
      }
      setFormData(prev => ({ ...prev, promotionIds: newPromotions }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        active: true,
        registrationDate: formData.registrationDate,
        membershipStart: formData.membershipStart,
        membershipEnd: formData.membershipEnd,
        membershipPlan: {
          id: formData.membershipPlanId,
        },
        promotions: formData.promotionIds.map(id => ({ id })),
      };

      await GymMemberService.createMember(payload as any); // Puedes tiparlo mejor si ajustas tu modelo
      navigate('/members');
    } catch (err: any) {
      setError(err.message || 'Error al crear miembro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Registrar Nuevo Miembro</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} required className="w-full border p-2 rounded" />
        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full border p-2 rounded" />
        <input name="phone" placeholder="Teléfono" value={formData.phone} onChange={handleChange} required className="w-full border p-2 rounded" />
        <input name="registrationDate" type="date" value={formData.registrationDate} onChange={handleChange} required className="w-full border p-2 rounded" />
        <input name="membershipStart" type="date" value={formData.membershipStart} onChange={handleChange} required className="w-full border p-2 rounded" />
        <input name="membershipEnd" type="date" value={formData.membershipEnd} onChange={handleChange} required className="w-full border p-2 rounded" />

        <div>
          <label className="block mb-1 font-medium">Plan de Membresía</label>
          <select name="membershipPlanId" value={formData.membershipPlanId} onChange={handleChange} required className="w-full border p-2 rounded">
            <option value="">-- Selecciona un plan --</option>
            {plans.map(plan => (
              <option key={plan.id} value={plan.id}>
                {plan.name} ({plan.durationMonths} meses - ${plan.cost})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Promociones</label>
          <div className="space-y-1">
            {promotions.map(promo => (
              <label key={promo.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="promotionIds"
                  value={promo.id}
                  onChange={handleChange}
                  checked={formData.promotionIds.includes(promo.id)}
                />
                <span>{promo.name} - {promo.discountPercentage}%</span>
              </label>
            ))}
          </div>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          {loading ? 'Creando...' : 'Crear Miembro'}
        </button>
      </form>
    </div>
  );
}
