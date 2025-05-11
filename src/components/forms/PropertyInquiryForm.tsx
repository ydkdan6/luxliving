import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';
import { Property } from '../../types';

type FormData = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

interface PropertyInquiryFormProps {
  property: Property;
}

export default function PropertyInquiryForm({ property }: PropertyInquiryFormProps) {
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
      const { error } = await supabase.from('property_inquiries').insert([
        {
          property_id: property.id,
          ...data,
        },
      ]);
      
      if (error) throw error;
      
      setIsSuccess(true);
      reset();
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      setErrorMessage('There was an error submitting your inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-sm shadow-md p-6">
      <h3 className="text-xl font-medium mb-4">Interested in this property?</h3>
      
      {isSuccess ? (
        <div className="text-center py-4">
          <p className="text-secondary-600 mb-4">Thank you for your interest! We'll be in touch shortly.</p>
          <button
            onClick={() => setIsSuccess(false)}
            className="btn btn-outline"
          >
            Send Another Inquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="label">Full Name</label>
              <input
                id="name"
                type="text"
                className={`input ${errors.name ? 'border-red-500' : ''}`}
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
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
            
            <div>
              <label htmlFor="message" className="label">Message</label>
              <textarea
                id="message"
                rows={4}
                className={`input ${errors.message ? 'border-red-500' : ''}`}
                defaultValue={`I'm interested in ${property.title} priced at $${property.price.toLocaleString()}.`}
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
            {isSubmitting ? 'Submitting...' : 'Contact About This Property'}
          </button>
        </form>
      )}
    </div>
  );
}