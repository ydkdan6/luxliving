import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-dark-200 p-8 rounded-lg shadow-xl z-50 max-w-lg w-full"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-cream hover:text-primary transition-colors"
            >
              <X size={24} />
            </button>
            <div className="text-center">
              <img
                src="/logo.png"
                alt="BuyLuxeLuxury"
                className="w-32 mx-auto mb-6"
              />
              <h2 className="text-3xl font-serif font-bold text-primary mb-4">
                Welcome to BuyLuxeLuxury
              </h2>
              <p className="text-cream mb-6">
                Discover the epitome of luxury living through our curated collection of premium properties
                and exclusive lifestyle insights.
              </p>
              <button
                onClick={onClose}
                className="btn-primary"
              >
                Start Exploring
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default WelcomeModal;