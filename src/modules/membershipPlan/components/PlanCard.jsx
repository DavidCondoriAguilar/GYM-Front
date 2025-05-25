import React from 'react';
import { Card, Tag, Button, Space, Typography } from 'antd';
import { CheckCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const PlanCard = ({ plan, onEdit, onDelete, onSelect }) => {
  const { name, description, price, duration, features = [], isPopular } = plan;

  return (
    <Card
      hoverable
      style={{ 
        width: 300, 
        margin: '16px',
        border: isPopular ? '2px solid #1890ff' : '1px solid #f0f0f0',
        position: 'relative',
        overflow: 'hidden',
      }}
      cover={
        <div 
          style={{ 
            height: '8px', 
            background: isPopular ? '#1890ff' : '#f0f0f0',
          }}
        />
      }
      actions={[
        <Button 
          key="select" 
          type={isPopular ? 'primary' : 'default'}
          onClick={() => onSelect && onSelect(plan)}
        >
          Seleccionar
        </Button>,
        <Button 
          key="edit" 
          type="text" 
          icon={<EditOutlined />} 
          onClick={() => onEdit && onEdit(plan)}
        />,
        <Button 
          key="delete" 
          type="text" 
          danger 
          icon={<DeleteOutlined />} 
          onClick={() => onDelete && onDelete(plan)}
        />,
      ]}
    >
      {isPopular && (
        <div 
          style={{
            position: 'absolute',
            top: '16px',
            right: '-30px',
            background: '#1890ff',
            color: 'white',
            padding: '2px 30px',
            transform: 'rotate(45deg)',
            fontSize: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          Popular
        </div>
      )}
      
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <Title level={3} style={{ marginBottom: '4px' }}>{name}</Title>
        <Title level={2} style={{ color: '#1890ff', margin: '8px 0' }}>
          ${price.toFixed(2)}
        </Title>
        <Text type="secondary">por {duration} días</Text>
      </div>
      
      <div style={{ margin: '16px 0' }}>
        <Text>{description}</Text>
      </div>
      
      <div style={{ marginTop: '16px' }}>
        <Text strong>Incluye:</Text>
        <div style={{ marginTop: '8px' }}>
          {features.map((feature, index) => (
            <div key={index} style={{ margin: '4px 0', display: 'flex', alignItems: 'center' }}>
              <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
              <Text>{feature}</Text>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default PlanCard;
