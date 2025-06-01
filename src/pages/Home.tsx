import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, BookOpen, MessageSquare, Send, TrendingUp, Users, Calendar, Star } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { BlogPost } from '../types';
import Layout from '../components/layout/Layout';
import BlogCard from '../components/ui/BlogCard';
import WelcomeModal from '../components/WelcomeModal';
import NewsletterSignup from '../components/NewsletterSignup';

const heroImages = [
  {
    url: "https://images.pexels.com/photos/618079/pexels-photo-618079.jpeg",
    title: "Dubai Marina Skyline"
  },
  {
    url: "https://images.pexels.com/photos/3787839/pexels-photo-3787839.jpeg",
    title: "Burj Khalifa at Night"
  },
  {
    url: "https://images.pexels.com/photos/4110462/pexels-photo-4110462.jpeg",
    title: "Dubai Frame"
  }
];

const blogStats = [
  { icon: BookOpen, label: "Articles Published", value: "150+" },
  { icon: Users, label: "Monthly Readers", value: "25K+" },
  { icon: TrendingUp, label: "Countries Reached", value: "45+" },
  { icon: Star, label: "Featured Stories", value: "50+" }
];

export default function Home() {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) throw error;
        setFeaturedPosts(data || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedPosts();

    // Auto-advance carousel
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([contactForm]);

      if (error) throw error;

      toast.success('Message sent successfully!');
      setContactForm({ name: '', email: '', message: '' });
      setShowContactForm(false);
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <Layout>
      <Toaster position="top-right" />

      {/* Hero Section with Carousel */}
      <section className="relative h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={heroImages[currentImageIndex].url}
              alt={heroImages[currentImageIndex].title}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-primary-900/60" />
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <button
          onClick={() => setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white p-3 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-all z-10 border border-white/20"
        >
          <ArrowLeft size={20} />
        </button>

        <button
          onClick={() => setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white p-3 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-all z-10 border border-white/20"
        >
          <ArrowRight size={20} />
        </button>

        {/* Image indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentImageIndex 
                  ? 'bg-primary-400 scale-125' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
        
        <div className="relative container h-full flex flex-col justify-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="max-w-4xl text-cream-100"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-16 h-0.5 bg-primary-400"></div>
              <span className="text-primary-400 font-medium tracking-widest uppercase text-sm">
                Welcome to Luxury Chronicles
              </span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-6xl md:text-7xl font-serif font-bold mb-6 leading-tight"
            >
              Stories That 
              <span className="block text-primary-400 italic">Inspire</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="text-xl md:text-2xl text-cream-200 mb-8 leading-relaxed max-w-2xl"
            >
              Dive into a world of luxury, culture, and sophistication. Discover stories that shape perspectives and inspire extraordinary living.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to='/blog'
                className="group bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-sm font-medium transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <BookOpen size={20} />
                Explore Stories
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              
              <button
                onClick={() => setShowContactForm(true)}
                className="group bg-transparent border-2 border-white/30 hover:border-primary-400 text-white hover:text-primary-400 px-8 py-4 rounded-sm font-medium transition-all duration-300 flex items-center gap-3 backdrop-blur-sm"
              >
                <MessageSquare size={20} />
                Get in Touch
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-8 right-8 text-white/60 flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-wider">Scroll</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-0.5 h-8 bg-gradient-to-b from-white/60 to-transparent"
          />
        </motion.div>
      </section>

      {/* Blog Stats Section */}
      <section className="py-16 bg-secondary-950 border-b border-secondary-800">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {blogStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500/10 rounded-full mb-4 group-hover:bg-primary-500/20 transition-colors">
                  <stat.icon className="w-8 h-8 text-primary-400" />
                </div>
                <div className="text-3xl font-bold text-cream-100 mb-2">{stat.value}</div>
                <div className="text-cream-300 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="py-24 bg-secondary-950">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-6 py-2 mb-4 text-xs font-medium tracking-wider uppercase bg-primary-500/10 text-primary-400 rounded-full border border-primary-500/20">
              Featured Stories
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-cream-100 mb-6">
              Latest from Our Blog
            </h2>
            <p className="text-xl text-cream-300 max-w-2xl mx-auto">
              Discover our most recent stories, insights, and explorations into the world of luxury and culture.
            </p>
          </motion.div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-secondary-900 h-64 rounded-t-lg"></div>
                  <div className="bg-secondary-900 p-6 rounded-b-lg">
                    <div className="h-4 bg-secondary-800 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-secondary-800 rounded w-1/2 mb-4"></div>
                    <div className="h-3 bg-secondary-800 rounded w-full mb-2"></div>
                    <div className="h-3 bg-secondary-800 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {featuredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <BlogCard post={post} onOpenContact={() => setShowContactForm(true)} />
                  </motion.div>
                ))}
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <Link
                  to="/blog"
                  className="group inline-flex items-center gap-3 text-primary-400 hover:text-primary-300 text-lg font-medium transition-colors"
                >
                  Explore All Stories
                  <ArrowRight size={20} className="transition-transform group-hover:translate-x-2" />
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-gradient-to-br from-secondary-900 to-secondary-950">
        <div className="container max-w-4xl">
          <NewsletterSignup />
        </div>
      </section>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-xl p-8 max-w-lg w-full shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-3xl font-serif text-secondary-900">Get in Touch</h3>
              <button
                onClick={() => setShowContactForm(false)}
                className="text-secondary-400 hover:text-secondary-600 p-2 hover:bg-secondary-100 rounded-full transition-colors"
              >
                <ArrowRight size={24} className="rotate-45 text-black" />
              </button>
            </div>
            
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-secondary-900 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 text-black border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-secondary-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 text-black border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-secondary-900 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 text-black border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-primary-500 hover:bg-primary-600 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-3 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
              >
                <Send size={20} />
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </Layout>
  );
}