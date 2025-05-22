import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Property } from '../../types';
import AdminLayout from './AdminLayout';
import PropertyForm from '../../components/admin/PropertyForm';
import { formatCurrency } from '../../utils/formatters';

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    setSelectedProperty(null);
    setIsEditing(true);
  };

  const handleEdit = (property: Property) => {
    setSelectedProperty(property);
    setIsEditing(true);
  };

  const handleDeleteClick = (propertyId: string) => {
    setPropertyToDelete(propertyId);
    setShowConfirmDelete(true);
  };

  const handleDeleteConfirm = async () => {
    if (!propertyToDelete) return;
    
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .match({ id: propertyToDelete });
      
      if (error) throw error;
      
      // Refresh data
      fetchProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
    } finally {
      setShowConfirmDelete(false);
      setPropertyToDelete(null);
    }
  };

  const handleFormSuccess = () => {
    setIsEditing(false);
    fetchProperties();
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-medium text-secondary-900">Properties</h1>
          <p className="mt-1 text-secondary-600">Manage your property listings</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="mt-4 sm:mt-0 btn btn-primary flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Add New Property
        </button>
      </div>

      {isEditing ? (
        <div className="bg-white p-6 rounded-sm shadow-sm">
          <h2 className="text-2xl font-medium mb-6 text-secondary-900">
            {selectedProperty ? 'Edit Property' : 'Add New Property'}
          </h2>
          <PropertyForm
            property={selectedProperty || undefined}
            onSuccess={handleFormSuccess}
          />
        </div>
      ) : isLoading ? (
        <div className="text-center text-secondary-900 py-12">Loading properties...</div>
      ) : (
        <div className="bg-white rounded-sm shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-cream-200">
              <thead className="bg-cream-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-secondary-900 uppercase tracking-wider"
                  >
                    Property
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-secondary-900 uppercase tracking-wider"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-secondary-900 uppercase tracking-wider"
                  >
                    Specs
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-secondary-900 uppercase tracking-wider"
                  >
                    Listed
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-secondary-900 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-cream-200">
                {properties.length > 0 ? (
                  properties.map((property) => (
                    <tr key={property.id} className="hover:bg-cream-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-sm object-cover"
                              src={property.image_url}
                              alt={property.title}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-secondary-900">
                              {property.title}
                            </div>
                            <div className="text-sm text-secondary-900">
                              {property.address}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-secondary-900">
                          {formatCurrency(property.price)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                        <div>{property.bedrooms} bd | {property.bathrooms} ba</div>
                        <div>{property.square_feet.toLocaleString()} sqft</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                        {new Date(property.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <a
                            href={`/properties/${property.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-secondary-600 hover:text-secondary-900"
                          >
                            <Eye size={18} />
                          </a>
                          <button
                            onClick={() => handleEdit(property)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(property.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-secondary-900">
                      No properties found. Add your first property!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-sm shadow-lg max-w-md w-full">
            <h3 className="text-xl font-medium mb-4 text-secondary-900">Confirm Delete</h3>
            <p className="text-secondary-600 mb-6">
              Are you sure you want to delete this property? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="btn btn-outline text-secondary-900 rounded-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="btn bg-red-600 hover:bg-red-700 text-white w-20 rounded-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}