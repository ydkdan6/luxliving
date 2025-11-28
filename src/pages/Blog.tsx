import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { BlogPost, BlogCategory } from "../types";
import Layout from "../components/layout/Layout";
import BlogCard from "../components/ui/BlogCard";
import { BookOpen, Filter, Mail, ArrowRight, Sparkles } from "lucide-react";

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("blog_categories")
          .select("*");

        if (categoriesError) throw categoriesError;
        setCategories(categoriesData || []);

        let query = supabase
          .from("blog_posts")
          .select("*, blog_categories(name)");

        if (selectedCategory) {
          query = query.eq("category_id", selectedCategory);
        }

        const { data: postsData, error: postsError } = await query.order(
          "created_at",
          { ascending: false }
        );

        if (postsError) throw postsError;

        const formattedPosts =
          postsData?.map((post) => ({
            ...post,
            category_name: post.blog_categories?.name || "Uncategorized",
          })) || [];

        if (formattedPosts.length > 0) {
          setFeaturedPost(formattedPosts[0]);
          setPosts(formattedPosts.slice(1));
        } else {
          setFeaturedPost(null);
          setPosts([]);
        }
      } catch (error) {
        console.error("Error fetching blog data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? "" : categoryId);
  };

  return (
    <Layout>
      {/* Hero Header */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg"
            alt="Luxury Lifestyle"
            className="object-cover w-full h-full opacity-20"
            loading="lazy"
            fetchpriority="high"
          />
          <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>
        <div className="relative container py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-full mb-6">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-medium">Insights & Inspiration</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Luxury Living Stories
            </h1>
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
              Discover expert insights on luxury real estate, sophisticated interior design, and the art of refined living.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="container py-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex items-center gap-2 text-gray-700 font-medium whitespace-nowrap">
              <Filter className="w-4 h-4" />
              <span className="text-sm">Categories:</span>
            </div>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                !selectedCategory
                  ? "bg-primary-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setSelectedCategory("")}
            >
              All Articles
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === category.id
                    ? "bg-primary-500 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 font-medium">Loading articles...</p>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {featuredPost && (
                <div className="mb-16">
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-5 h-5 text-primary-500" />
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                      Featured Article
                    </h2>
                  </div>
                  <BlogCard post={featuredPost} featured />
                </div>
              )}

              {/* Latest Articles Header */}
              {posts.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                    Latest Articles
                  </h3>
                  <div className="h-1 w-20 bg-primary-500 rounded-full mt-3"></div>
                </div>
              )}

              {/* Post Grid */}
              {posts.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              ) : !featuredPost ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    No Articles Found
                  </h3>
                  <p className="text-gray-600 mb-6 text-center max-w-md">
                    There are no articles available for this category at the moment.
                  </p>
                  <button
                    onClick={() => setSelectedCategory("")}
                    className="px-6 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-500 transition-colors"
                  >
                    View All Articles
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container">
          <div className="bg-gray-900 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="p-8 md:p-12 lg:p-16">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-full mb-6">
                  <Mail className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">Newsletter</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Stay in the Loop
                </h2>
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  Get the latest luxury real estate insights, market trends, and exclusive content delivered straight to your inbox.
                </p>
                <form className="space-y-4">
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      className="w-full px-5 py-4 rounded-lg bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-500 transition-colors group"
                  >
                    Subscribe Now
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
                <p className="text-gray-400 text-sm mt-4">
                  No spam, unsubscribe anytime. We respect your privacy.
                </p>
              </div>
              <div className="h-64 lg:h-full min-h-[400px]">
                <img
                  src="https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg"
                  alt="Newsletter"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}