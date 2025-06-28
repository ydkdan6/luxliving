import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { BlogPost as BlogPostType, BlogComment } from '../types';
import Layout from '../components/layout/Layout';
import CommentForm from '../components/forms/CommentForm';
import { formatDate } from '../utils/formatters';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (!slug) {
          setError('No blog post slug provided');
          return;
        }
        
        console.log('Fetching post with slug:', slug);
        
        // Fetch the blog post - Use maybeSingle() instead of single()
        const { data: postData, error: postError } = await supabase
          .from('blog_posts')
          .select('*, blog_categories(name)')
          .eq('slug', slug)
          .maybeSingle(); // This will return null if no rows found instead of throwing error

        if (postError) {
          console.error('Supabase error:', postError);
          throw postError;
        }
        
        if (!postData) {
          console.log('Post not found with slug:', slug);
          setError('Blog post not found');
          return;
        }
        
        const post: BlogPostType = {
          ...postData,
          category_name: postData.blog_categories?.name || 'Uncategorized',
        };
        
        setPost(post);
        
        // Fetch comments for this post - FIXED QUERY for auth.users
        const { data: commentsData, error: commentsError } = await supabase
          .from('blog_comments')
          .select('*')
          .eq('post_id', post.id)
          .order('created_at', { ascending: false });

        if (commentsError) {
          console.error('Comments error:', commentsError);
          setComments([]);
        } else if (commentsData && commentsData.length > 0) {
          // Get user IDs and fetch user metadata from auth.users
          const userIds = [...new Set(commentsData.map(comment => comment.user_id).filter(Boolean))];
          
          if (userIds.length > 0) {
            // Try to get user profiles if you have a profiles table
            try {
              const { data: profilesData } = await supabase
                .from('profiles')
                .select('id, name, full_name')
                .in('id', userIds);
              
              // Format comments with user names
              const formattedComments = commentsData.map(comment => {
                const profile = profilesData?.find(p => p.id === comment.user_id);
                return {
                  ...comment,
                  user_name: profile?.name || profile?.full_name || 'Anonymous',
                };
              });
              
              setComments(formattedComments);
            } catch (profileError) {
              console.log('No profiles table found, using fallback');
              // Fallback: use email from auth.users or anonymous
              const formattedComments = commentsData.map(comment => ({
                ...comment,
                user_name: 'Anonymous', // You could also extract from email if available
              }));
              
              setComments(formattedComments);
            }
          } else {
            setComments(commentsData.map(comment => ({
              ...comment,
              user_name: 'Anonymous',
            })));
          }
        } else {
          setComments([]);
        }
        
        // Fetch related posts from the same category
        if (post.category_id) {
          const { data: relatedData, error: relatedError } = await supabase
            .from('blog_posts')
            .select('*, blog_categories(name)')
            .eq('category_id', post.category_id)
            .neq('id', post.id)
            .limit(3);

          if (relatedError) {
            console.error('Related posts error:', relatedError);
            // Don't throw here, just continue without related posts
            setRelatedPosts([]);
          } else {
            // Format related posts data
            const formattedRelated = relatedData?.map(relatedPost => ({
              ...relatedPost,
              category_name: relatedPost.blog_categories?.name || 'Uncategorized',
            })) || [];
            
            setRelatedPosts(formattedRelated);
          }
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
        setError('Failed to load blog post');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const handleCommentAdded = async () => {
    if (!post) return;
    
    // Refresh comments
    try {
      const { data: commentsData, error: commentsError } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('post_id', post.id)
        .order('created_at', { ascending: false });

      if (commentsError) {
        console.error('Error refreshing comments:', commentsError);
        return;
      }
      
      if (commentsData && commentsData.length > 0) {
        // Get user IDs and fetch user metadata
        const userIds = [...new Set(commentsData.map(comment => comment.user_id).filter(Boolean))];
        
        if (userIds.length > 0) {
          try {
            // Try to get user profiles if you have a profiles table
            const { data: profilesData } = await supabase
              .from('profiles')
              .select('id, name, full_name')
              .in('id', userIds);
            
            // Format comments with user names
            const formattedComments = commentsData.map(comment => {
              const profile = profilesData?.find(p => p.id === comment.user_id);
              return {
                ...comment,
                user_name: profile?.name || profile?.full_name || 'Anonymous',
              };
            });
            
            setComments(formattedComments);
          } catch (profileError) {
            console.log('No profiles table found, using fallback');
            // Fallback: use anonymous names
            const formattedComments = commentsData.map(comment => ({
              ...comment,
              user_name: 'Anonymous',
            }));
            
            setComments(formattedComments);
          }
        } else {
          setComments(commentsData.map(comment => ({
            ...comment,
            user_name: 'Anonymous',
          })));
        }
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error('Error refreshing comments:', error);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream-50 to-secondary-50">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-6"></div>
              <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-primary-400 mx-auto animate-ping"></div>
            </div>
            <h2 className="text-xl font-semibold text-secondary-800 mb-2">Loading Article</h2>
            <p className="text-secondary-600">Please wait while we fetch the content...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream-50 to-secondary-50">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="w-24 h-24 mx-auto mb-6 bg-secondary-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              {error || 'Article Not Found'}
            </h2>
            <p className="text-secondary-600 mb-8 leading-relaxed">
              The article you're looking for doesn't exist or has been removed. It might have been moved or deleted.
            </p>
            <Link 
              to="/blog" 
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Blog
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section with Enhanced Typography */}
      <section className="relative bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={post.image_url}
            alt={post.title}
            className="object-cover w-full h-full opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/80 via-secondary-900/40 to-transparent"></div>
        </div>
        
        <div className="relative container py-16 md:py-24 lg:py-32">
          <div className="max-w-4xl">
            {/* Enhanced Navigation */}
            <nav className="mb-8">
              <Link 
                to="/blog" 
                className="inline-flex items-center text-cream-200 hover:text-white transition-all duration-200 group"
              >
                <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Blog
              </Link>
            </nav>
            
            {/* Enhanced Category Badge */}
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full bg-primary-500/20 text-primary-200 border border-primary-400/30 backdrop-blur-sm">
                <span className="w-2 h-2 bg-primary-400 rounded-full mr-2"></span>
                {post.category_name}
              </span>
            </div>
            
            {/* Enhanced Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white drop-shadow-lg">
              {post.title}
            </h1>
            
            {/* Enhanced Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-cream-100">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-semibold text-sm">
                    {post.author_name?.charAt(0) || 'A'}
                  </span>
                </div>
                <span className="font-medium">{post.author_name}</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-cream-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <time className="text-cream-200">{formatDate(post.created_at)}</time>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-white to-cream-50">
        <div className="container">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
            {/* Main Article Content */}
            <div className="lg:col-span-3">
              {/* Enhanced Article Excerpt */}
              {post.excerpt && (
                <div className="mb-12 p-8 bg-gradient-to-r from-primary-50 to-cream-50 rounded-2xl border border-primary-100 shadow-sm">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-1 h-16 bg-primary-500 rounded-full mr-6"></div>
                    <div>
                      <h3 className="text-lg font-semibold text-black mb-3">Article Summary</h3>
                      <p className="text-xl leading-relaxed text-black font-light italic">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Article Content */}
              <article className=" text-black text-justify prose prose-xl max-w-none prose-headings:font-bold prose-headings:text-black prose-h1:text-4xl prose-h1:leading-tight prose-h1:mb-8 prose-h2:text-3xl prose-h2:leading-tight prose-h2:mb-6 prose-h2:mt-12 prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8 prose-h4:text-xl prose-h4:mb-3 prose-h4:mt-6 prose-p:text-black prose-p:leading-relaxed prose-p:mb-6 prose-a:text-primary-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-strong:text-black prose-strong:font-semibold prose-em:text-black prose-blockquote:border-primary-500 prose-blockquote:bg-primary-50 prose-blockquote:rounded-lg prose-blockquote:p-6 prose-blockquote:not-italic prose-blockquote:text-black prose-ul:mb-6 prose-ol:mb-6 prose-li:mb-2 prose-li:text-black prose-code:bg-black prose-code:text-black prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-black prose-pre:rounded-lg prose-pre:p-6 prose-img:rounded-xl prose-img:shadow-lg prose-hr:border-cream-200 prose-hr:my-12">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </article>

              {/* Enhanced Tags Section */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-16 pt-8 border-t border-cream-200">
                  <h4 className="text-lg font-semibold text-black mb-6 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Article Tags
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium bg-secondary-100 text-secondary-700 rounded-full hover:bg-secondary-200 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                      >
                        <span className="w-2 h-2 bg-secondary-400 rounded-full mr-2"></span>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Enhanced Comments Section */}
              <div className="mt-20 pt-12 border-t-2 border-cream-200">
                <div className="flex items-center mb-10">
                  <svg className="w-8 h-8 mr-3 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <h3 className="text-3xl font-bold text-secondary-900">
                    Discussion ({comments.length})
                  </h3>
                </div>
                
                <div className="mb-12 p-8 bg-white rounded-2xl shadow-lg border border-cream-200">
                  <h4 className="text-xl font-semibold text-secondary-700 mb-6">Join the Conversation</h4>
                  <CommentForm postId={post.id} onCommentAdded={handleCommentAdded} />
                </div>
                
                {comments.length > 0 ? (
                  <div className="space-y-8">
                    {comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="p-8 bg-white rounded-2xl shadow-md border border-cream-200 hover:shadow-lg transition-shadow duration-300"
                      >
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mr-4 shadow-md">
                              <span className="text-white font-semibold text-lg">
                                {comment.user_name?.charAt(0) || 'A'}
                              </span>
                            </div>
                            <div>
                              <h5 className="font-semibold text-secondary-900 text-lg">{comment.user_name}</h5>
                              <time className="text-sm text-secondary-700 font-medium">
                                {formatDate(comment.created_at)}
                              </time>
                            </div>
                          </div>
                        </div>
                        <p className="text-secondary-700 leading-relaxed text-lg">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-cream-200">
                    <div className="w-16 h-16 mx-auto mb-6 bg-cream-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-cream-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold text-secondary-800 mb-2">No comments yet</h4>
                    <p className="text-secondary-500 text-lg">
                      Be the first to share your thoughts on this article!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-8">
                {/* Enhanced Related Articles */}
                {relatedPosts.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg border border-cream-200 overflow-hidden">
                    <div className="p-6 bg-gradient-to-r from-primary-500 to-primary-600">
                      <h3 className="text-xl font-bold text-white flex items-center">
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Related Articles
                      </h3>
                    </div>
                    <div className="p-6 space-y-6">
                      {relatedPosts.map((relatedPost) => (
                        <div key={relatedPost.id} className="group">
                          <Link
                            to={`/blog/${relatedPost.slug}`}
                            className="block hover:bg-cream-50 p-4 rounded-xl transition-all duration-200 -m-4"
                          >
                            <div className="flex space-x-4">
                              <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden shadow-md">
                                <img
                                  src={relatedPost.image_url}
                                  alt={relatedPost.title}
                                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2 leading-snug">
                                  {relatedPost.title}
                                </h4>
                                <p className="text-sm text-secondary-500 font-medium">
                                  {formatDate(relatedPost.created_at)}
                                </p>
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Enhanced Categories */}
                <div className="bg-white rounded-2xl shadow-lg border border-cream-200 overflow-hidden">
                  <div className="p-6 bg-gradient-to-r from-secondary-600 to-secondary-700">
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      Categories
                    </h3>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-3">
                      <li>
                        <Link
                          to="/blog"
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-cream-50 transition-all duration-200 group"
                        >
                          <span className="font-medium text-secondary-700 group-hover:text-secondary-900">All Categories</span>
                          <svg className="w-4 h-4 text-secondary-400 group-hover:text-secondary-600 transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={`/blog?category=${post.category_id}`}
                          className="flex items-center justify-between p-3 rounded-lg bg-primary-50 border border-primary-200"
                        >
                          <span className="font-semibold text-secondary-700">{post.category_name}</span>
                          <span className="text-xs bg-primary-500 text-white px-2 py-1 rounded-full">Current</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}