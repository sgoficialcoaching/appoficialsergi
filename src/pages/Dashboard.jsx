import { useEffect, useState } from 'react';
import { getCurrentUser, signOut } from '../lib/auth';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .maybeSingle();

        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f7fafc'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e2e8f0',
            borderTopColor: '#667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p style={{ marginTop: '16px', color: '#718096' }}>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f7fafc'
    }}>
      <nav style={{
        background: 'white',
        padding: '16px 24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Horizon Fitness
        </h1>
        <button
          onClick={handleSignOut}
          style={{
            padding: '8px 16px',
            background: '#f56565',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.background = '#e53e3e'}
          onMouseLeave={(e) => e.target.style.background = '#f56565'}
        >
          Cerrar Sesión
        </button>
      </nav>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 24px'
      }}>
        <div style={{
          background: 'white',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: '#1a202c'
          }}>
            ¡Bienvenido de vuelta! 👋
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#718096',
            marginBottom: '24px'
          }}>
            Estás autenticado exitosamente
          </p>

          <div style={{
            background: '#f7fafc',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px',
              color: '#2d3748'
            }}>
              Tu Información
            </h3>
            <div style={{ marginBottom: '12px' }}>
              <span style={{ fontWeight: '500', color: '#4a5568' }}>Usuario: </span>
              <span style={{ color: '#2d3748' }}>{profile?.username || 'Cargando...'}</span>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <span style={{ fontWeight: '500', color: '#4a5568' }}>Email: </span>
              <span style={{ color: '#2d3748' }}>{user?.email}</span>
            </div>
            <div>
              <span style={{ fontWeight: '500', color: '#4a5568' }}>ID: </span>
              <span style={{ color: '#2d3748', fontSize: '12px', fontFamily: 'monospace' }}>
                {user?.id}
              </span>
            </div>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '32px',
          borderRadius: '12px',
          color: 'white',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '12px'
          }}>
            ¡Sistema de Autenticación Funcionando!
          </h3>
          <p style={{ opacity: 0.9 }}>
            Tu app ahora tiene registro, login y protección de rutas implementado con Supabase
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
