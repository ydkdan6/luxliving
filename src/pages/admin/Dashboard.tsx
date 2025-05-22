import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Home, MailOpen, Users, TrendingUp, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AdminLayout from './AdminLayout';

export default function Dashboard() {
  const [stats, setStats] = useState({
    posts: 0,
    properties: 0,
    inquiries: 0,
    users: 0,
  });
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch blog post count
        const { count: postsCount, error: postsError } = await supabase
          .from('blog_posts')
          .select('*', { count: 'exact', head: true });

        if (postsError) throw postsError;

        // Fetch properties count
        const { count: propertiesCount, error: propertiesError } = await supabase
          .from('properties')
          .select('*', { count: 'exact', head: true });

        if (propertiesError) throw propertiesError;

        // Fetch inquiries count
        const { count: inquiriesCount, error: inquiriesError } = await supabase
          .from('contact_forms')
          .select('*', { count: 'exact', head: true });

        if (inquiriesError) throw inquiriesError;

        // Fetch users count
        const { count: usersCount, error: usersError } = await supabase
          .from('auth.users')
          .select('*', { count: 'exact', head: true });

        if (usersError) throw usersError;

        setStats({
          posts: postsCount || 0,
          properties: propertiesCount || 0,
          inquiries: inquiriesCount || 0,
          users: usersCount || 0,
        });

        // Fetch recent inquiries
        const { data: recentData, error: recentError } = await supabase
          .from('contact_forms')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (recentError) throw recentError;
        setRecentInquiries(recentData || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      title: 'Blog Posts',
      value: stats.posts,
      icon: FileText,
      color: 'bg-blue-500',
      path: '/admin/blog-posts',
    },
    {
      title: 'Properties',
      value: stats.properties,
      icon: Home,
      color: 'bg-green-500',
      path: '/admin/properties',
    },
    {
      title: 'Inquiries',
      value: stats.inquiries,
      icon: MailOpen,
      color: 'bg-yellow-500',
      path: '/admin/inquiries',
    },
    {
      title: 'Registered Users',
      value: stats.users,
      icon: Users,
      color: 'bg-purple-500',
      path: '/admin/users',
    },
  ];

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-medium text-secondary-900">Dashboard</h1>
        <p className="mt-1 text-secondary-900">Welcome to your admin dashboard.</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading dashboard data...</div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 mb-10 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-sm shadow-sm"
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${stat.color} text-white`}>
                    <stat.icon size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-secondary-900">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-semibold text-secondary-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <Link
                    to={stat.path}
                    className="flex items-center text-sm font-medium text-secondary-900 hover:text-primary-800"
                  >
                    View Details
                    <Eye size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Recent Inquiries */}
            <div className="p-6 bg-white rounded-sm shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium text-secondary-900">
                  Recent Inquiries
                </h2>
                <Link
                  to="/admin/inquiries"
                  className="text-sm font-medium text-secondary-900 hover:text-primary-800"
                >
                  View All
                </Link>
              </div>
              
              {recentInquiries.length > 0 ? (
                <div className="space-y-4">
                  {recentInquiries.map((inquiry, index) => (
                    <div
                      key={index}
                      className="p-4 border-l-4 border-primary-500 bg-cream-50"
                    >
                      <div className="flex justify-between">
                        <p className="font-medium">
                          {inquiry.first_name} {inquiry.last_name}
                        </p>
                        <p className="text-sm text-secondary-900">
                          {new Date(inquiry.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-secondary-600">
                        {inquiry.email} • {inquiry.phone}
                      </p>
                      <p className="mt-2 text-sm">
                        {inquiry.message.substring(0, 100)}
                        {inquiry.message.length > 100 ? '...' : ''}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-secondary-900">No recent inquiries.</p>
              )}
            </div>

            {/* Quick Stats */}
            <div className="p-6 bg-white rounded-sm shadow-sm">
              <h2 className="mb-6 text-xl font-medium text-secondary-900">
                Performance Overview
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-cream-50 rounded-sm">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-secondary-900">Website Traffic</p>
                    <div className="flex items-center text-green-600">
                      <TrendingUp size={16} className="mr-1" />
                      <span>32% ↑</span>
                    </div>
                  </div>
                  <div className="mt-4 h-2 bg-cream-200 rounded-full">
                    <div className="h-2 bg-primary-500 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                
                <div className="p-4 bg-cream-50 rounded-sm">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-secondary-900">New Inquiries</p>
                    <div className="flex items-center text-green-600">
                      <TrendingUp size={16} className="mr-1" />
                      <span>12% ↑</span>
                    </div>
                  </div>
                  <div className="mt-4 h-2 bg-cream-200 rounded-full">
                    <div className="h-2 bg-primary-500 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                
                <div className="p-4 bg-cream-50 rounded-sm">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-secondary-900">Blog Engagement</p>
                    <div className="flex items-center text-green-600">
                      <TrendingUp size={16} className="mr-1" />
                      <span>28% ↑</span>
                    </div>
                  </div>
                  <div className="mt-4 h-2 bg-cream-200 rounded-full">
                    <div className="h-2 bg-primary-500 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}