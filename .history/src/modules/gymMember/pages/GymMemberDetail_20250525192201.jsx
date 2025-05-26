import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, Descriptions, Button, Row, Col, Tabs, message, Spin, Tag } from 'antd';
import { 
  EditOutlined, 
  ArrowLeftOutlined, 
  IdcardOutlined, 
  CalendarOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import useGymMember from '../hooks/useGymMember';

const { TabPane } = Tabs;

const GymMemberDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const { 
    member, 
    loading: memberLoading, 
    fetchMemberById 
  } = useGymMember();

  useEffect(() => {
    const loadMember = async () => {
      try {
        await fetchMemberById(id);
      } catch (error) {
        message.error('Error al cargar los datos del miembro');
        console.error('Error loading member:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadMember();
  }, [id, fetchMemberById]);

  const handleBack = () => {
    navigate(-1);
  };

  const getStatusTag = (status) => {
    switch(status) {
      case 'active':
        return <Tag color="success">Activos</Tag>;
      case 'inactive':
        return <Tag color="default">Inactivo</Tag>;
      case 'suspended':
        return <Tag color="warning">Suspendido</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  if (loading || memberLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!member) {
    return (
      <Card>
        <p>No se encontró el miembro solicitado</p>
        <Button type="primary" onClick={handleBack}>
          Volver a la lista
        </Button>
      </Card>
    );
  }

  return (
    <div className="gym-member-detail">
      <Button 
        type="text" 
        icon={<ArrowLeftOutlined />} 
        onClick={handleBack}
        style={{ marginBottom: 16 }}
      >
        Volver
      </Button>

      <Card 
        title={
          <span>
            <IdcardOutlined style={{ marginRight: 8 }} />
            Detalles del Miembro
          </span>
        }
        extra={[
          <Button 
            key="edit" 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => navigate(`/members/edit/${id}`)}
          >
            Editar
          </Button>
        ]}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="Información General" key="1">
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Descriptions 
                  title="Datos Personales" 
                  bordered 
                  column={1}
                  size="small"
                >
                  <Descriptions.Item label="Nombres Completos">
                    {member.firstName} {member.lastName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Género">
                    {member.gender === 'male' ? 'Masculino' : 
                     member.gender === 'female' ? 'Femenino' : 'Otro'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Fecha de Nacimiento">
                    {member.birthDate ? new Date(member.birthDate).toLocaleDateString() : 'No especificado'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Estado">
                    {getStatusTag(member.status)}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
              <Col xs={24} md={12} style={{ marginTop: 16, marginBottom: 16 }}>
                <Card size="small" title="Información de Contacto">
                  <p><MailOutlined /> {member.email || 'No especificado'}</p>
                  <p><PhoneOutlined /> {member.phone || 'No especificado'}</p>
                  <p><HomeOutlined /> {member.address || 'No especificada'}</p>
                </Card>
                
                {member.notes && (
                  <Card 
                    size="small" 
                    title={
                      <span>
                        <InfoCircleOutlined /> Notas
                      </span>
                    }
                    style={{ marginTop: 16 }}
                  >
                    {member.notes}
                  </Card>
                )}
              </Col>
            </Row>
          </TabPane>
          
          <TabPane tab="Membresías" key="2">
            <Card>
              <p>Historial de membresías del miembro</p>
              {/* Aquí iría el componente de historial de membresías */}
            </Card>
          </TabPane>
          
          <TabPane tab="Asistencia" key="3">
            <Card>
              <p>Registro de asistencia</p>
              {/* Aquí iría el componente de registro de asistencia */}
            </Card>
          </TabPane>
          
          <TabPane tab="Pagos" key="4">
            <Card>
              <p>Historial de pagos</p>
              {/* Aquí iría el componente de historial de pagos */}
            </Card>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default GymMemberDetail;
