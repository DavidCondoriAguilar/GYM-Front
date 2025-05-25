import React from 'react';
import { Card, Button } from 'antd';

const GymMemberCard = ({ member, onEdit, onDelete }) => {
  return (
    <Card
      title={`${member.firstName} ${member.lastName}`}
      style={{ width: 300, margin: '16px' }}
      actions={[
        <Button type="link" onClick={() => onEdit(member.id)}>Editar</Button>,
        <Button type="link" danger onClick={() => onDelete(member.id)}>Eliminar</Button>
      ]}
    >
      <p>Email: {member.email}</p>
      <p>Teléfono: {member.phone}</p>
      <p>Membresía: {member.membershipPlan}</p>
    </Card>
  );
};

export default GymMemberCard;
