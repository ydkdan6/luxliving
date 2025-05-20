import React from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

export default function NewsletterSignup() {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }]);

      if (error) throw error;

      toast.success('Welcome to our community! Check your inbox for exclusive content.');
      setEmail('');

      // Send welcome email through Edge Function
      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/welcome-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-secondary-950 p-8 rounded-sm"
    >
      <div className="flex items-center gap-4 mb-6 ">
        <div className="p-3 bg-primary-500 rounded-sm">
          <Mail className="w-6 h-6 text-secondary-900" />
        </div>
        <div>
          <h3 className="text-xl font-serif mb-1">Subscribe to Our Newsletter</h3>
          <p className="text-cream-300">Get exclusive content and luxury insights</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="input-field"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? 'Subscribing...' : 'Subscribe Now'}
        </button>
      </form>
    </motion.div>
  );
}