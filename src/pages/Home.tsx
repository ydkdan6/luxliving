import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, BookOpen, MessageSquare, Send, TrendingUp, Users, Calendar, Star, BadgePercent, DollarSign, Award, Plane, Globe2 } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { BlogPost } from '../types';
import Layout from '../components/layout/Layout';
import BlogCard from '../components/ui/BlogCard';
import WelcomeModal from '../components/WelcomeModal';
import NewsletterSignup from '../components/NewsletterSignup';

const heroImages = [
  {
    url: "https://images.pexels.com/photos/618079/pexels-photo-618079.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    title: "Dubai Marina Skyline"
  },
  {
    url: "https://dandbdubai.ae/wp-content/uploads/2023/05/The-10-Most-Beautiful-Places-in-Dubai-1024x683.jpg",
    title: "Burj Khalifa at Night"
  },
   {
    url: "https://cdn-imgix.headout.com/media/images/b3ff7055fbb17bf08d5b6c399874c98d-Untitled-1.jpg?ar=16%3A10&auto=format&crop=faces%2Ccenter&fit=crop&h=1080&q=85&w=1920",
    title: "Burj Khalifa at Night"
  },
   {
    url: "https://www.planetware.com/wpimages/2022/11/united-arab-emirates-dubai-top-attractions-view-dubai-fountain-display.jpg",
    title: "Burj Khalifa at Night"
  },
  {
    url: "https://images.wanderon.in/blogs/new/2023/06/feature-dubai-marina-skyline-2c8f1708f2a1.jpg",
    title: "Dubai Frame"
  }
];

const whyChooseUsFeatures = [
  {
    icon: BadgePercent,
    title: "ZERO TAXES",
    description: "No income or capital gains tax"
  },
  {
    icon: TrendingUp,
    title: "UP TO 20%",
    description: "Capital Growth"
    // description: "Exceptional investment returns"
  },
  {
    icon: DollarSign,
    title: "10% DOWNPAYMENT",
    description: "Flexible Payments",
    // description: "Flexible Payments"
  },
  {
    icon: Award,
    title: "GOLDEN VISA",
    description: "10-Year Residency with property investment"
  },
  {
    icon: Plane,
    title: "WORLD-CLASS INFRASTRUCTURE",
    description: "Airports unmatched globally"
  },
  {
    icon: Globe2,
    title: "GLOBAL RECOGNITION",
    description: "Home to over 200 nationalities"
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
    number: '',
    message: ''
  });
  const [heroContactForm, setHeroContactForm] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
      setContactForm({ name: '', email: '', number: '', message: '' });
      setShowContactForm(false);
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  const handleHeroContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([{ 
          name: heroContactForm.name, 
          email: heroContactForm.email, 
          number: heroContactForm.phone,
          message: 'Quick inquiry from hero section' 
        }]);

      if (error) throw error;

      setShowSuccessModal(true);
      setHeroContactForm({ name: '', email: '', phone: '' });
      
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <Layout>
      <Toaster position="top-right" />

      {/* Hero Section with Carousel */}
      <section className="relative h-[700px] overflow-hidden">
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
              loading="eager"
              fetchpriority="high"
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
            className="max-w-5xl text-cream-100"
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
              className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 leading-tight"
            >
              Stories That 
              <span className="block text-primary-400 italic">Inspire</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="text-lg md:text-xl lg:text-2xl text-cream-200 mb-8 leading-relaxed max-w-2xl"
            >
              Dive into a world of luxury, culture, and sophistication. Discover stories that shape perspectives and inspire extraordinary living.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <button
                onClick={() => setShowContactForm(true)}
                className="group bg-transparent border-2 border-white/30 hover:border-primary-400 text-white hover:text-primary-400 px-6 md:px-8 py-3 md:py-4 rounded-sm font-medium transition-all duration-300 flex items-center gap-3 backdrop-blur-sm text-sm md:text-base"
              >
                <MessageSquare size={20} />
                Contact Us
              </button>

              <Link
                to='/blog'
                className="group bg-primary-500 hover:bg-primary-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-sm font-medium transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm md:text-base"
              >
                <BookOpen size={20} />
                Explore Stories
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            {/* Hero Contact Form - Responsive Layout */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.3 }}
              className="w-full"
            >
              <div className="bg-white/95 backdrop-blur-md rounded-xl p-4 sm:p-5 md:p-6 shadow-2xl max-w-6xl">
                <form onSubmit={handleHeroContactSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-3 md:gap-4 items-stretch">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={heroContactForm.name}
                    onChange={(e) => setHeroContactForm(prev => ({ ...prev, name: e.target.value }))}
                    className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-secondary-900 bg-white border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-secondary-400 text-sm sm:text-base"
                    required
                  />
                  
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={heroContactForm.email}
                    onChange={(e) => setHeroContactForm(prev => ({ ...prev, email: e.target.value }))}
                    className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-secondary-900 bg-white border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-secondary-400 text-sm sm:text-base"
                    required
                  />

                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={heroContactForm.phone}
                    onChange={(e) => setHeroContactForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-secondary-900 bg-white border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-secondary-400 text-sm sm:text-base"
                    required
                  />
                  
                  <button
                    type="submit"
                    className="bg-primary-500 hover:bg-primary-600 text-white py-2.5 sm:py-3 px-6 sm:px-6 md:px-8 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl whitespace-nowrap text-sm sm:text-base"
                  >
                    <Send size={18} />
                    Submit
                  </button>
                </form>
              </div>
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

      {/* Why Choose Us Section - Responsive */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container w-full">
          <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-14 justify-center items-start lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8 lg:mb-12 w-full lg:w-auto"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-900 mb-4 md:mb-6">
                WHY BuyDubaiLuxury?
              </h2>
              <div className="space-y-3 md:space-y-4 text-secondary-700 leading-relaxed max-w-3xl text-sm sm:text-base">
                <p>
                  Binghatti is an award-winning developer, recognized globally for its innovative design
                  and lifestyle concepts. They've built a proven legacy, <span className="font-bold">delivering over 79+</span> projects in
                  prime Dubai communities.
                </p>
                <p>
                  Their commitment to excellence is reflected in their <span className="font-bold">on-time delivery,</span> with projects
                  consistently completed ahead of schedule, and in their premium after-sales support
                  and long-term maintenance.
                </p>
                <p>
                  The company is globally recognized, <span className="font-bold">trusted by investors from all over the world.</span>
                  Their signature architecture, with its distinctive façades and unique designs, truly
                  <span className="font-bold"> redefines Dubai's skyline.</span>
                </p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full lg:w-auto">
              {whyChooseUsFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="text-left"
                  >
                    <div className="inline-flex items-center justify-start w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 mb-0 text-primary-500">
                      <IconComponent size={40} className="sm:w-10 sm:h-10 md:w-12 md:h-12" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-primary-500 mb-1 uppercase tracking-wide">
                      {feature.title}
                    </h3>
                    {feature.subtitle && (
                      <p className="text-sm sm:text-base md:text-lg font-semibold text-secondary-700 mb-2">
                        {feature.subtitle}
                      </p>
                    )}
                    <p className="text-secondary-600 text-xs sm:text-sm md:text-base">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-scroll">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-xl p-8 max-w-lg w-full shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6 scale-75">
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
                <label htmlFor="number" className="block text-sm font-semibold text-secondary-900 mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="number"
                  value={contactForm.number}
                  onChange={(e) => setContactForm(prev => ({ ...prev, number: e.target.value }))}
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

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-2">
                Thank You!
              </h3>
              <p className="text-secondary-600 text-lg">
                Message submitted successfully. We'll get back to you soon!
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
}