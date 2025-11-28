import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Property } from '../types';
import Layout from '../components/layout/Layout';
import PropertyCard from '../components/ui/PropertyCard';

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
  });

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      
      try {
        let query = supabase.from('properties').select('*');
        
        // Apply filters
        if (filters.minPrice) {
          query = query.gte('price', parseFloat(filters.minPrice));
        }
        
        if (filters.maxPrice) {
          query = query.lte('price', parseFloat(filters.maxPrice));
        }
        
        if (filters.bedrooms) {
          query = query.gte('bedrooms', parseInt(filters.bedrooms));
        }
        
        if (filters.bathrooms) {
          query = query.gte('bathrooms', parseFloat(filters.bathrooms));
        }
        
        const { data, error } = await query.order('price', { ascending: false });
        
        if (error) throw error;
        setProperties(data || []);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
    });
  };

  return (
    <Layout>
      {/* Header */}
      <section className="relative bg-secondary-900 text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg"
            alt="Luxury Property"
            className="object-cover w-full h-full opacity-30"
            loading='lazy'
          />
        </div>
        <div className="relative container py-20 md:py-32">
          <div className="max-w-2xl">
            <h1 className="mb-4">Luxury Properties</h1>
            <p className="text-xl text-cream-100">
              Discover extraordinary properties curated for the most discerning clients.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-cream-100 border-b border-cream-200">
        <div className="container">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            <div>
              <label htmlFor="minPrice" className="label">Min Price</label>
              <input
                type="number"
                id="minPrice"
                name="minPrice"
                className="input"
                placeholder="Min"
                value={filters.minPrice}
                onChange={handleFilterChange}
              />
            </div>
            <div>
              <label htmlFor="maxPrice" className="label">Max Price</label>
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                className="input"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={handleFilterChange}
              />
            </div>
            <div>
              <label htmlFor="bedrooms" className="label">Bedrooms</label>
              <select
                id="bedrooms"
                name="bedrooms"
                className="input"
                value={filters.bedrooms}
                onChange={handleFilterChange}
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>
            <div>
              <label htmlFor="bathrooms" className="label">Bathrooms</label>
              <select
                id="bathrooms"
                name="bathrooms"
                className="input"
                value={filters.bathrooms}
                onChange={handleFilterChange}
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="btn btn-outline w-full"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Properties */}
      <section className="py-12 md:py-20">
        <div className="container">
          {isLoading ? (
            <div className="text-center py-12">Loading properties...</div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-secondary-600">
                No properties match your current filters.
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 btn btn-primary"
              >
                View All Properties
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-secondary-900 text-white">
        <div className="container">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 items-center">
            <div>
              <h2 className="mb-6 text-white">Find Your Perfect Property</h2>
              <p className="mb-8 text-cream-100">
                Not seeing what you're looking for? Our team of expert real estate professionals 
                can help you find the perfect property that matches your lifestyle and preferences.
              </p>
              <a href="/contact" className="btn btn-primary">
                Contact Our Team
              </a>
            </div>
            <div className="h-full rounded-sm overflow-hidden">
              <img
                src="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg"
                alt="Luxury Real Estate"
                className="w-full h-full object-cover"
                loading='lazy'
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}