import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePage = location.pathname === '/';
  const headerClass = `fixed top-0 w-full z-50 transition-all duration-300 ${
    isScrolled || !isHomePage
      ? 'bg-black shadow-md py-1'
      : 'bg-black py-1'
  }`;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: 'Properties', path: '/properties' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className={headerClass}>
      <div className="container flex items-center justify-between px-6">
        <Link to="/" className="font-serif text-3xl font-bold text-secondary-900">
        <img
            src="/logo.png"
            alt="Luxury Property"
            className="w-[180px] h-[74px]"
          />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-medium transition-colors hover:text-primary-500 ${
                location.pathname === link.path
                  ? 'text-primary-500'
                  : isScrolled || !isHomePage
                  ? 'text-secondary-800'
                  : 'text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
          {user ? (
            <div className="relative group">
              <button className="flex items-center space-x-1 p-2 rounded-full bg-cream-100">
                <User size={20} className="text-secondary-800" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-sm shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="p-3 border-b border-cream-200">
                  <p className="text-sm font-medium">{user.email}</p>
                </div>
                {user.email?.endsWith('@admin.com') && (
                  <Link
                    to="/admin"
                    className="block px-4 py-2 text-sm text-secondary-700 hover:bg-cream-100"
                    onClick={closeMenu}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left px-4 py-2 text-sm text-secondary-700 hover:bg-cream-100"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className={`font-medium transition-colors hover:text-primary-500 ${
                isScrolled || !isHomePage ? 'text-secondary-800' : 'text-white'
              }`}
            >
              Sign In
            </Link>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="p-2 md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X
              size={24}
              className={
                isScrolled || !isHomePage
                  ? 'text-secondary-800'
                  : 'text-white'
              }
            />
          ) : (
            <Menu
              size={24}
              className={
                isScrolled || !isHomePage
                  ? 'text-secondary-800'
                  : 'text-white'
              }
            />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white shadow-lg"
          >
            <nav className="container py-4 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`py-2 font-medium ${
                    location.pathname === link.path
                      ? 'text-primary-500'
                      : 'text-secondary-800'
                  }`}
                  onClick={closeMenu}
                >
                  {link.name}
                </Link>
              ))}
              {user ? (
                <>
                  <div className="py-2 border-t border-cream-200">
                    <p className="text-sm font-medium">{user.email}</p>
                  </div>
                  {user.email?.endsWith('@admin.com') && (
                    <Link
                      to="/admin"
                      className="py-2 text-secondary-700"
                      onClick={closeMenu}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      signOut();
                      closeMenu();
                    }}
                    className="py-2 text-left text-secondary-700"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="py-2 font-medium text-secondary-800"
                  onClick={closeMenu}
                >
                  Sign In
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}