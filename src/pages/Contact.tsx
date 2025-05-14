import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail } from 'lucide-react';
import Layout from '../components/layout/Layout';
import ContactForm from '../components/forms/ContactForm';

export default function Contact() {
  return (
    <Layout>
      <div className="bg-secondary-900 text-cream-100">
        {/* Hero Section */}
        <section className="relative py-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto text-center"
            >
              <span className="inline-block px-4 py-2 mb-4 text-xs font-medium tracking-wider uppercase bg-primary-500 rounded-sm">
                Contact Us
              </span>
              <h1 className="mb-6">Get in Touch</h1>
              <p className="text-xl mb-8">
                We're here to help you find your perfect luxury property. Reach out to us for personalized assistance.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-20 bg-secondary-950">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="mb-8">Contact Information</h2>
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="flex items-start"
                  >
                    <MapPin className="w-6 h-6 text-primary-400 mt-1" />
                    <div className="ml-4">
                      <h3 className="text-lg font-serif mb-2">Visit Us</h3>
                      <p className="text-cream-300">
                        123 Luxury Avenue<br />
                        Beverly Hills, CA 90210
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="flex items-start"
                  >
                    <Phone className="w-6 h-6 text-primary-400 mt-1" />
                    <div className="ml-4">
                      <h3 className="text-lg font-serif mb-2">Call Us</h3>
                      <p className="text-cream-300">+1 437 559-5135</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="flex items-start"
                  >
                    <Mail className="w-6 h-6 text-primary-400 mt-1" />
                    <div className="ml-4">
                      <h3 className="text-lg font-serif mb-2">Email Us</h3>
                      <p className="text-cream-300">info@buydubailuxury.com</p>
                    </div>
                  </motion.div>
                </div>

                <div className="mt-12">
                  <h3 className="text-lg font-serif mb-4">Office Hours</h3>
                  <div className="space-y-2 text-cream-300">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-secondary-900 p-8 rounded-sm"
              >
                <h2 className="mb-8">Send Us a Message</h2>
                <ContactForm />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-20 bg-secondary-900">
          <div className="container">
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26430.393553120906!2d-118.40042755!3d34.0736204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bc04d6d147ab%3A0xd6c7c379fd081ed1!2sBeverly%20Hills%2C%20CA%2090210!5e0!3m2!1sen!2sus!4v1620841264374!5m2!1sen!2sus"
                className="w-full h-full rounded-sm"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}