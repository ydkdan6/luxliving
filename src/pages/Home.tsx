import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, BookOpen, MessageSquare, Send, TrendingUp, Users, Calendar, Star, BadgePercent, DollarSign, Award, Plane, Globe2, Bed, Bath, Square, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { BlogPost, Property } from '../types';
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
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [propertyImageIndices, setPropertyImageIndices] = useState<{ [key: string]: number }>({});
  const navigate = useNavigate();
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

    const fetchProperties = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(9);

        if (error) throw error;
        setProperties(data || []);
        
        // Initialize image indices for each property
        const indices: { [key: string]: number } = {};
        data?.forEach(property => {
          indices[property.id] = 0;
        });
        setPropertyImageIndices(indices);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setIsLoadingProperties(false);
      }
    };

    fetchFeaturedPosts();
    fetchProperties();

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
        .insert([{
          name: contactForm.name,
          email: contactForm.email,
          number: contactForm.number,
          message: contactForm.message,
          source: 'contact_form'
        }]);

      if (error) throw error;

      toast.success('Message sent successfully!');
      setContactForm({ name: '', email: '', number: '', message: '' });
      setShowContactForm(false);
    } catch (error) {
      console.error('Error sending message:', error);
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
          message: 'Quick inquiry from hero section',
          source: 'hero_form'
        }]);

      if (error) throw error;

      setShowSuccessModal(true);
      setHeroContactForm({ name: '', email: '', phone: '' });
      
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  const handlePropertyImageNext = (propertyId: string, imageCount: number) => {
    setPropertyImageIndices(prev => ({
      ...prev,
      [propertyId]: ((prev[propertyId] || 0) + 1) % imageCount
    }));
  };

  const handlePropertyImagePrev = (propertyId: string, imageCount: number) => {
    setPropertyImageIndices(prev => ({
      ...prev,
      [propertyId]: ((prev[propertyId] || 0) - 1 + imageCount) % imageCount
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
            className="max-w-5xl text-cream-100 mt-[150px] md:mt-0"
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
      <section className="py-12 sm:py-16 md:py-10 bg-white">
        <div className="container w-full">
          <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-14 justify-center items-start lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8 lg:mb-12 w-full lg:w-auto"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-900 mb-4 md:mb-6">
                WHY BUYDUBAILUXURY?
              </h2>
              <div className="space-y-3 md:space-y-4 text-secondary-700 leading-relaxed max-w-3xl text-sm sm:text-base">
                <p className="text-justify">
                  BuyDubaiLuxury is a private, independent investment advisory platform created to help global investors, especially Canadians and immigrants across North America, 
                  explore carefully selected real estate opportunities in Dubai with clarity and confidence.
                </p>
                <p className="text-justify">
                  We know that investing in 
                  another country can feel confusing and risky. Not knowing who to trust, 
                  worrying about being pressured, or feeling like you might be left on your
                   own are common concerns. That is why we take a different approach.

We do not “sell” property. We focus on education, clear communication, and introducing you to reputable, 
on-ground partners such as established developers and RERA-registered brokers in the UAE.
                </p>
                <p className="text-justify">
                  Our support does not end after an introduction or a purchase. We stay connected to you throughout your journey, whether you are still exploring, actively investing, managing your property, thinking of selling, or simply planning your next move. You will not be ghosted or left in the dark.

No pressure. No hype. No inflated promises.
Just guidance you can trust and a long-term relationship you can rely on.
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
                    <h3 className="text-base sm:text-lg md:text-[16px] font-bold text-primary-500 mb-1 uppercase tracking-wide">
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

      {/* Trusted Partners Section - Animated Logo Carousel */}
      <section className="py-16 sm:py-20 md:py-10 bg-white overflow-hidden">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <span className="inline-block px-6 py-2 mb-4 text-xs font-medium tracking-wider uppercase bg-primary-500/10 text-primary-500 rounded-full border border-primary-500/20">
              Our Partners
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-secondary-900 mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-base sm:text-lg text-secondary-600 max-w-2xl mx-auto">
              We collaborate with the most prestigious developers and brands in Dubai's luxury real estate market
            </p>
          </motion.div>

          {/* Animated Logo Container with X-Pattern (Diagonal Crisscross) */}
          <div className="relative">
            {/* Top-Left to Bottom-Right Diagonal */}
            <div className="mb-8 overflow-hidden">
              <motion.div
                className="flex gap-12 md:gap-16 lg:gap-20"
                style={{ transform: 'rotate(-3deg) translateY(-20px)' }}
                animate={{
                  x: [0, -1400],
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 35,
                    ease: "linear",
                  },
                }}
              >
                {[...Array(3)].map((_, setIndex) => (
                  <div key={setIndex} className="flex gap-12 md:gap-16 lg:gap-20 shrink-0">
                    {/* Logo 1 */}
                    <div className="group relative" style={{ transform: 'rotate(3deg)' }}>
                      <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 bg-white rounded-2xl shadow-lg flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl group-hover:rotate-6 border-2 border-transparent group-hover:border-primary-500/30">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="text-6xl sm:text-7xl md:text-8xl font-bold text-primary-500 relative z-10">E</div>
                      </div>
                    </div>

                    {/* Logo 2 */}
                    <div className="group relative" style={{ transform: 'rotate(3deg)' }}>
                      <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 bg-white rounded-2xl shadow-lg flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl group-hover:-rotate-6 border-2 border-transparent group-hover:border-primary-500/30">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="text-6xl sm:text-7xl md:text-8xl font-bold text-primary-500 relative z-10">M</div>
                      </div>
                    </div>

                    {/* Logo 3 */}
                    <div className="group relative" style={{ transform: 'rotate(3deg)' }}>
                      <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 bg-white rounded-2xl shadow-lg flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl group-hover:rotate-6 border-2 border-transparent group-hover:border-primary-500/30">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="text-6xl sm:text-7xl md:text-8xl font-bold text-primary-500 relative z-10">A</div>
                      </div>
                    </div>

                    {/* Logo 4 */}
                    <div className="group relative" style={{ transform: 'rotate(3deg)' }}>
                      <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 bg-white rounded-2xl shadow-lg flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl group-hover:-rotate-6 border-2 border-transparent group-hover:border-primary-500/30">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="text-6xl sm:text-7xl md:text-8xl font-bold text-primary-500 relative z-10">R</div>
                      </div>
                    </div>

                    {/* Logo 5 */}
                    <div className="group relative" style={{ transform: 'rotate(3deg)' }}>
                      <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 bg-white rounded-2xl shadow-lg flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl group-hover:rotate-6 border-2 border-transparent group-hover:border-primary-500/30">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="text-6xl sm:text-7xl md:text-8xl font-bold text-primary-500 relative z-10">T</div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Bottom-Right to Top-Left Diagonal (Creates X pattern) */}
            <div className="overflow-hidden">
              <motion.div
                className="flex gap-12 md:gap-16 lg:gap-20"
                style={{ transform: 'rotate(3deg) translateY(20px)' }}
                animate={{
                  x: [-1400, 0],
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 35,
                    ease: "linear",
                  },
                }}
              >
                {[...Array(3)].map((_, setIndex) => (
                  <div key={setIndex} className="flex gap-12 md:gap-16 lg:gap-20 shrink-0">
                    {/* Logo 1 */}
                    <div className="group relative" style={{ transform: 'rotate(-3deg)' }}>
                      <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 bg-white rounded-2xl shadow-lg flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl group-hover:-rotate-6 border-2 border-transparent group-hover:border-primary-500/30">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="text-6xl sm:text-7xl md:text-8xl font-bold text-primary-500 relative z-10">E</div>
                      </div>
                    </div>

                    {/* Logo 2 */}
                    <div className="group relative" style={{ transform: 'rotate(-3deg)' }}>
                      <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 bg-white rounded-2xl shadow-lg flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl group-hover:rotate-6 border-2 border-transparent group-hover:border-primary-500/30">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="text-6xl sm:text-7xl md:text-8xl font-bold text-primary-500 relative z-10">M</div>
                      </div>
                    </div>

                    {/* Logo 3 */}
                    <div className="group relative" style={{ transform: 'rotate(-3deg)' }}>
                      <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 bg-white rounded-2xl shadow-lg flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl group-hover:-rotate-6 border-2 border-transparent group-hover:border-primary-500/30">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="text-6xl sm:text-7xl md:text-8xl font-bold text-primary-500 relative z-10">A</div>
                      </div>
                    </div>

                    {/* Logo 4 */}
                    <div className="group relative" style={{ transform: 'rotate(-3deg)' }}>
                      <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 bg-white rounded-2xl shadow-lg flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl group-hover:rotate-6 border-2 border-transparent group-hover:border-primary-500/30">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="text-6xl sm:text-7xl md:text-8xl font-bold text-primary-500 relative z-10">R</div>
                      </div>
                    </div>

                    {/* Logo 5 */}
                    <div className="group relative" style={{ transform: 'rotate(-3deg)' }}>
                      <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 bg-white rounded-2xl shadow-lg flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl group-hover:-rotate-6 border-2 border-transparent group-hover:border-primary-500/30">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="text-6xl sm:text-7xl md:text-8xl font-bold text-primary-500 relative z-10">T</div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Gradient Overlays for smooth edge fade */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-secondary-50 to-transparent pointer-events-none z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-cream-50 to-transparent pointer-events-none z-10"></div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 sm:py-10 md:py-24 bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <span className="inline-block px-6 py-2 mb-4 text-xs font-medium tracking-wider uppercase bg-primary-500/10 text-primary-500 rounded-full border border-primary-500/20">
              Featured Properties
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-secondary-900 mb-4 sm:mb-6">
              Discover Your Dream Property
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-secondary-600 max-w-2xl mx-auto px-4">
              Explore our handpicked selection of luxury properties in Dubai's most prestigious locations
            </p>
          </motion.div>

          {isLoadingProperties ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-secondary-100 h-64 rounded-t-xl"></div>
                  <div className="bg-secondary-50 p-6 rounded-b-xl">
                    <div className="h-4 bg-secondary-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-secondary-200 rounded w-1/2 mb-4"></div>
                    <div className="h-3 bg-secondary-200 rounded w-full mb-2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : properties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
                {properties.map((property, index) => {
                  // For demo purposes, create multiple images from the single image_url
                  // In production, you'd have an array of images in your database
                  const propertyImages = [
                    property.image_url,
                    property.image_url, // These would be different images in production
                    property.image_url
                  ];
                  const currentImageIndex = propertyImageIndices[property.id] || 0;

                  return (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                    >
                      {/* Property Image Carousel */}
                      <div className="relative h-64 overflow-hidden">
                        <div 
                          className="cursor-pointer"
                          onClick={() => navigate(`/properties/${property.slug}`)}
                        >
                          <img
                            src={propertyImages[currentImageIndex]}
                            alt={property.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>

                        {/* Image Navigation Arrows */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePropertyImagePrev(property.id, propertyImages.length);
                          }}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-secondary-900 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                        >
                          <ChevronLeft size={20} />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePropertyImageNext(property.id, propertyImages.length);
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-secondary-900 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                        >
                          <ChevronRight size={20} />
                        </button>

                        {/* Image Indicators */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                          {propertyImages.map((_, imgIndex) => (
                            <button
                              key={imgIndex}
                              onClick={(e) => {
                                e.stopPropagation();
                                setPropertyImageIndices(prev => ({
                                  ...prev,
                                  [property.id]: imgIndex
                                }));
                              }}
                              className={`w-2 h-2 rounded-full transition-all ${
                                imgIndex === currentImageIndex
                                  ? 'bg-white w-6'
                                  : 'bg-white/60 hover:bg-white/80'
                              }`}
                            />
                          ))}
                        </div>

                        {/* Price Badge */}
                        <div className="absolute top-4 left-4 bg-primary-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
                          {formatCurrency(property.price)}
                        </div>
                      </div>

                      {/* Property Details */}
                      <div className="p-6">
                        <h3 
                          className="text-xl font-bold text-secondary-900 mb-2 group-hover:text-primary-500 transition-colors cursor-pointer line-clamp-1"
                          onClick={() => navigate(`/properties/${property.slug}`)}
                        >
                          {property.title}
                        </h3>

                        <div className="flex items-start gap-2 mb-4">
                          <MapPin size={16} className="text-primary-500 mt-1 flex-shrink-0" />
                          <p className="text-secondary-600 text-sm line-clamp-2">{property.address}</p>
                        </div>

                        {/* Property Features */}
                        <div className="flex items-center justify-between pt-4 border-t border-secondary-200">
                          <div className="flex items-center gap-1.5">
                            <Bed size={18} className="text-secondary-600" />
                            <span className="text-sm font-medium text-secondary-900">{property.bedrooms}</span>
                            <span className="text-xs text-secondary-600">Beds</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <Bath size={18} className="text-secondary-600" />
                            <span className="text-sm font-medium text-secondary-900">{property.bathrooms}</span>
                            <span className="text-xs text-secondary-600">Baths</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <Square size={18} className="text-secondary-600" />
                            <span className="text-sm font-medium text-secondary-900">{property.square_feet.toLocaleString()}</span>
                            <span className="text-xs text-secondary-600">sqft</span>
                          </div>
                        </div>

                        {/* View Details Button */}
                        <button
                          onClick={() => navigate(`/properties/${property.slug}`)}
                          className="w-full mt-6 bg-primary-500 hover:bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg"
                        >
                          View Details
                          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <Link
                  to="/properties"
                  className="group inline-flex items-center gap-3 text-primary-500 hover:text-primary-600 text-lg font-medium transition-colors"
                >
                  View All Properties
                  <ArrowRight size={20} className="transition-transform group-hover:translate-x-2" />
                </Link>
              </motion.div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-secondary-600 text-lg">No properties available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Blog Stats Section */}
      <section className="py-16 bg-white border-b border-secondary-200">
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
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500/10 rounded-full mb-4 group-hover:bg-primary-500/20 transition-colors border border-primary-500/20">
                  <stat.icon className="w-8 h-8 text-primary-500" />
                </div>
                <div className="text-3xl font-bold text-secondary-900 mb-2">{stat.value}</div>
                <div className="text-secondary-700 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="py-24 bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-6 py-2 mb-4 text-xs font-medium tracking-wider uppercase bg-primary-500/10 text-primary-500 rounded-full border border-primary-500/20">
              Featured Stories
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-secondary-900 mb-6">
              Latest from Our Blog
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Discover our most recent stories, insights, and explorations into the world of luxury and culture.
            </p>
          </motion.div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-secondary-100 h-64 rounded-t-lg"></div>
                  <div className="bg-secondary-50 p-6 rounded-b-lg">
                    <div className="h-4 bg-secondary-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-secondary-200 rounded w-1/2 mb-4"></div>
                    <div className="h-3 bg-secondary-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-secondary-200 rounded w-2/3"></div>
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
                  className="group inline-flex items-center gap-3 text-primary-500 hover:text-primary-600 text-lg font-medium transition-colors"
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
      <section className="py-24 bg-white">
        <div className="container max-w-4xl">
          <NewsletterSignup />
        </div>
      </section>

      {/* Additional Contact Form Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-10 md:mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-secondary-900 mb-4 sm:mb-6">
              Have Questions? Get in Touch
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-secondary-600 leading-relaxed max-w-2xl mx-auto px-4">
              Whether you're looking for property investment advice, need more information about Dubai real estate, 
              or have any inquiries about our services, we're here to help. Fill out the form below and our team 
              will get back to you within 24 hours.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-secondary-50 to-cream-50 rounded-2xl p-6 sm:p-8 md:p-10 shadow-xl"
          >
            <form onSubmit={handleContactSubmit} className="space-y-5 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-semibold text-secondary-900 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="contact-name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 text-secondary-900 bg-white border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-secondary-400 text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-semibold text-secondary-900 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 text-secondary-900 bg-white border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-secondary-400 text-sm sm:text-base"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-number" className="block text-sm font-semibold text-secondary-900 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="contact-number"
                  value={contactForm.number}
                  onChange={(e) => setContactForm(prev => ({ ...prev, number: e.target.value }))}
                  placeholder="+971 XX XXX XXXX"
                  className="w-full px-4 py-3 text-secondary-900 bg-white border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-secondary-400 text-sm sm:text-base"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="contact-message" className="block text-sm font-semibold text-secondary-900 mb-2">
                  Your Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="contact-message"
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  rows={5}
                  placeholder="Tell us about your inquiry, property preferences, or any questions you may have..."
                  className="w-full px-4 py-3 text-secondary-900 bg-white border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none placeholder:text-secondary-400 text-sm sm:text-base"
                  required
                ></textarea>
              </div>
              
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 sm:py-4 px-6 sm:px-8 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-3 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  <Send size={20} />
                  Send Message
                </button>
              </div>

              <p className="text-xs sm:text-sm text-primary-500 text-center mt-4">
                By submitting this form, you agree to our privacy policy and terms of service.
              </p>
            </form>
          </motion.div>
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