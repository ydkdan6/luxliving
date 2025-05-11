import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import AuthForm from '../components/auth/AuthForm';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to home if already logged in
  if (user) {
    navigate('/');
    return null;
  }

  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container">
          <div className="flex justify-center">
            <AuthForm />
          </div>
        </div>
      </section>
    </Layout>
  );
}