import React, { useState } from 'react';
import { Mail, Phone, User, MessageSquare, Building, CheckCircle } from 'lucide-react';

// Simulating form validation (since react-hook-form isn't available)
export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    property_type: '',
    message: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.property_type) newErrors.property_type = 'Please select a property type';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSuccess(true);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        property_type: '',
        message: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage('There was an error submitting your form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="p-8 lg:p-12">
        {isSuccess ? (
          <div className="text-center py-16">
            <div className="mx-auto w-20 h-20 bg-secondary-900 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Thank You!</h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Your message has been received successfully. We'll be in touch within 24 hours.
            </p>
            <button
              onClick={() => setIsSuccess(false)}
              className="inline-flex items-center px-6 py-3 bg-secondary-950 text-white font-medium rounded-lg hover:bg-secondary-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Submit Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-8">
            {/* Personal Information Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <User className="w-5 h-5 mr-2 text-primary-500" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.first_name ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Enter your first name"
                  />
                  {errors.first_name && (
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 text-xs flex items-center justify-center mr-2">!</span>
                      {errors.first_name}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.last_name ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Enter your last name"
                  />
                  {errors.last_name && (
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 text-xs flex items-center justify-center mr-2">!</span>
                      {errors.last_name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-primary-500" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-primary-500" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 text-xs flex items-center justify-center mr-2">!</span>
                      {errors.email}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 h-5 w-5 text-primary-500" />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 text-xs flex items-center justify-center mr-2">!</span>
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Property Interest Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Building className="w-5 h-5 mr-2 text-primary-500" />
                Property Interest
              </h3>
              <div className="space-y-2">
                <label htmlFor="property_type" className="block text-sm font-medium text-gray-700">
                  Property Type
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-3.5 h-5 w-5 text-primary-500" />
                  <select
                    id="property_type"
                    name="property_type"
                    value={formData.property_type}
                    onChange={handleInputChange}
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white ${
                      errors.property_type ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <option value="">Select a property type</option>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Investment">Investment</option>
                    <option value="Vacation">Vacation Home</option>
                  </select>
                </div>
                {errors.property_type && (
                  <p className="text-sm text-red-600 flex items-center mt-1">
                    <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 text-xs flex items-center justify-center mr-2">!</span>
                    {errors.property_type}
                  </p>
                )}
              </div>
            </div>

            {/* Message Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-primary-500" />
                Your Message
              </h3>
              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Tell us about your property needs
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                    errors.message ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="Share details about your ideal property, timeline, budget, or any specific requirements..."
                />
                {errors.message && (
                  <p className="text-sm text-red-600 flex items-center mt-1">
                    <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 text-xs flex items-center justify-center mr-2">!</span>
                    {errors.message}
                  </p>
                )}
              </div>
            </div>
            
            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 text-sm flex items-center justify-center">!</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-red-800 font-medium">{errorMessage}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-white text-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary-500 to-purple-700 hover:from-blue-700 hover:to-purple-800 shadow-lg hover:shadow-xl'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Submitting...
                  </div>
                ) : (
                  'Send Message'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}