import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Input, Space, Typography } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import GymMemberTable from '../components/GymMemberTable';
import useGymMember from '../hooks/useGymMember';

const { Title } = Typography;

const GymMemberList = () => {
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const { 
    members, 
    loading, 
    fetchMembers, 
    deleteMember 
  } = useGymMember();

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSearch = (value) => {
    // Implement search functionality
    console.log('Searching for:', value);
  };

  const handleView = (id) => {
    navigate(`/members/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/members/edit/${id}`);
  };

  const handleDelete = async (id) => {
    await deleteMember(id);
    fetchMembers();
  };

  const handleCreate = () => {
    navigate('/members/new');
  };

  return (
    <div className="gym-member-list">
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3}>Miembros del Gimnasio</Title>
        </Col>
        <Col>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            Nuevo Miembro
          </Button>
        </Col>
      </Row>
      
      <Space direction="vertical" style={{ width: '100%', marginBottom: 24 }}>
        <Input
          placeholder="Buscar miembros..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onPressEnter={() => handleSearch(searchText)}
          style={{ width: 300 }}
          allowClear
        />
      </Space>

      <GymMemberTable 
        members={members}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default GymMemberList;
