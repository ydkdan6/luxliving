const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: `/blog/${post.id}`
      });
    }
  };import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, Heart, MessageCircle, Share2, BookmarkPlus, Eye } from 'lucide-react';
import type { BlogPost } from '../../types';

interface BlogCardProps {
  post: BlogPost;
  onOpenContact?: () => void; // Add callback for opening contact modal
}

export default function BlogCard({ post, onOpenContact }: BlogCardProps) {
  // Generate dummy engagement stats based on post ID for consistency
  const generateStats = (id: number) => {
    // Ensure we have a valid ID
    const postId = id || Math.floor(Math.random() * 1000) + 1;
    
    // Simple hash function for consistent randomization
    const hash = (num: number, salt: number) => {
      let result = num * salt;
      result = ((result << 5) - result + salt) & 0x7fffffff; // Keep positive
      return result / 0x7fffffff; // Normalize to 0-1
    };
    
    return {
      likes: Math.floor(hash(postId, 12345) * 800) + 200, // 200-1000 likes
      comments: Math.floor(hash(postId, 67890) * 45) + 5, // 5-50 comments  
      views: Math.floor(hash(postId, 54321) * 1800) + 200, // 200-2000 views
      readTime: Math.floor(hash(postId, 98765) * 8) + 3 // 3-11 min read
    };
  };

  const stats = generateStats(post?.id);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(stats.likes);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLiked) {
      setIsLiked(false);
      setLikeCount(prev => prev - 1);
    } else {
      setIsLiked(true);
      setLikeCount(prev => prev + 1);
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  const handleComment = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onOpenContact) {
      onOpenContact();
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group bg-secondary-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-secondary-800/50 hover:border-primary-500/30"
    >
      <Link to={`/blog/${post.id}`} className="block">
        <div className="relative h-56 overflow-hidden">
          <motion.img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            whileHover={{ scale: 1.05 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Floating action buttons */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.button
              onClick={handleBookmark}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                isBookmarked 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-black/30 text-white hover:bg-primary-500/80'
              }`}
            >
              <BookmarkPlus size={16} />
            </motion.button>
            
            <motion.button
              onClick={handleShare}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full backdrop-blur-sm bg-black/30 text-white hover:bg-primary-500/80 transition-colors"
            >
              <Share2 size={16} />
            </motion.button>
          </div>

          {/* Read time badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-primary-500/90 backdrop-blur-sm text-white text-xs font-medium rounded-full">
              {stats.readTime} min read
            </span>
          </div>

          {/* Category/Tag */}
          <div className="absolute bottom-4 left-4">
            <span className="px-3 py-1 bg-black/50 backdrop-blur-sm text-cream-100 text-xs font-medium rounded-full border border-white/20">
              Luxury Living
            </span>
          </div>
        </div>
      </Link>
      
      <div className="p-6">
        {/* Meta information */}
        <div className="flex items-center justify-between text-sm text-cream-400 mb-3">
          <div className="flex items-center gap-2">
            <Clock size={14} />
            <time dateTime={post.created_at}>
              {new Date(post.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </time>
          </div>
          
          <div className="flex items-center gap-1">
            <Eye size={14} />
            <span>{stats.views.toLocaleString()}</span>
          </div>
        </div>
        
        {/* Title */}
        <Link to={`/blog/${post.id}`}>
          <h3 className="text-xl font-serif font-bold mb-3 text-cream-100 hover:text-primary-400 transition-colors line-clamp-2 group-hover:text-primary-300">
            {post.title}
          </h3>
        </Link>
        
        {/* Excerpt */}
        <p className="text-cream-300 mb-4 line-clamp-3 leading-relaxed">
          {post.excerpt}
        </p>
        
        {/* Engagement row */}
        <div className="flex items-center justify-between pt-4 border-t border-secondary-800">
          <div className="flex items-center gap-4">
            {/* Like button */}
            <motion.button
              onClick={handleLike}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 text-sm transition-colors ${
                isLiked 
                  ? 'text-red-400' 
                  : 'text-cream-400 hover:text-red-400'
              }`}
            >
              <motion.div
                animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart 
                  size={16} 
                  className={isLiked ? 'fill-current' : ''} 
                />
              </motion.div>
              <span className="font-medium">{likeCount}</span>
            </motion.button>
            
            {/* Comments - clickable to open contact form */}
            <motion.button
              onClick={handleComment}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-sm text-cream-400 hover:text-primary-400 transition-colors"
            >
              <MessageCircle size={16} />
              <span>{stats.comments}</span>
            </motion.button>
          </div>
          
          {/* Read more link */}
          <Link
            to={`/blog/${post.id}`}
            className="group/link inline-flex items-center text-primary-500 hover:text-primary-400 transition-colors text-sm font-medium"
          >
            Read More
            <ArrowRight 
              size={14} 
              className="ml-2 transition-transform group-hover/link:translate-x-1" 
            />
          </Link>
        </div>
      </div>

      {/* Hover overlay effect */}
      <div className="absolute inset-0 bg-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.article>
  );
}