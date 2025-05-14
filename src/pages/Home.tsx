import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { BlogPost, Property } from '../types';
import Layout from '../components/layout/Layout';
import BlogCard from '../components/ui/BlogCard';
import PropertyCard from '../components/ui/PropertyCard';
import ContactForm from '../components/forms/ContactForm';

// Welcome Modal Component
function WelcomeModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-28 md:left-1/3 left-4 w-11/12 max-w-sm sm:max-w-lg transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-secondary-900 to-secondary-950 p-10 lg:p-10  left-0 h-90 md:h-90 md:w-90 rounded-xl shadow-2xl z-50 max-w-lg w-full border border-secondary-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 rounded-t-xl"></div>
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-cream-100 hover:text-primary-500 transition-colors p-2 rounded-full hover:bg-secondary-800"
            >
              <X size={20} />
            </button>
            
            <div className="text-center">
              <div className="mb-6 inline-block bg-secondary-800 p-4 rounded-full">
                <img
                  src="/public/logo.png"
                  alt="LuxeLiving"
                  className="w-24 h-24 object-contain"
                />
              </div>
              
              <h2 className="text-3xl font-serif font-bold text-white mb-2">
                Welcome to <span className="text-primary-500">BuyDubai</span>
              </h2>
              
              <div className="w-16 h-1 bg-primary-500 mx-auto mb-6 rounded-full"></div>
              
              <p className="text-cream-100 mb-8 leading-relaxed">
                Discover the epitome of luxury living through our curated collection of premium properties
                and exclusive lifestyle insights.
              </p>
              
              <motion.button
                onClick={onClose}
                className="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-lg shadow-lg hover:shadow-primary-500/20 transition-all duration-300 hover:-translate-y-1"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Exploring
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function Home() {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true); // Set to true by default

  useEffect(() => {
    // Check if this is the first visit - but show modal on every visit for development/testing
    // const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    
    // if (!hasVisitedBefore) {
    //   // Show welcome modal on first visit
    //   setShowWelcomeModal(true);
    //   // Set flag in localStorage to track that user has visited before
    //   localStorage.setItem('hasVisitedBefore', 'true');
    // }

    const fetchFeaturedContent = async () => {
      try {
        // Featured blog posts
        const { data: posts, error: postsError } = await supabase
          .from('blog_posts')
          .select('*')
          .limit(3);

        if (postsError) throw postsError;
        setFeaturedPosts(posts || []);

        // Featured properties
        const { data: properties, error: propertiesError } = await supabase
          .from('properties')
          .select('*')
          .limit(3);

        if (propertiesError) throw propertiesError;
        setFeaturedProperties(properties || []);
      } catch (error) {
        console.error('Error fetching featured content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedContent();
  }, []);

  const closeWelcomeModal = () => {
    setShowWelcomeModal(false);
  };

  return (
    <Layout>
      {/* Welcome Modal */}
      <WelcomeModal isOpen={showWelcomeModal} onClose={closeWelcomeModal} />
      
      {/* Hero Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg"
            alt="Luxury Property"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        
        <div className="relative container h-full flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl text-white"
          >
            <span className="inline-block px-4 py-2 mb-4 text-xs font-medium tracking-wider uppercase bg-primary-500 rounded-sm">
              Premium Lifestyle
            </span>
            <h1 className="mb-6">Experience Luxury Living at Its Finest</h1>
            <p className="mb-8 text-xl text-cream-100">
              Discover exceptional properties and lifestyle insights curated for the discerning individual.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/properties" className="btn btn-primary">
                Explore Properties
              </Link>
              <Link to="/blog" className="btn btn-outline border-white text-white hover:bg-white hover:text-secondary-900">
                Read Our Blog
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interest Form Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div className="flex flex-col justify-center">
              <h2 className="mb-6">Find Your Perfect Luxury Property</h2>
              <p className="mb-8 text-lg text-secondary-600">
                Let us guide you to the perfect luxury property that matches your lifestyle and preferences. Fill out the form, and our expert consultants will be in touch to start your journey.
              </p>
              <div className="p-1 border border-primary-300 bg-cream-50 rounded-sm">
                <div className="grid grid-cols-2 text-center">
                  <div className="p-4 border-r border-primary-300">
                    <p className="text-4xl font-medium text-primary-500">200+</p>
                    <p className="text-secondary-700">Luxury Properties</p>
                  </div>
                  <div className="p-4">
                    <p className="text-4xl font-medium text-primary-500">98%</p>
                    <p className="text-secondary-700">Client Satisfaction</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-20 bg-cream-100">
        <div className="container">
          <div className="flex flex-col items-center mb-12 text-center md:flex-row md:justify-between">
            <div>
              <span className="inline-block px-4 py-2 mb-2 text-xs font-medium tracking-wider uppercase border border-primary-300 rounded-sm text-primary-700">
                Exceptional Properties
              </span>
              <h2>Featured Listings</h2>
            </div>
            <Link to="/properties" className="flex items-center mt-4 transition-colors md:mt-0 text-primary-700 hover:text-primary-900">
              View All Properties
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">Loading properties...</div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Blog Posts Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="flex flex-col items-center mb-12 text-center md:flex-row md:justify-between">
            <div>
              <span className="inline-block px-4 py-2 mb-2 text-xs font-medium tracking-wider uppercase border border-primary-300 rounded-sm text-primary-700">
                Luxury Insights
              </span>
              <h2>From Our Blog</h2>
            </div>
            <Link to="/blog" className="flex items-center mt-4 transition-colors md:mt-0 text-primary-700 hover:text-primary-900">
              View All Articles
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">Loading articles...</div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {featuredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-secondary-950 text-white">
        <div className="container">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 mb-2 text-xs font-medium tracking-wider uppercase border border-primary-300 rounded-sm text-primary-300">
              Client Experiences
            </span>
            <h2 className="text-white">What Our Clients Say</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[1, 2, 3].map((index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
                className="p-6 bg-secondary-900 rounded-sm"
              >
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-5 h-5 text-primary-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <blockquote className="mb-4 text-cream-100">
                  "The attention to detail and understanding of our needs exceeded our expectations. Our dream home became a reality thanks to the dedicated team at LuxeLiving."
                </blockquote>
                <div className="flex items-center">
                  <div className="ml-3">
                    <p className="font-medium">Client Name {index}</p>
                    <p className="text-sm text-cream-300">Property Owner</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}