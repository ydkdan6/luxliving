import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Home, MessageSquare } from 'lucide-react';
import { Toaster } from 'sonner';
import { supabase } from '../lib/supabase';
import { BlogPost, Property } from '../types';
import Layout from '../components/layout/Layout';
import BlogCard from '../components/ui/BlogCard';
import PropertyCard from '../components/ui/PropertyCard';
import ContactForm from '../components/forms/ContactForm';
// import WelcomeModal from '../components/WelcomeModal';
import NewsletterSignup from '../components/NewsletterSignup';

export default function HomePage() {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);

  useEffect(() => {
    const fetchFeaturedContent = async () => {
      try {
        const [postsData, propertiesData] = await Promise.all([
          supabase.from('blog_posts').select('*').limit(3),
          supabase.from('properties').select('*').limit(3)
        ]);

        if (postsData.error) throw postsData.error;
        if (propertiesData.error) throw propertiesData.error;

        setFeaturedPosts(postsData.data || []);
        setFeaturedProperties(propertiesData.data || []);
      } catch (error) {
        console.error('Error fetching featured content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedContent();
  }, []);

  return (
    <Layout>
      <Toaster position="top-right" />
      {/* <WelcomeModal isOpen={showWelcomeModal} onClose={() => setShowWelcomeModal(false)} /> */}

      {/* Hero Section */}
      <section className="relative h-screen pl-5">
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
            className="max-w-3xl text-cream-100"
          >
            <span className="inline-block px-4 py-2 mb-4 text-xs font-medium tracking-wider uppercase bg-primary-500 rounded-sm">
              Premium Lifestyle
            </span>
            <h1 className="mb-6">Experience Luxury Living at Its Finest</h1>
            <p className="mb-8 text-xl text-cream-100">
              Discover exceptional properties and lifestyle insights curated for the discerning individual.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/blog" className="btn-primary">
                Read Our Blog
              </Link>
              <Link to="/properties" className="btn-outline border-cream-100 text-cream-100 hover:bg-cream-100 hover:text-secondary-900">
                View Properties
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-secondary-950">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen className="w-8 h-8" />,
                title: "Expert Insights",
                description: "Dive deep into luxury living with our curated articles and expert perspectives."
              },
              {
                icon: <Home className="w-8 h-8" />,
                title: "Premium Properties",
                description: "Explore our handpicked selection of the most prestigious properties worldwide."
              },
              {
                icon: <MessageSquare className="w-8 h-8" />,
                title: "Community",
                description: "Join our community of luxury enthusiasts and property connoisseurs."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-secondary-900 p-8 rounded-sm"
              >
                <div className="text-primary-500 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-serif mb-2">{feature.title}</h3>
                <p className="text-cream-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Blog Posts Section */}
      <section className="py-20 px-6 bg-secondary-900">
        <div className="container">
          <div className="flex flex-col items-center mb-12 text-center md:flex-row md:justify-between">
            <div>
              <span className="inline-block px-4 py-2 mb-2 text-xs font-medium tracking-wider uppercase border border-primary-500 rounded-sm text-primary-500">
                Luxury Insights
              </span>
              <h2 className="text-cream-100">Latest Articles</h2>
            </div>
            <Link to="/blog" className="flex items-center mt-4 transition-colors md:mt-0 text-primary-500 hover:text-primary-400">
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

      {/* Newsletter Section */}
      <section className="py-20 flex justify-center items-center bg-secondary-950">
        <div className="container max-w-4xl">
          <NewsletterSignup />
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-20 px-6 bg-secondary-900">
        <div className="container">
          <div className="flex flex-col items-center mb-12 text-center md:flex-row md:justify-between">
            <div>
              <span className="inline-block px-4 py-2 mb-2 text-xs font-medium tracking-wider uppercase border border-primary-500 rounded-sm text-primary-500">
                Exceptional Properties
              </span>
              <h2 className="text-cream-100">Featured Listings</h2>
            </div>
            <Link to="/properties" className="flex items-center mt-4 transition-colors md:mt-0 text-primary-500 hover:text-primary-400">
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

      {/* Contact Form Section */}
      <section className="py-20 flex justify-center items-center bg-secondary-950">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 mb-2 text-xs font-medium tracking-wider uppercase border border-primary-500 rounded-sm text-primary-500">
              Get In Touch
            </span>
            <h2 className="text-cream-100 mb-4">Start Your Luxury Journey</h2>
            <p className="text-cream-300">
              Let us help you find your perfect luxury property. Fill out the form below and our experts will be in touch.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </Layout>
  );
}