import React, { useEffect, useState } from 'react';
import { Inbox, Mail, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AdminLayout from './AdminLayout';

interface Inquiry {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  property_type: string;
  message: string;
  created_at: string;
}

export default function Inquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('contact_forms')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setInquiries(data || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectInquiry = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_forms')
        .delete()
        .match({ id });
      
      if (error) throw error;
      
      // Refresh data and clear selection if deleted
      fetchInquiries();
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(null);
      }
    } catch (error) {
      console.error('Error deleting inquiry:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-medium text-secondary-900">Inquiries</h1>
        <p className="mt-1 text-secondary-600">Manage customer inquiries and leads</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading inquiries...</div>
      ) : (
        <div className="bg-white rounded-sm shadow-sm overflow-hidden">
          <div className="flex h-[calc(100vh-220px)]">
            {/* Inquiries List */}
            <div className="w-1/3 border-r border-cream-200 overflow-y-auto">
              {inquiries.length > 0 ? (
                inquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    onClick={() => handleSelectInquiry(inquiry)}
                    className={`p-4 border-b border-cream-200 cursor-pointer hover:bg-cream-50 ${
                      selectedInquiry?.id === inquiry.id
                        ? 'bg-cream-100'
                        : 'bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-secondary-900">
                          {inquiry.first_name} {inquiry.last_name}
                        </p>
                        <p className="text-sm text-secondary-600 mt-1">
                          {inquiry.email}
                        </p>
                        <p className="text-sm text-secondary-500 mt-1">
                          {new Date(inquiry.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Mail
                        size={18}
                        className={`text-primary-500 ${
                          selectedInquiry?.id === inquiry.id ? 'text-primary-700' : ''
                        }`}
                      />
                    </div>
                    <p className="text-sm text-secondary-600 mt-2 line-clamp-2">
                      {inquiry.message}
                    </p>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <Inbox size={48} className="text-secondary-400 mb-4" />
                  <p className="text-secondary-600">No inquiries found.</p>
                </div>
              )}
            </div>

            {/* Inquiry Detail */}
            <div className="w-2/3 p-6 overflow-y-auto">
              {selectedInquiry ? (
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-medium text-secondary-900">
                        {selectedInquiry.first_name} {selectedInquiry.last_name}
                      </h2>
                      <p className="text-secondary-600">
                        {new Date(selectedInquiry.created_at).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(selectedInquiry.id)}
                      className="p-2 text-secondary-500 hover:text-red-600 rounded-full hover:bg-red-50"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-cream-50 rounded-sm">
                      <p className="text-sm text-secondary-500 mb-1">Email</p>
                      <p className="font-medium">{selectedInquiry.email}</p>
                    </div>
                    <div className="p-4 bg-cream-50 rounded-sm">
                      <p className="text-sm text-secondary-500 mb-1">Phone</p>
                      <p className="font-medium">{selectedInquiry.phone}</p>
                    </div>
                    <div className="p-4 bg-cream-50 rounded-sm">
                      <p className="text-sm text-secondary-500 mb-1">Property Type Interest</p>
                      <p className="font-medium">{selectedInquiry.property_type}</p>
                    </div>
                    <div className="p-4 bg-cream-50 rounded-sm">
                      <p className="text-sm text-secondary-500 mb-1">Contact Date</p>
                      <p className="font-medium">
                        {new Date(selectedInquiry.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-medium text-secondary-900 mb-2">Message</h3>
                    <div className="p-4 bg-cream-50 rounded-sm whitespace-pre-line">
                      {selectedInquiry.message}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button className="btn btn-outline flex items-center">
                      <Mail size={18} className="mr-2" />
                      Reply via Email
                    </button>
                    <button
                      onClick={() => handleDelete(selectedInquiry.id)}
                      className="btn bg-red-600 hover:bg-red-700 text-white"
                    >
                      Delete Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Mail size={48} className="text-secondary-400 mb-4" />
                  <p className="text-secondary-600">
                    Select an inquiry to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}