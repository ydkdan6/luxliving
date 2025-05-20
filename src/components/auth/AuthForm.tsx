import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';

type FormData = {
  email: string;
  password: string;
};

type AuthMode = 'login' | 'register';

export default function AuthForm() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
    setErrorMessage('');
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      if (authMode === 'login') {
        const { error } = await signIn(data.email, data.password);
        if (error) throw error;
        navigate('/');
      } else {
        const { error } = await signUp(data.email, data.password);
        if (error) throw error;
        setErrorMessage('');
        // Show success message for registration
        navigate('/');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setErrorMessage(
        authMode === 'login'
          ? 'Invalid email or password'
          : 'Error creating account. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-secondary-950 rounded-sm shadow-md p-6 md:p-8 w-full max-w-md">
      <h2 className="text-3xl font-medium text-center mb-6">
        {authMode === 'login' ? 'Sign In' : 'Create Account'}
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="label">Email</label>
            <input
              id="email"
              type="email"
              className={`input text-black mx-3 px-2 h-8 w-[290px] rounded-sm ${errors.email ? 'border-red-500' : ''}`}
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                }
              })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="password" className="label">Password</label>
            <input
              id="password"
              type="password"
              className={`input text-black  mx-3 px-2 h-8 w-[260px] rounded-sm ${errors.password ? 'border-red-500' : ''}`}
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                }
              })}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
        </div>
        
        {errorMessage && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-sm">
            {errorMessage}
          </div>
        )}
        
        <button
          type="submit"
          className="mt-6 btn btn-primary w-full"
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? 'Processing...' 
            : authMode === 'login' 
              ? 'Sign In' 
              : 'Create Account'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={toggleAuthMode}
          className="text-primary-500 hover:text-primary-700"
        >
          {authMode === 'login' 
            ? "Don't have an account? Sign up" 
            : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  );
}