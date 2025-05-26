import React, { useEffect, useState } from 'react';
import { GymMember } from '../../../models/GymMember';
import gymMemberService from '../services/gymMember.service';

const GymMembersList: React.FC = () => {
  const [members, setMembers] = useState<GymMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const data = await gymMemberService.getAllMembers();
        setMembers(data);
      } catch (err) {
        console.error('Error fetching members:', err);
        setError('Error al cargar los miembros');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Cargando miembros...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        backgroundColor: '#fef2f2',
        borderLeft: '4px solid #ef4444',
        padding: '1rem',
        margin: '1rem 0',
        color: '#b91c1c'
      }}>
        {error}
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem 1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#111827'
            }}>
              Miembros del Gimnasio
            </h2>
            <p style={{
              margin: '0.5rem 0 0',
              color: '#6b7280',
              fontSize: '0.875rem'
            }}>
              Lista de todos los miembros registrados en el sistema
            </p>
          </div>
          <button style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '0.5rem 1rem',
            fontWeight: 500,
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}>
            Agregar Miembro
          </button>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: '800px'
          }}>
            <thead>
              <tr style={{
                backgroundColor: '#f9fafb',
                borderBottom: '1px solid #e5e7eb',
                textAlign: 'left',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                <th style={{ padding: '1rem' }}>Nombre</th>
                <th style={{ padding: '1rem' }}>Email</th>
                <th style={{ padding: '1rem' }}>Teléfono</th>
                <th style={{ padding: '1rem' }}>Fecha de Registro</th>
                <th style={{ padding: '1rem' }}>Membresía</th>
                <th style={{ padding: '1rem' }}>Estado</th>
                <th style={{ padding: '1rem' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr 
                  key={member.id}
                  style={{
                    borderBottom: '1px solid #e5e7eb',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <td style={{ 
                    padding: '1rem',
                    fontWeight: 500,
                    color: '#111827'
                  }}>
                    {member.name}
                  </td>
                  <td style={{ 
                    padding: '1rem',
                    color: '#4b5563'
                  }}>
                    {member.email}
                  </td>
                  <td style={{ 
                    padding: '1rem',
                    color: '#4b5563'
                  }}>
                    {member.phone || 'N/A'}
                  </td>
                  <td style={{ 
                    padding: '1rem',
                    color: '#4b5563'
                  }}>
                    {formatDate(member.registrationDate || '')}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '9999px',
                      backgroundColor: '#e0f2fe',
                      color: '#0369a1',
                      fontSize: '0.75rem',
                      fontWeight: 500
                    }}>
                      {member.membershipPlan?.name || 'Sin plan'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '9999px',
                      backgroundColor: member.active ? '#dcfce7' : '#f3f4f6',
                      color: member.active ? '#166534' : '#4b5563',
                      fontSize: '0.75rem',
                      fontWeight: 500
                    }}>
                      {member.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{
                      display: 'flex',
                      gap: '0.5rem'
                    }}>
                      <button style={{
                        backgroundColor: 'transparent',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        padding: '0.375rem 0.75rem',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: '#4b5563',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}>
                        Editar
                      </button>
                      <button style={{
                        backgroundColor: 'transparent',
                        border: '1px solid #fecaca',
                        borderRadius: '6px',
                        padding: '0.375rem 0.75rem',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: '#dc2626',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GymMembersList;
