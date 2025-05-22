import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BlogPost } from '../../types';
import { formatDate } from '../../utils/formatters';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  return (
    <motion.article
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={`card overflow-hidden h-full flex flex-col ${
        featured ? 'md:flex-row' : ''
      }`}
    >
      <Link
        to={`/blog/${post.slug}`}
        className={`block overflow-hidden ${
          featured ? 'md:w-1/2' : 'aspect-[16/9]'
        }`}
      >
        <img
          src={post.image_url}
          alt={post.title}
          className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
        />
      </Link>
      <div
        className={`flex flex-col p-6 ${featured ? 'md:w-1/2 md:p-8' : ''}`}
      >
        <div className="mb-2">
          <span className="inline-block px-3 py-1 mb-2 text-xs font-medium uppercase rounded-sm text-primary-700 bg-secondary-900">
            {post.category_name}
          </span>
          <time className="text-sm text-secondary-500">
            {formatDate(post.created_at)}
          </time>
        </div>
        <Link to={`/blog/${post.slug}`}>
          <h3
            className={`font-medium transition-colors hover:text-primary-600 ${
              featured ? 'text-2xl md:text-3xl mb-4' : 'text-xl mb-2'
            }`}
          >
            {post.title}
          </h3>
        </Link>
        <p className="mb-4 text-primary-900">{post.excerpt}</p>
        <div className="mt-auto">
          <Link
            to={`/blog/${post.slug}`}
            className="inline-flex items-center font-medium transition-colors text-primary-900 hover:text-primary-700"
          >
            Read Article
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}