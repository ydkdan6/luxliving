// src/pages/AuthHandler.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AuthHandler: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Session fetch error:', error.message);
        navigate('/login');
        return;
      }

      if (!data.session) {
        // Try to recover the session from the URL hash
        const { data: authListenerData } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (session) {
              console.log('Session recovered after redirect:', session);
              navigate('/');
            } else {
              navigate('/login');
            }
          }
        );

        // Clean up listener
        return () => {
          authListenerData.subscription.unsubscribe();
        };
      } else {
        navigate('/');
      }
    };

    handleAuthRedirect();
  }, [navigate]);

  return <p>Signing you in, please wait...</p>;
};

export default AuthHandler;
