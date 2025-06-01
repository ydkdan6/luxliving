import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Home, Users, MailOpen } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user } = useAuth();
  const location = useLocation();

  // Redirect if not authenticated or not admin
  if (!user || !user.email?.endsWith('@admin.com')) {
    return <Navigate to="/login" replace />;
  }

  const navigation = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Blog Posts', path: '/admin/blog-posts', icon: FileText },
    { name: 'Properties', path: '/admin/properties', icon: Home },
    { name: 'Contact Messages', path: '/admin/contact-messages', icon: MailOpen },
    { name: 'Back to Site', path: '/', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-cream-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-secondary-950 text-white">
          <div className="px-4 mb-6">
            <Link to="/admin" className="font-serif text-2xl font-bold">
              Buy<span className="text-primary-400">DubaiLuxury</span>
            </Link>
            <p className="mt-1 text-sm text-cream-400">Admin Dashboard</p>
          </div>
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-sm ${
                  location.pathname === item.path
                    ? 'bg-secondary-800 text-white'
                    : 'text-cream-300 hover:bg-secondary-800 hover:text-white'
                }`}
              >
                <item.icon
                  className={`mr-3 flex-shrink-0 h-5 w-5 ${
                    location.pathname === item.path
                      ? 'text-primary-400'
                      : 'text-cream-400 group-hover:text-primary-400'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden bg-secondary-950 text-white p-4 flex items-center justify-between">
        <Link to="/admin" className="font-serif text-2xl font-bold">
          Buy<span className="text-primary-400">DubaiLuxury</span>
        </Link>
        {/* Mobile menu button would go here */}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-cream-50">
          <div className="py-6">
            <div className="px-4 sm:px-6 md:px-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}