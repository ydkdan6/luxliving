import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { BlogPost, BlogCategory } from '../types';
import Layout from '../components/layout/Layout';
import BlogCard from '../components/ui/BlogCard';

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('blog_categories')
          .select('*');

        if (categoriesError) throw categoriesError;
        setCategories(categoriesData || []);

        // Fetch blog posts
        let query = supabase
          .from('blog_posts')
          .select('*, blog_categories(name)');
        
        if (selectedCategory) {
          query = query.eq('category_id', selectedCategory);
        }
        
        const { data: postsData, error: postsError } = await query
          .order('created_at', { ascending: false });

        if (postsError) throw postsError;
        
        // Format the posts data
        const formattedPosts = postsData?.map(post => ({
          ...post,
          category_name: post.blog_categories?.name || 'Uncategorized',
        })) || [];
        
        // Set the featured post to the first post
        if (formattedPosts.length > 0) {
          setFeaturedPost(formattedPosts[0]);
          setPosts(formattedPosts.slice(1));
        } else {
          setFeaturedPost(null);
          setPosts([]);
        }
      } catch (error) {
        console.error('Error fetching blog data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? '' : categoryId);
  };

  return (
    <Layout>
      {/* Header */}
      <section className="relative bg-secondary-900 text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg"
            alt="Luxury Lifestyle"
            className="object-cover w-full h-full opacity-30"
          />
        </div>
        <div className="relative container py-20 md:py-32">
          <div className="max-w-2xl">
            <h1 className="mb-4">Luxury Living Insights</h1>
            <p className="text-xl text-cream-100">
              Explore our collection of articles on luxury real estate, interior design, 
              and sophisticated living.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 bg-cream-100 border-b border-cream-200">
        <div className="container">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-secondary-700 font-medium">Filter by:</span>
            <button
              className={`px-4 py-2 rounded-sm transition-colors ${
                !selectedCategory
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-secondary-700 hover:bg-cream-200'
              }`}
              onClick={() => setSelectedCategory('')}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-sm transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-secondary-700 hover:bg-cream-200'
                }`}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-12 md:py-20">
        <div className="container">
          {isLoading ? (
            <div className="text-center py-12">Loading articles...</div>
          ) : (
            <>
              {/* Featured Post */}
              {featuredPost && (
                <div className="mb-16">
                  <h2 className="mb-8 text-center">Featured Article</h2>
                  <BlogCard post={featuredPost} featured />
                </div>
              )}

              {/* Post Grid */}
              {posts.length > 0 ? (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-secondary-600">
                    No articles found for this category.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-secondary-900 text-white">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="mb-4 text-white">Stay Updated</h2>
            <p className="mb-8 text-cream-100">
              Subscribe to our newsletter for the latest luxury real estate insights and exclusive offers.
            </p>
            <form className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-sm bg-secondary-800 border border-secondary-700 text-white placeholder-secondary-400 focus:ring-1 focus:ring-primary-400 focus:border-primary-400"
              />
              <button type="submit" className="btn btn-primary">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}