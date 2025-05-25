import React from 'react';
import { Table, Space, Button } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const GymMemberTable = ({ members, onView, onEdit, onDelete, loading }) => {
  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'firstName',
      key: 'firstName',
      render: (_, record) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Teléfono',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Membresía',
      dataIndex: ['membershipPlan', 'name'],
      key: 'membershipPlan',
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            icon={<EyeOutlined />} 
            onClick={() => onView(record.id)}
            type="text"
          />
          <Button 
            icon={<EditOutlined />} 
            onClick={() => onEdit(record.id)}
            type="text"
          />
          <Button 
            icon={<DeleteOutlined />} 
            onClick={() => onDelete(record.id)}
            danger
            type="text"
          />
        </Space>
      ),
    },
  ];

  return (
    <Table 
      columns={columns} 
      dataSource={members} 
      rowKey="id"
      loading={loading}
      pagination={{ pageSize: 10 }}
    />
  );
};

export default GymMemberTable;
