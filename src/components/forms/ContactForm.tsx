import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';

type FormData = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  property_type: string;
  message: string;
};

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const { error } = await supabase.from('contact_forms').insert([data]);
      
      if (error) throw error;
      
      setIsSuccess(true);
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage('There was an error submitting your form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-sm shadow-md p-6 md:p-8">
      {isSuccess ? (
        <div className="text-center py-8">
          <h3 className="text-2xl font-medium text-secondary-900 mb-4">Thank You!</h3>
          <p className="text-secondary-600 mb-6">Your message has been received. We'll be in touch soon.</p>
          <button
            onClick={() => setIsSuccess(false)}
            className="btn btn-primary"
          >
            Submit Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="first_name" className="label">First Name</label>
              <input
                id="first_name"
                type="text"
                className={`input ${errors.first_name ? 'border-red-500' : ''}`}
                {...register('first_name', { required: 'First name is required' })}
              />
              {errors.first_name && (
                <p className="mt-1 text-sm text-red-500">{errors.first_name.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="last_name" className="label">Last Name</label>
              <input
                id="last_name"
                type="text"
                className={`input ${errors.last_name ? 'border-red-500' : ''}`}
                {...register('last_name', { required: 'Last name is required' })}
              />
              {errors.last_name && (
                <p className="mt-1 text-sm text-red-500">{errors.last_name.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="label">Email</label>
              <input
                id="email"
                type="email"
                className={`input ${errors.email ? 'border-red-500' : ''}`}
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
              <label htmlFor="phone" className="label">Phone Number</label>
              <input
                id="phone"
                type="tel"
                className={`input ${errors.phone ? 'border-red-500' : ''}`}
                {...register('phone', { required: 'Phone number is required' })}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="property_type" className="label">Property Type Interest</label>
              <select
                id="property_type"
                className={`input ${errors.property_type ? 'border-red-500' : ''}`}
                {...register('property_type', { required: 'Please select a property type' })}
              >
                <option value="">Select Property Type</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Investment">Investment</option>
                <option value="Vacation">Vacation Home</option>
              </select>
              {errors.property_type && (
                <p className="mt-1 text-sm text-red-500">{errors.property_type.message}</p>
              )}
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="message" className="label">Message</label>
              <textarea
                id="message"
                rows={5}
                className={`input ${errors.message ? 'border-red-500' : ''}`}
                {...register('message', { required: 'Message is required' })}
              ></textarea>
              {errors.message && (
                <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
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
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      )}
    </div>
  );
}