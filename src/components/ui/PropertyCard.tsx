import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bed, Bath, Square } from 'lucide-react';
import { Property } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="card overflow-hidden h-full flex flex-col"
    >
      <Link
        to={`/properties/${property.slug}`}
        className="block overflow-hidden aspect-[4/3]"
      >
        <img
          src={property.image_url}
          alt={property.title}
          className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
        />
      </Link>
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-2">
          <span className="text-2xl font-medium text-secondary-900">
            {formatCurrency(property.price)}
          </span>
        </div>
        <Link to={`/properties/${property.slug}`}>
          <h3 className="text-xl font-medium mb-2 transition-colors hover:text-primary-600">
            {property.title}
          </h3>
        </Link>
        <p className="text-sm text-secondary-900 mb-4">{property.address}</p>
        
        <div className="flex items-center justify-between mb-4 text-secondary-600">
          <div className="flex items-center">
            <Bed size={18} className="mr-1" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center">
            <Bath size={18} className="mr-1" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center">
            <Square size={18} className="mr-1" />
            <span>{property.square_feet} sqft</span>
          </div>
        </div>
        
        <div className="mt-auto pt-4 border-t border-cream-200">
          <Link
            to={`/properties/${property.slug}`}
            className="btn btn-primary w-full"
          >
            View Property
          </Link>
        </div>
      </div>
    </motion.div>
  );
}