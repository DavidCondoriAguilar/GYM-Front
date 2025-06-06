import React, { useState, useEffect } from 'react';
import membershipPlanService from '../service/membershipPlan.service';

const MembershipPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        console.log('Fetching membership plans...');
        const data = await membershipPlanService.getPlans();
        console.log('Received plans data:', data);
        setPlans(data);
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError(err.message || 'Error al cargar los planes');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    return <div>Cargando planes de membresía...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Planes de Membresía</h1>
      
      {plans.length === 0 ? (
        <p>No hay planes disponibles</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.id} className="border p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold">{plan.name}</h2>
              <p className="text-gray-600">{plan.description}</p>
              <p className="font-bold mt-2">${plan.price}/mes</p>
              <p>Duración: {plan.duration} días</p>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(plan, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MembershipPage;