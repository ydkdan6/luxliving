import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary-950 text-cream-100 px-6">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link to="/" className="font-serif text-3xl font-bold text-white">
              Buy<span className="text-primary-400">DubaiLuxury</span>
            </Link>
            <p className="mt-4 text-cream-300">
              Curating luxury experiences and properties for the discerning individual.
            </p>
            <div className="flex mt-6 space-x-4">
              <a
                href="https://www.instagram.com/buydubailuxury?igsh=czF2Z2NhdXV5czhk"
                className="p-2 transition-colors rounded-full text-cream-300 hover:text-primary-400 hover:bg-secondary-800"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="p-2 transition-colors rounded-full text-cream-300 hover:text-primary-400 hover:bg-secondary-800"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="p-2 transition-colors rounded-full text-cream-300 hover:text-primary-400 hover:bg-secondary-800"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-medium text-white">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="transition-colors hover:text-primary-400">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/blog" className="transition-colors hover:text-primary-400">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/properties" className="transition-colors hover:text-primary-400">
                  Properties
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition-colors hover:text-primary-400">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition-colors hover:text-primary-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-medium text-white">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="transition-colors hover:text-primary-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="transition-colors hover:text-primary-400">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="transition-colors hover:text-primary-400">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-medium text-white">Contact Us</h3>
            <address className="not-italic">
              <p>1234 Luxury Avenue</p>
              <p>Beverly Hills, CA 90210</p>
              <p className="mt-2">+1 437 559-5135</p>
              <p>info@buydubailuxury.com</p>
            </address>
          </div>
        </div>

        <div className="pt-8 mt-12 border-t border-secondary-800">
          <p className="text-center text-cream-400">
            &copy; {currentYear} BuyDubaiLuxury. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}