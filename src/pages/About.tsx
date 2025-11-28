import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';

export default function About() {
  return (
    <Layout>
      <div className="bg-white text-black">
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
                About Us
              </span>
              <h1 className="mb-6">Redefining Luxury Living</h1>
              <p className="text-xl mb-8">
                We are dedicated to providing exceptional luxury real estate services and lifestyle experiences to our discerning clientele.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <img
                  src="https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg"
                  alt="Luxury Building"
                  className="rounded-sm"
                  loading='lazy'
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="mb-6">Our Story</h2>
                <p className="text-black mb-6">
                  Founded with a vision to revolutionize the luxury real estate market, we have consistently delivered unparalleled service and exceptional properties to our clients for over a decade.
                </p>
                <p className="text-black">
                  Our commitment to excellence and attention to detail has earned us the trust of the most discerning clients worldwide.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="mb-6">Our Core Values</h2>
              <p className="text-black max-w-2xl mx-auto">
                These principles guide everything we do and ensure we maintain the highest standards in luxury real estate.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Excellence",
                  description: "We strive for excellence in every aspect of our service, ensuring the highest standards are met."
                },
                {
                  title: "Integrity",
                  description: "Trust and transparency form the foundation of our relationships with clients."
                },
                {
                  title: "Innovation",
                  description: "We continuously evolve and adapt to provide cutting-edge solutions in luxury real estate."
                }
              ].map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="p-8 bg-primary-500 rounded-xl"
                >
                  <h3 className="text-xl font-serif mb-4">{value.title}</h3>
                  <p className="text-black">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="mb-6">Our Leadership Team</h2>
              <p className="text-black max-w-2xl mx-auto">
                Meet the experts who make luxury living a reality.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1].map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="mb-4 overflow-hidden rounded-sm">
                    <img
                      src={`https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg`}
                      alt={`Team Member ${member}`}
                      className="w-full transition-transform duration-300 hover:scale-110"
                      loading='lazy'
                    />
                  </div>
                  <h3 className="text-xl font-serif mb-2">Stanley Dike</h3>
                  <p className="text-primary-400">CEO</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}