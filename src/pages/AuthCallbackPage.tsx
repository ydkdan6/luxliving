// src/pages/AuthCallbackPage.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        console.error(error || 'No session found');
        navigate('/login');
        return;
      }

      // User authenticated — redirect to dashboard or home
      navigate('/dashboard');
    };

    handleAuth();
  }, [navigate]);

  return <p>Signing you in...</p>;
};

export default AuthCallbackPage;
