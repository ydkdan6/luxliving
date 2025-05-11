import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import ScrollReveal from 'scrollreveal';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

function Root() {
  useEffect(() => {
    // Initialize ScrollReveal
    ScrollReveal().reveal('.reveal', {
      distance: '60px',
      duration: 1200,
      delay: 200,
      easing: 'cubic-bezier(0.5, 0, 0, 1)',
    });

    // Handle preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(() => {
        preloader.classList.add('preloader-fade-out');
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 500);
      }, 1000);
    }
  }, []);

  return (
    <StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<Root />);