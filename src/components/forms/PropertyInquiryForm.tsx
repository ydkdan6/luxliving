import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';
import { Property } from '../../types';
import { MapPin, Mail, Phone, User, MessageSquare } from 'lucide-react';

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
  const mapRef = useRef<HTMLDivElement>(null);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  // Initialize Leaflet Map (free, no API key required)
  useEffect(() => {
    if (!mapRef.current) return;

    const address = `${property.address || ''}, ${property.city || ''}, ${property.state || ''} ${property.zipCode || ''}`.trim();
    
    // Load Leaflet CSS and JS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      const L = (window as any).L;
      
      // Create map container
      const mapContainer = document.createElement('div');
      mapContainer.id = 'map-' + property.id;
      mapContainer.style.width = '100%';
      mapContainer.style.height = '100%';
      
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
        mapRef.current.appendChild(mapContainer);
      }

      // Geocode using Nominatim
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            const { lat, lon } = data[0];
            
            // Initialize map
            const map = L.map(mapContainer.id).setView([lat, lon], 15);
            
            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors',
              maxZoom: 19
            }).addTo(map);
            
            // Add marker
            L.marker([lat, lon]).addTo(map)
              .bindPopup(`<b>${property.title}</b><br>${address}`)
              .openPopup();
          } else {
            if (mapRef.current) {
              mapRef.current.innerHTML = `
                <div class="flex items-center justify-center h-full text-gray-500">
                  <p>Location not found for this address</p>
                </div>
              `;
            }
          }
        })
        .catch(err => {
          console.error('Geocoding error:', err);
          if (mapRef.current) {
            mapRef.current.innerHTML = `
              <div class="flex items-center justify-center h-full text-gray-500">
                <p>Unable to load map</p>
              </div>
            `;
          }
        });
    };
    
    document.head.appendChild(script);

    return () => {
      // Cleanup
      link.remove();
      script.remove();
    };
  }, [property]);

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

  const address = `${property.address || ''}, ${property.city || ''}, ${property.state || ''} ${property.zipCode || ''}`.trim();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Property Location Map */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">Property Location</h3>
          </div>
          <p className="mt-2 text-gray-600">{address}</p>
        </div>
        <div ref={mapRef} className="w-full h-96 bg-gray-100"></div>
      </div>

      {/* Inquiry Form */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Schedule a Visit</h3>
          <p className="mt-1 text-gray-600">Interested in this property? Fill out the form below and we'll get back to you shortly.</p>
        </div>
        
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h4>
              <p className="text-gray-600 mb-6">We've received your inquiry and will contact you shortly.</p>
              <button
                onClick={() => setIsSuccess(false)}
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="name" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 mr-2 text-gray-400" />
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  className={`w-full px-4 py-3 border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                  placeholder="John Doe"
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className={`w-full px-4 py-3 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                  placeholder="john@example.com"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    }
                  })}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="phone" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-300' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                  placeholder="+1 (555) 000-0000"
                  {...register('phone', { required: 'Phone number is required' })}
                />
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="message" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare className="w-4 h-4 mr-2 text-gray-400" />
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className={`w-full px-4 py-3 border ${errors.message ? 'border-red-300' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none`}
                  placeholder="Tell us about your interest in this property..."
                  defaultValue={`I'm interested in ${property.title} priced at $${property.price.toLocaleString()}.`}
                  {...register('message', { required: 'Message is required' })}
                ></textarea>
                {errors.message && (
                  <p className="mt-2 text-sm text-red-600">{errors.message.message}</p>
                )}
              </div>
              
              {errorMessage && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800">{errorMessage}</p>
                </div>
              )}
              
              <button
                type="submit"
                className="w-full px-6 py-3 bg-primary-500 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Send Inquiry'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}