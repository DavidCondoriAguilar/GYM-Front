import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Input, Space, Typography, Modal, message } from 'antd';
import { PlusOutlined, SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PlanCard from '../components/PlanCard';
import membershipPlanService from '../membershipPlan.service';

const { Title } = Typography;
const { confirm } = Modal;

const MembershipPlanList = () => {
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    if (searchText) {
      const filtered = plans.filter(plan => 
        plan.name.toLowerCase().includes(searchText.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredPlans(filtered);
    } else {
      setFilteredPlans(plans);
    }
  }, [searchText, plans]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      // const data = await membershipPlanService.getPlans();
      
      // Mock data for now
      const mockPlans = [
        {
          id: '1',
          name: 'Plan Básico',
          description: 'Acceso a la zona de musculación en horario estándar.',
          price: 120,
          duration: 30,
          features: [
            'Acceso a zona de musculación',
            'Horario estándar (6:00 AM - 10:00 PM)',
            'Sin acceso a clases grupales',
            'Sin acceso a piscina',
            'Sin asesoría personalizada'
          ],
          isActive: true,
          isPopular: false,
          createdAt: '2023-01-15T00:00:00Z',
          updatedAt: '2023-01-15T00:00:00Z',
        },
        {
          id: '2',
          name: 'Plan Premium',
          description: 'Acceso ilimitado a todas las instalaciones y clases grupales.',
          price: 200,
          duration: 30,
          features: [
            'Acceso ilimitado a todas las zonas',
            'Horario extendido (5:00 AM - 11:00 PM)',
            'Acceso a todas las clases grupales',
            'Acceso a piscina y sauna',
            '1 sesión de asesoría personalizada al mes'
          ],
          isActive: true,
          isPopular: true,
          createdAt: '2023-01-15T00:00:00Z',
          updatedAt: '2023-01-15T00:00:00Z',
        },
        {
          id: '3',
          name: 'Plan Familiar',
          description: 'Ideal para familias, con descuento por grupo familiar.',
          price: 450,
          duration: 30,
          features: [
            'Hasta 4 personas por familia',
            'Acceso a todas las instalaciones',
            'Horario estándar',
            'Acceso a piscina',
            '10% de descuento en productos'
          ],
          isActive: true,
          isPopular: false,
          createdAt: '2023-01-15T00:00:00Z',
          updatedAt: '2023-01-15T00:00:00Z',
        },
      ];
      
      setPlans(mockPlans);
      setFilteredPlans(mockPlans);
    } catch (error) {
      console.error('Error fetching membership plans:', error);
      message.error('Error al cargar los planes de membresía');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleCreate = () => {
    navigate('/plans/new');
  };

  const handleEdit = (plan) => {
    navigate(`/plans/edit/${plan.id}`);
  };

  const handleDelete = (plan) => {
    confirm({
      title: '¿Estás seguro de eliminar este plan?',
      icon: <ExclamationCircleOutlined />,
      content: `El plan "${plan.name}" será eliminado permanentemente. Esta acción no se puede deshacer.`,
      okText: 'Sí, eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        return deletePlan(plan.id);
      },
    });
  };

  const deletePlan = async (id) => {
    try {
      // In a real app, this would be an API call
      // await membershipPlanService.deletePlan(id);
      
      // For now, just filter out the deleted plan
      const updatedPlans = plans.filter(plan => plan.id !== id);
      setPlans(updatedPlans);
      
      message.success('Plan eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting plan:', error);
      message.error('Error al eliminar el plan');
    }
  };

  const handleSelectPlan = (plan) => {
    // Handle plan selection (e.g., for purchase or assignment to a member)
    console.log('Selected plan:', plan);
    message.info(`Has seleccionado el plan: ${plan.name}`);
  };

  return (
    <div className="membership-plan-list">
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3}>Planes de Membresía</Title>
        </Col>
        <Col>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            Nuevo Plan
          </Button>
        </Col>
      </Row>
      
      <Space direction="vertical" style={{ width: '100%', marginBottom: 24 }}>
        <Input
          placeholder="Buscar planes..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
      </Space>

      <Row gutter={[16, 24]}>
        {filteredPlans.map(plan => (
          <Col key={plan.id} xs={24} sm={24} md={12} lg={8} xl={8}>
            <PlanCard 
              plan={plan}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSelect={handleSelectPlan}
            />
          </Col>
        ))}
      </Row>

      {filteredPlans.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <p>No se encontraron planes que coincidan con la búsqueda.</p>
        </div>
      )}
    </div>
  );
};

export default MembershipPlanList;
