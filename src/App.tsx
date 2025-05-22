import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import HomePage from './pages/Home';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Login from './pages/Login'; 
import About from './pages/About';
import Contact from './pages/Contact';
// import AuthHashHandler from './pages/AuthCallbackPage';
import { Toaster } from 'react-hot-toast';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import AdminBlogPosts from './pages/admin/BlogPosts';
import AdminProperties from './pages/admin/Properties';
import AdminInquiries from './pages/admin/Inquiries';
import AuthHandler from './pages/AuthCallbackPage';

function App() {
  return (
    <>
     <Toaster position="top-right" />
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/properties" element={<Properties />} />
      <Route path="/properties/:slug" element={<PropertyDetail />} />
      <Route path="/login" element={<Login />} />
      {/* <Route path="/auth/callback" element={<AuthHashHandler />} /> */}
      
      {/* Admin Routes */}
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/admin/blog-posts" element={<AdminBlogPosts />} />
      <Route path="/admin/properties" element={<AdminProperties />} />
      <Route path="/admin/inquiries" element={<AdminInquiries />} />
    </Routes>
    </>
  );
}

export default App;