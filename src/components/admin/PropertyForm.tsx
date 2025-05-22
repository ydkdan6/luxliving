import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';
import { Property } from '../../types';

type FormData = {
  title: string;
  slug: string;
  description: string;
  price: string;
  image_url: string;
  address: string;
  bedrooms: string;
  bathrooms: string;
  square_feet: string;
  features: string;
};

interface PropertyFormProps {
  property?: Property;
  onSuccess: () => void;
}

export default function PropertyForm({ property, onSuccess }: PropertyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: property ? {
      title: property.title,
      slug: property.slug,
      description: property.description,
      price: property.price.toString(),
      image_url: property.image_url,
      address: property.address,
      bedrooms: property.bedrooms.toString(),
      bathrooms: property.bathrooms.toString(),
      square_feet: property.square_feet.toString(),
      features: property.features.join(', '),
    } : undefined,
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const featuresArray = data.features
        .split(',')
        .map(feature => feature.trim())
        .filter(feature => feature !== '');
      
      const propertyData = {
        title: data.title,
        slug: data.slug,
        description: data.description,
        price: parseFloat(data.price),
        image_url: data.image_url,
        address: data.address,
        bedrooms: parseInt(data.bedrooms),
        bathrooms: parseFloat(data.bathrooms),
        square_feet: parseInt(data.square_feet),
        features: featuresArray,
        updated_at: new Date().toISOString(),
      };
      
      if (property) {
        // Update existing property
        const { error } = await supabase
          .from('properties')
          .update(propertyData)
          .match({ id: property.id });
        
        if (error) throw error;
      } else {
        // Create new property
        const { error } = await supabase
          .from('properties')
          .insert([propertyData]);
        
        if (error) throw error;
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving property:', error);
      setErrorMessage('There was an error saving the property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateSlug = (e: React.MouseEvent) => {
    e.preventDefault();
    const titleField = document.getElementById('title') as HTMLInputElement;
    if (titleField?.value) {
      const slugField = document.getElementById('slug') as HTMLInputElement;
      const generatedSlug = titleField.value
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      slugField.value = generatedSlug;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-secondary-900 ">
      <div>
        <label htmlFor="title" className="label text-secondary-900 mr-4">Property Title</label>
        <input
          id="title"
          type="text"
          className={`input text-secondary-900 mr-4 ${errors.title ? 'border-red-500' : ''}`}
          {...register('title', { required: 'Title is required' })}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>
      
      <div className="flex items-end space-x-4">
        <div className="flex-grow">
          <label htmlFor="slug" className="label">Slug</label>
          <input
            id="slug"
            type="text"
            className={`input ${errors.slug ? 'border-red-500' : ''}`}
            {...register('slug', { required: 'Slug is required' })}
          />
          {errors.slug && (
            <p className="mt-1 text-sm text-red-500">{errors.slug.message}</p>
          )}
        </div>
        <button
          onClick={generateSlug}
          className="btn btn-outline py-2 px-3 h-[46px]"
        >
          Generate from Title
        </button>
      </div>
      
      <div>
        <label htmlFor="price" className="label text-secondary-900 mr-4">Price</label>
        <input
          id="price"
          type="number"
          step="0.01"
          min="0"
          className={`input text-secondary-900${errors.price ? 'border-red-500' : ''}`}
          {...register('price', { 
            required: 'Price is required',
            min: {
              value: 0,
              message: 'Price must be a positive number'
            }
          })}
        />
        {errors.price && (
          <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="image_url" className="label text-secondary-900 mr-4">Feature Image URL</label>
        <input
          id="image_url"
          type="text"
          className={`input text-secondary-900 mr-4${errors.image_url ? 'border-red-500' : ''}`}
          {...register('image_url', { required: 'Image URL is required' })}
        />
        {errors.image_url && (
          <p className="mt-1 text-sm text-red-500">{errors.image_url.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="address" className="label mr-4">Address</label>
        <input
          id="address"
          type="text"
          className={`input ${errors.address ? 'border-red-500' : ''}`}
          {...register('address', { required: 'Address is required' })}
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <label htmlFor="bedrooms" className="label mr-4">Bedrooms</label>
          <input
            id="bedrooms"
            type="number"
            min="0"
            className={`input ${errors.bedrooms ? 'border-red-500' : ''}`}
            {...register('bedrooms', { required: 'Required' })}
          />
          {errors.bedrooms && (
            <p className="mt-1 text-sm text-red-500">{errors.bedrooms.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="bathrooms" className="label">Bathrooms</label>
          <input
            id="bathrooms"
            type="number"
            step="0.5"
            min="0"
            className={`input ${errors.bathrooms ? 'border-red-500' : ''}`}
            {...register('bathrooms', { required: 'Required' })}
          />
          {errors.bathrooms && (
            <p className="mt-1 text-sm text-red-500">{errors.bathrooms.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="square_feet" className="label">Square Feet</label>
          <input
            id="square_feet"
            type="number"
            min="0"
            className={`input ou3tline3-black${errors.square_feet ? 'border-red-500' : ''}`}
            {...register('square_feet', { required: 'Required' })}
          />
          {errors.square_feet && (
            <p className="mt-1 text-sm text-red-500">{errors.square_feet.message}</p>
          )}
        </div>
      </div>
      
      <div>
        <label htmlFor="description" className="label mr-4">Description</label>
        <textarea
          id="description"
          rows={6}
          className={`input border-black ${errors.description ? 'border-red-500' : ''}`}
          {...register('description', { required: 'Description is required' })}
        ></textarea>
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="features" className="label mr-4">Features (comma-separated)</label>
        <input
          id="features"
          type="text"
          className={`input ${errors.features ? 'border-red-500' : ''}`}
          placeholder="Pool, Garden, Smart Home, etc."
          {...register('features')}
        />
        {errors.features && (
          <p className="mt-1 text-sm text-red-500">{errors.features.message}</p>
        )}
      </div>
      
      {errorMessage && (
        <div className="p-3 bg-red-100 text-red-700 rounded-sm">
          {errorMessage}
        </div>
      )}
      
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onSuccess}
          className="btn btn-outline"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : property ? 'Update Property' : 'Create Property'}
        </button>
      </div>
    </form>
  );
}