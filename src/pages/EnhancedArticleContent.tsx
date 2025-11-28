import React, { useEffect, useRef } from 'react';

// Enhanced Article Content Component
const EnhancedArticleContent = ({ content }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      // Add reading progress indicators
      const headings = contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach((heading, index) => {
        heading.setAttribute('data-reading-progress', index);
      });

      // Add copy buttons to code blocks
      const codeBlocks = contentRef.current.querySelectorAll('pre');
      codeBlocks.forEach((block) => {
        const copyButton = document.createElement('button');
        copyButton.innerHTML = `
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
        `;
        copyButton.className = 'absolute top-4 right-4 p-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors opacity-0 group-hover:opacity-100';
        copyButton.onclick = () => {
          navigator.clipboard.writeText(block.textContent);
          copyButton.innerHTML = `
            <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          `;
          setTimeout(() => {
            copyButton.innerHTML = `
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            `;
          }, 2000);
        };
        block.style.position = 'relative';
        block.classList.add('group');
        block.appendChild(copyButton);
      });

      // Add image zoom functionality
      const images = contentRef.current.querySelectorAll('img');
      images.forEach((img) => {
        img.style.cursor = 'zoom-in';
        img.onclick = () => {
          const modal = document.createElement('div');
          modal.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4';
          modal.innerHTML = `
            <div class="relative max-w-full max-h-full">
              <img src="${img.src}" alt="${img.alt}" loading="lazy" class="max-w-full max-h-full object-contain rounded-lg shadow-2xl">
              <button class="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          `;
          modal.onclick = (e) => {
            if (e.target === modal || e.target.closest('button')) {
              modal.remove();
            }
          };
          document.body.appendChild(modal);
        };
      });

      // Add table enhancements
      const tables = contentRef.current.querySelectorAll('table');
      tables.forEach((table) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'table-wrapper overflow-x-auto shadow-lg rounded-lg border border-gray-200 my-8';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
        table.className = 'min-w-full divide-y divide-gray-200';
      });
    }
  }, [content]);

  return (
    <div className="relative">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-40">
        <div 
          className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300 ease-out"
          style={{
            width: '0%', // This would be calculated based on scroll position
          }}
        ></div>
      </div>

      <article 
        ref={contentRef}
        className="enhanced-article-content prose prose-xl max-w-none 
          /* Enhanced Headings with Animations */
          prose-headings:font-bold prose-headings:text-secondary-900 prose-headings:tracking-tight prose-headings:scroll-mt-24
          prose-h1:text-5xl prose-h1:leading-tight prose-h1:mb-12 prose-h1:mt-20 prose-h1:pb-6 
          prose-h1:border-b-4 prose-h1:border-gradient-to-r prose-h1:from-primary-500 prose-h1:to-primary-600
          prose-h1:relative prose-h1:overflow-hidden
          
          prose-h2:text-4xl prose-h2:leading-tight prose-h2:mb-10 prose-h2:mt-16 prose-h2:text-secondary-800 
          prose-h2:relative prose-h2:pb-4 prose-h2:flex prose-h2:items-center
          
          prose-h3:text-3xl prose-h3:mb-8 prose-h3:mt-14 prose-h3:text-secondary-700 prose-h3:font-semibold
          prose-h3:relative prose-h3:pl-6
          
          prose-h4:text-2xl prose-h4:mb-6 prose-h4:mt-10 prose-h4:text-secondary-700 prose-h4:font-medium
          prose-h4:border-l-4 prose-h4:border-primary-400 prose-h4:pl-6 prose-h4:py-2
          
          prose-h5:text-xl prose-h5:mb-4 prose-h5:mt-8 prose-h5:text-secondary-600 prose-h5:font-medium
          prose-h5:bg-gradient-to-r prose-h5:from-gray-50 prose-h5:to-gray-100 prose-h5:px-4 prose-h5:py-2 prose-h5:rounded-lg
          
          prose-h6:text-lg prose-h6:mb-3 prose-h6:mt-6 prose-h6:text-secondary-600 prose-h6:font-medium 
          prose-h6:uppercase prose-h6:tracking-wide prose-h6:border-b prose-h6:border-dotted prose-h6:border-gray-300 prose-h6:pb-2
          
          /* Enhanced Paragraphs */
          prose-p:text-secondary-700 prose-p:leading-8 prose-p:mb-8 prose-p:text-lg prose-p:font-light
          prose-p:relative prose-p:z-10
          
          /* First paragraph special styling */
          prose-p:first-of-type:text-xl prose-p:first-of-type:leading-9 prose-p:first-of-type:mb-12 
          prose-p:first-of-type:text-secondary-800 prose-p:first-of-type:font-normal
          prose-p:first-of-type:bg-gradient-to-r prose-p:first-of-type:from-primary-50 prose-p:first-of-type:to-cream-50
          prose-p:first-of-type:p-8 prose-p:first-of-type:rounded-2xl prose-p:first-of-type:border-l-4 prose-p:first-of-type:border-primary-500
          prose-p:first-of-type:shadow-sm
          
          /* Enhanced Links */
          prose-a:text-primary-600 prose-a:font-medium prose-a:no-underline prose-a:relative prose-a:z-20
          prose-a:bg-gradient-to-r prose-a:from-primary-100 prose-a:to-primary-200 prose-a:px-2 prose-a:py-1 prose-a:rounded
          hover:prose-a:from-primary-200 hover:prose-a:to-primary-300 hover:prose-a:text-primary-700 
          prose-a:transition-all prose-a:duration-200 prose-a:transform hover:prose-a:scale-105
          
          /* Enhanced Text Styling */
          prose-strong:text-secondary-900 prose-strong:font-bold prose-strong:bg-yellow-100 
          prose-strong:px-2 prose-strong:py-1 prose-strong:rounded prose-strong:shadow-sm
          prose-strong:border-l-2 prose-strong:border-yellow-400
          
          prose-em:text-secondary-600 prose-em:font-medium prose-em:not-italic prose-em:bg-blue-50 
          prose-em:px-2 prose-em:py-1 prose-em:rounded prose-em:border prose-em:border-blue-200
          
          /* Enhanced Lists */
          prose-ul:mb-10 prose-ul:space-y-4 prose-ul:pl-0
          prose-ol:mb-10 prose-ol:space-y-4 prose-ol:pl-0
          prose-li:text-secondary-700 prose-li:leading-8 prose-li:relative prose-li:pl-12 prose-li:text-lg
          prose-li:bg-white prose-li:p-4 prose-li:rounded-xl prose-li:shadow-sm prose-li:border prose-li:border-gray-100
          prose-li:hover:shadow-md prose-li:hover:border-primary-200 prose-li:transition-all prose-li:duration-200
          prose-li:hover:transform prose-li:hover:translateX-2
          
          prose-ul>prose-li:before:absolute prose-ul>prose-li:before:left-4 prose-ul>prose-li:before:top-4
          prose-ul>prose-li:before:content-[''] prose-ul>prose-li:before:w-3 prose-ul>prose-li:before:h-3
          prose-ul>prose-li:before:bg-gradient-to-br prose-ul>prose-li:before:from-primary-500 prose-ul>prose-li:before:to-primary-600
          prose-ul>prose-li:before:rounded-full prose-ul>prose-li:before:shadow-sm
          
          prose-ol>prose-li:before:absolute prose-ol>prose-li:before:left-2 prose-ol>prose-li:before:top-3
          prose-ol>prose-li:before:content-[counter(list-item)] prose-ol>prose-li:before:bg-gradient-to-br 
          prose-ol>prose-li:before:from-primary-500 prose-ol>prose-li:before:to-primary-600 prose-ol>prose-li:before:text-white 
          prose-ol>prose-li:before:w-8 prose-ol>prose-li:before:h-8 prose-ol>prose-li:before:rounded-full 
          prose-ol>prose-li:before:flex prose-ol>prose-li:before:items-center prose-ol>prose-li:before:justify-center 
          prose-ol>prose-li:before:text-sm prose-ol>prose-li:before:font-bold prose-ol>prose-li:before:shadow-md
          
          /* Enhanced Blockquotes */
          prose-blockquote:border-l-0 prose-blockquote:bg-gradient-to-br prose-blockquote:from-primary-50 
          prose-blockquote:via-white prose-blockquote:to-primary-50 prose-blockquote:rounded-2xl 
          prose-blockquote:p-10 prose-blockquote:not-italic prose-blockquote:text-secondary-800 prose-blockquote:text-xl 
          prose-blockquote:leading-9 prose-blockquote:font-medium prose-blockquote:shadow-xl prose-blockquote:my-12
          prose-blockquote:border prose-blockquote:border-primary-200 prose-blockquote:relative prose-blockquote:overflow-hidden
          prose-blockquote:before:content-[''] prose-blockquote:after:content-['']
          
          /* Enhanced Code */
          prose-code:bg-gradient-to-r prose-code:from-gray-100 prose-code:to-gray-200 prose-code:text-secondary-800 
          prose-code:px-3 prose-code:py-1 prose-code:rounded-lg prose-code:text-base prose-code:font-mono 
          prose-code:border prose-code:border-gray-300 prose-code:shadow-sm prose-code:font-semibold
          
          prose-pre:bg-gradient-to-br prose-pre:from-gray-900 prose-pre:to-gray-800 prose-pre:text-gray-100 
          prose-pre:rounded-2xl prose-pre:p-8 prose-pre:shadow-2xl prose-pre:my-10 prose-pre:border 
          prose-pre:border-gray-700 prose-pre:overflow-x-auto prose-pre:relative prose-pre:group
          
          /* Enhanced Images */
          prose-img:rounded-2xl prose-img:shadow-2xl prose-img:my-16 prose-img:border-2 prose-img:border-white
          prose-img:hover:shadow-3xl prose-img:transition-all prose-img:duration-300 prose-img:hover:scale-105
          prose-img:ring-4 prose-img:ring-gray-100
          
          prose-figure:my-16 prose-figcaption:text-center prose-figcaption:text-secondary-600 
          prose-figcaption:mt-6 prose-figcaption:italic prose-figcaption:bg-gray-50 prose-figcaption:px-6 
          prose-figcaption:py-4 prose-figcaption:rounded-lg prose-figcaption:border prose-figcaption:border-gray-200
          
          /* Enhanced Tables */
          prose-table:border-collapse prose-table:border-0 prose-table:rounded-2xl prose-table:overflow-hidden 
          prose-table:shadow-2xl prose-table:my-12 prose-table:bg-white
          
          prose-thead:bg-gradient-to-r prose-thead:from-primary-600 prose-thead:to-primary-700
          prose-th:border-0 prose-th:p-6 prose-th:text-left prose-th:font-bold prose-th:text-white prose-th:uppercase prose-th:tracking-wide
          
          prose-td:border-0 prose-td:p-6 prose-td:text-secondary-700 prose-td:border-b prose-td:border-gray-100
          prose-tbody prose-tr:hover:bg-primary-25 prose-tbody prose-tr:transition-colors prose-tbody prose-tr:duration-200
          
          /* Enhanced HR */
          prose-hr:border-0 prose-hr:my-20 prose-hr:h-1 prose-hr:bg-gradient-to-r prose-hr:from-transparent 
          prose-hr:via-primary-300 prose-hr:to-transparent prose-hr:rounded-full"
      >
        <div 
          className="article-content space-y-8 relative"
          dangerouslySetInnerHTML={{ __html: content }} 
        />
        
        {/* Enhanced Custom Styles */}
        <style jsx>{`
          .enhanced-article-content {
            --primary-50: #eff6ff;
            --primary-100: #dbeafe;
            --primary-200: #bfdbfe;
            --primary-300: #93c5fd;
            --primary-400: #60a5fa;
            --primary-500: #3b82f6;
            --primary-600: #2563eb;
            --primary-700: #1d4ed8;
          }
          
          /* Drop cap for first paragraph */
          .enhanced-article-content p:first-of-type::first-letter {
            float: left;
            font-size: 5rem;
            line-height: 4rem;
            padding-right: 12px;
            padding-top: 8px;
            margin-bottom: -4px;
            font-weight: bold;
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-family: serif;
            text-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
          }
          
          /* Animated heading decorations */
          .enhanced-article-content h2::before {
            content: '●';
            color: #3b82f6;
            font-size: 1.5rem;
            margin-right: 1rem;
            animation: pulse 2s infinite;
          }
          
          .enhanced-article-content h3::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 4px;
            height: 100%;
            background: linear-gradient(to bottom, #3b82f6, #60a5fa);
            border-radius: 2px;
          }
          
          /* Blockquote enhancements */
          .enhanced-article-content blockquote::before {
            content: '"';
            position: absolute;
            top: -10px;
            left: 20px;
            font-size: 6rem;
            color: rgba(59, 130, 246, 0.2);
            font-family: serif;
            line-height: 1;
            z-index: 0;
          }
          
          .enhanced-article-content blockquote::after {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, transparent 0%, rgba(59, 130, 246, 0.05) 100%);
            pointer-events: none;
          }
          
          /* Code block enhancements */
          .enhanced-article-content pre {
            position: relative;
            backdrop-filter: blur(10px);
          }
          
          .enhanced-article-content pre::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 40px;
            background: linear-gradient(90deg, #ef4444, #f59e0b, #10b981);
            border-radius: 16px 16px 0 0;
          }
          
          .enhanced-article-content pre::after {
            content: '● ● ●';
            position: absolute;
            top: 12px;
            left: 16px;
            color: white;
            font-size: 12px;
            letter-spacing: 4px;
          }
          
          .enhanced-article-content pre code {
            display: block;
            margin-top: 40px;
            background: transparent !important;
            border: none !important;
            padding: 0 !important;
          }
          
          /* Image hover effects */
          .enhanced-article-content img {
            position: relative;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .enhanced-article-content img:hover {
            transform: scale(1.02) translateY(-4px);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          }
          
          /* Table hover effects */
          .table-wrapper {
            background: white;
          }
          
          .enhanced-article-content table thead th {
            position: relative;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          }
          
          .enhanced-article-content table tbody tr:hover {
            transform: translateX(4px);
            box-shadow: 4px 0 8px rgba(59, 130, 246, 0.1);
          }
          
          /* Link hover effects */
          .enhanced-article-content a {
            position: relative;
            overflow: hidden;
          }
          
          .enhanced-article-content a::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 2px;
            background: linear-gradient(90deg, #3b82f6, #60a5fa);
            transition: width 0.3s ease;
          }
          
          .enhanced-article-content a:hover::after {
            width: 100%;
          }
          
          /* List item animations */
          .enhanced-article-content li {
            position: relative;
            overflow: hidden;
          }
          
          .enhanced-article-content li::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
            transition: left 0.5s ease;
          }
          
          .enhanced-article-content li:hover::after {
            left: 100%;
          }
          
          /* Scroll-based animations */
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .enhanced-article-content > * {
            animation: fadeInUp 0.6s ease-out;
          }
          
          /* Responsive adjustments */
          @media (max-width: 768px) {
            .enhanced-article-content p:first-of-type::first-letter {
              font-size: 3.5rem;
              line-height: 3rem;
              padding-right: 8px;
            }
            
            .enhanced-article-content h1 {
              font-size: 2.5rem;
            }
            
            .enhanced-article-content h2 {
              font-size: 2rem;
            }
          }
          
          /* Dark mode support */
          @media (prefers-color-scheme: dark) {
            .enhanced-article-content {
              color: #f3f4f6;
            }
          }
        `}</style>
      </article>
    </div>
  );
};

// Usage in your BlogPost component:
// Replace this section:
/*
<article className="prose prose-xl max-w-none 
  [... all the existing prose classes ...]">
  
  <div className="article-content space-y-8" dangerouslySetInnerHTML={{ __html: post.content }} />
  
  <style jsx>{`
    [... existing styles ...]
  `}</style>
</article>
*/

// With this:
// <EnhancedArticleContent content={post.content} />

export default EnhancedArticleContent;