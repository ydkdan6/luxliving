import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Property } from '../types';
import Layout from '../components/layout/Layout';
import PropertyCard from '../components/ui/PropertyCard';
import { Search, SlidersHorizontal, Home, DollarSign, Bed, Bath, X } from 'lucide-react';

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
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

  const hasActiveFilters = Object.values(filters).some(value => value !== '');
  const activeFilterCount = Object.values(filters).filter(value => value !== '').length;

  return (
    <Layout>
      {/* Hero Header */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg"
            alt="Luxury Property"
            className="object-cover w-full h-full opacity-20"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>
        <div className="relative container py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-full mb-6">
              <Home className="w-4 h-4" />
              <span className="text-sm font-medium">Premium Real Estate</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Discover Your Dream Property
            </h1>
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
              Explore our curated collection of exceptional properties tailored for discerning clients seeking excellence in every detail.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Bar */}
      <section className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="container py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  showFilters 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-xs font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>
            
            <div className="text-sm text-gray-600 font-medium">
              {isLoading ? 'Loading...' : `${properties.length} ${properties.length === 1 ? 'Property' : 'Properties'} Found`}
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="minPrice" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    Minimum Price
                  </label>
                  <input
                    type="number"
                    id="minPrice"
                    name="minPrice"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    placeholder="No minimum"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="maxPrice" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    Maximum Price
                  </label>
                  <input
                    type="number"
                    id="maxPrice"
                    name="maxPrice"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    placeholder="No maximum"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="bedrooms" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Bed className="w-4 h-4 text-gray-400" />
                    Bedrooms
                  </label>
                  <select
                    id="bedrooms"
                    name="bedrooms"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
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
                  <label htmlFor="bathrooms" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Bath className="w-4 h-4 text-gray-400" />
                    Bathrooms
                  </label>
                  <select
                    id="bathrooms"
                    name="bathrooms"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
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
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 font-medium">Loading properties...</p>
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Properties Found</h3>
              <p className="text-gray-600 mb-6 text-center max-w-md">
                We couldn't find any properties matching your current filters. Try adjusting your search criteria.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-500 transition-colors"
              >
                View All Properties
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container">
          <div className="bg-gray-900 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-full mb-6 w-fit">
                  <span className="text-sm font-medium text-white">Expert Guidance</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Can't Find What You're Looking For?
                </h2>
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  Our experienced team of real estate professionals is here to help you discover the perfect property that aligns with your unique lifestyle and preferences.
                </p>
                <div>
                  <a 
                    href="/contact" 
                    className="inline-flex items-center px-8 py-4 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-500 transition-colors"
                  >
                    Get in Touch
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>
              <div className="h-64 lg:h-auto">
                <img
                  src="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg"
                  alt="Luxury Real Estate"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}