import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Row, Col, DatePicker, Select, message, Spin } from 'antd';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import useGymMember from '../hooks/useGymMember';

const { Option } = Select;
const { TextArea } = Input;

const GymMemberForm = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(isEditMode);
  
  const { 
    member, 
    loading: memberLoading, 
    createMember, 
    updateMember,
    fetchMemberById 
  } = useGymMember();

  useEffect(() => {
    if (isEditMode) {
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
    }
  }, [id, isEditMode, fetchMemberById]);

  useEffect(() => {
    if (member && isEditMode) {
      form.setFieldsValue({
        ...member,
        // Format dates if necessary
      });
    }
  }, [member, isEditMode, form]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      if (isEditMode) {
        await updateMember(id, values);
        message.success('Miembro actualizado exitosamente');
      } else {
        await createMember(values);
        message.success('Miembro creado exitosamente');
      }
      navigate('/members');
    } catch (error) {
      console.error('Error saving member:', error);
      message.error(`Error al ${isEditMode ? 'actualizar' : 'crear'} el miembro`);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading || memberLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="gym-member-form">
      <Button 
        type="text" 
        icon={<ArrowLeftOutlined />} 
        onClick={handleBack}
        style={{ marginBottom: 16 }}
      >
        Volver
      </Button>

      <Card title={isEditMode ? 'Editar Miembro' : 'Nuevo Miembro'}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            status: 'active',
          }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="firstName"
                label="Nombres"
                rules={[{ required: true, message: 'Por favor ingrese el nombre' }]}
              >
                <Input placeholder="Nombres" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="lastName"
                label="Apellidos"
                rules={[{ required: true, message: 'Por favor ingrese los apellidos' }]}
              >
                <Input placeholder="Apellidos" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="email"
                label="Correo Electrónico"
                rules={[
                  { required: true, message: 'Por favor ingrese el correo electrónico' },
                  { type: 'email', message: 'Ingrese un correo electrónico válido' },
                ]}
              >
                <Input placeholder="correo@ejemplo.com" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="phone"
                label="Teléfono"
                rules={[{ required: true, message: 'Por favor ingrese el teléfono' }]}
              >
                <Input placeholder="+51 999 999 999" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="birthDate"
                label="Fecha de Nacimiento"
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="gender"
                label="Género"
              >
                <Select placeholder="Seleccione género">
                  <Option value="male">Masculino</Option>
                  <Option value="female">Femenino</Option>
                  <Option value="other">Otro</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            label="Dirección"
          >
            <TextArea rows={2} placeholder="Dirección completa" />
          </Form.Item>

          <Form.Item
            name="notes"
            label="Notas"
          >
            <TextArea rows={3} placeholder="Notas adicionales" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Estado"
          >
            <Select>
              <Option value="active">Activo</Option>
              <Option value="inactive">Inactivo</Option>
              <Option value="suspended">Suspendido</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<SaveOutlined />}
              loading={loading}
            >
              {isEditMode ? 'Actualizar Miembro' : 'Guardar Miembro'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default GymMemberForm;
