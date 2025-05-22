import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Property } from '../types';
import Layout from '../components/layout/Layout';
import PropertyInquiryForm from '../components/forms/PropertyInquiryForm';
import { formatCurrency } from '../utils/formatters';
import { Bed, Bath, Square, MapPin, Clock, CheckCircle } from 'lucide-react';

export default function PropertyDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      setIsLoading(true);
      
      try {
        if (!slug) return;
        
        // Fetch the property
        const { data: propertyData, error: propertyError } = await supabase
          .from('properties')
          .select('*')
          .eq('slug', slug)
          .single();

        if (propertyError) throw propertyError;
        
        if (!propertyData) {
          console.error('Property not found');
          return;
        }
        
        setProperty(propertyData);
        
        // Fetch similar properties
        const { data: similarData, error: similarError } = await supabase
          .from('properties')
          .select('*')
          .neq('id', propertyData.id)
          .order('price', { ascending: false })
          .limit(3);

        if (similarError) throw similarError;
        setSimilarProperties(similarData || []);
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [slug]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-20">
          <div className="text-center">Loading property details...</div>
        </div>
      </Layout>
    );
  }

  if (!property) {
    return (
      <Layout>
        <div className="container py-20">
          <div className="text-center">
            <h2 className="mb-4">Property Not Found</h2>
            <p className="mb-6 text-secondary-600">
              The property you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/properties" className="btn btn-primary">
              View All Properties
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Property Header */}
      <section className="relative bg-secondary-900 text-white">
        <div className="absolute inset-0">
          <img
            src={property.image_url}
            alt={property.title}
            className="object-cover w-full h-full opacity-40"
          />
        </div>
        <div className="relative container py-20 md:py-32">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-medium rounded-sm text-primary-900 bg-primary-200">
              {formatCurrency(property.price)}
            </span>
            <h1 className="mb-6">{property.title}</h1>
            <div className="flex items-center text-cream-100">
              <MapPin size={20} className="mr-2" />
              <span>{property.address}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Property Content */}
      <section className="py-12 md:py-20">
        <div className="container">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {/* Property Overview */}
              <div className="p-6 mb-8 bg-cream-50 rounded-sm">
                <h3 className="mb-6 text-2xl font-medium">Property Overview</h3>
                <div className="grid grid-cols-3 mb-6 text-center">
                  <div className="p-4">
                    <Bed size={24} className="mx-auto mb-2 text-primary-500" />
                    <p className="text-lg font-medium">{property.bedrooms}</p>
                    <p className="text-sm text-secondary-600">Bedrooms</p>
                  </div>
                  <div className="p-4">
                    <Bath size={24} className="mx-auto mb-2 text-primary-500" />
                    <p className="text-lg font-medium">{property.bathrooms}</p>
                    <p className="text-sm text-secondary-600">Bathrooms</p>
                  </div>
                  <div className="p-4">
                    <Square size={24} className="mx-auto mb-2 text-primary-500" />
                    <p className="text-lg font-medium">{property.square_feet.toLocaleString()}</p>
                    <p className="text-sm text-secondary-600">Square Feet</p>
                  </div>
                </div>
                <div className="flex items-center text-secondary-600">
                  <Clock size={18} className="mr-2" />
                  <span>Listed on {new Date(property.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Property Description */}
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-medium">Description</h3>
                <p className="mb-4 text-secondary-700">{property.description}</p>
              </div>

              {/* Property Features */}
              {property.features && property.features.length > 0 && (
                <div className="mb-8">
                  <h3 className="mb-4 text-2xl font-medium">Features</h3>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle size={18} className="mr-2 text-primary-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Property Location */}
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-medium">Location</h3>
                <div className="aspect-[16/9] bg-cream-200 rounded-sm">
                  {/* Map would go here in a real implementation */}
                  <div className="flex items-center justify-center h-full text-secondary-900">
                    <p>Map showing {property.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Contact Form */}
              <PropertyInquiryForm property={property} />

              {/* Similar Properties */}
              {similarProperties.length > 0 && (
                <div className="mt-8 p-6 bg-cream-50 rounded-sm">
                  <h3 className="mb-6 text-xl font-medium">Similar Properties</h3>
                  <div className="space-y-6">
                    {similarProperties.map((similarProperty) => (
                      <div key={similarProperty.id} className="flex space-x-4">
                        <Link
                          to={`/properties/${similarProperty.slug}`}
                          className="flex-shrink-0 w-20 h-20"
                        >
                          <img
                            src={similarProperty.image_url}
                            alt={similarProperty.title}
                            className="object-cover w-full h-full rounded-sm"
                          />
                        </Link>
                        <div>
                          <Link
                            to={`/properties/${similarProperty.slug}`}
                            className="font-medium hover:text-primary-600"
                          >
                            {similarProperty.title}
                          </Link>
                          <p className="text-primary-600 font-medium">
                            {formatCurrency(similarProperty.price)}
                          </p>
                          <div className="flex mt-1 text-xs text-secondary-900 space-x-2">
                            <span>{similarProperty.bedrooms} bd</span>
                            <span>•</span>
                            <span>{similarProperty.bathrooms} ba</span>
                            <span>•</span>
                            <span>{similarProperty.square_feet.toLocaleString()} sqft</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}