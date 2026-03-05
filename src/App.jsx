import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import OnboardingWizard from './pages/OnboardingWizard';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const loadProfile = async (userId) => {
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    setProfile(data);
    setProfileLoaded(true);
    setLoading(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setProfileLoaded(false);
        loadProfile(session.user.id);
      } else {
        setProfile(null);
        setProfileLoaded(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleOnboardingComplete = (newProfile) => {
    setProfile({ ...newProfile, onboarding_completed: true });
  };

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(prev => ({ ...prev, ...updatedProfile }));
  };

  if (loading || (session && !profileLoaded)) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-base)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid rgba(255,255,255,0.1)',
            borderTopColor: 'var(--neon-yellow)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }} />
          <p style={{ marginTop: '16px', color: 'var(--text-muted)', fontSize: '14px', fontWeight: 500 }}>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!session) return <Auth />;

  if (!profile?.onboarding_completed) {
    return (
      <OnboardingWizard
        userId={session.user.id}
        userName={session.user.user_metadata?.full_name || ''}
        onComplete={handleOnboardingComplete}
      />
    );
  }

  return <Dashboard profile={profile} onProfileUpdate={handleProfileUpdate} />;
}
