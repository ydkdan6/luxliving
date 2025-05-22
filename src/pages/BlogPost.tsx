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

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      
      try {
        if (!slug) return;
        
        // Fetch the blog post
        const { data: postData, error: postError } = await supabase
          .from('blog_posts')
          .select('*, blog_categories(name)')
          .eq('slug', slug)
          .single();

        if (postError) throw postError;
        
        if (!postData) {
          console.error('Post not found');
          return;
        }
        
        const post: BlogPostType = {
          ...postData,
          category_name: postData.blog_categories?.name || 'Uncategorized',
        };
        
        setPost(post);
        
        // Fetch comments for this post
        const { data: commentsData, error: commentsError } = await supabase
          .from('blog_comments')
          .select('*, users(name)')
          .eq('post_id', post.id)
          .order('created_at', { ascending: false });

        if (commentsError) throw commentsError;
        
        // Format comments data
        const formattedComments = commentsData?.map(comment => ({
          ...comment,
          user_name: comment.users?.name || 'Anonymous',
        })) || [];
        
        setComments(formattedComments);
        
        // Fetch related posts from the same category
        const { data: relatedData, error: relatedError } = await supabase
          .from('blog_posts')
          .select('*, blog_categories(name)')
          .eq('category_id', post.category_id)
          .neq('id', post.id)
          .limit(3);

        if (relatedError) throw relatedError;
        
        // Format related posts data
        const formattedRelated = relatedData?.map(relatedPost => ({
          ...relatedPost,
          category_name: relatedPost.blog_categories?.name || 'Uncategorized',
        })) || [];
        
        setRelatedPosts(formattedRelated);
      } catch (error) {
        console.error('Error fetching blog post:', error);
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
        .select('*, users(name)')
        .eq('post_id', post.id)
        .order('created_at', { ascending: false });

      if (commentsError) throw commentsError;
      
      // Format comments data
      const formattedComments = commentsData?.map(comment => ({
        ...comment,
        user_name: comment.users?.name || 'Anonymous',
      })) || [];
      
      setComments(formattedComments);
    } catch (error) {
      console.error('Error refreshing comments:', error);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-20">
          <div className="text-center">Loading article...</div>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="container py-20">
          <div className="text-center">
            <h2 className="mb-4">Article Not Found</h2>
            <p className="mb-6 text-secondary-600">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/blog" className="btn btn-primary">
              Back to Blog
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Article Header */}
      <section className="relative bg-secondary-900 text-white">
        <div className="absolute inset-0">
          <img
            src={post.image_url}
            alt={post.title}
            className="object-cover w-full h-full opacity-40"
          />
        </div>
        <div className="relative container py-20 md:py-32">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-medium rounded-sm text-primary-900 bg-primary-200">
              {post.category_name}
            </span>
            <h1 className="mb-6">{post.title}</h1>
            <div className="flex items-center text-cream-100">
              <span>{post.author_name}</span>
              <span className="mx-2">•</span>
              <time>{formatDate(post.created_at)}</time>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 md:py-20">
        <div className="container">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <article className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </article>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t border-cream-200">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm bg-secondary-900 text-secondary-700 rounded-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments Section */}
              <div className="mt-12 pt-12 border-t border-cream-200">
                <h3 className="mb-6 text-2xl font-medium">
                  Comments ({comments.length})
                </h3>
                
                <div className="mb-8">
                  <CommentForm postId={post.id} onCommentAdded={handleCommentAdded} />
                </div>
                
                {comments.length > 0 ? (
                  <div className="space-y-6">
                    {comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="p-6 bg-cream-50 rounded-sm"
                      >
                        <div className="flex justify-between mb-4">
                          <div className="font-medium">{comment.user_name}</div>
                          <time className="text-sm text-secondary-500">
                            {formatDate(comment.created_at)}
                          </time>
                        </div>
                        <p className="text-secondary-700">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-secondary-500">
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Related Articles */}
              {relatedPosts.length > 0 && (
                <div className="p-6 bg-cream-50 rounded-sm">
                  <h3 className="mb-6 text-xl font-medium">Related Articles</h3>
                  <div className="space-y-6">
                    {relatedPosts.map((relatedPost) => (
                      <div key={relatedPost.id} className="flex space-x-4">
                        <Link
                          to={`/blog/${relatedPost.slug}`}
                          className="flex-shrink-0 w-20 h-20"
                        >
                          <img
                            src={relatedPost.image_url}
                            alt={relatedPost.title}
                            className="object-cover w-full h-full rounded-sm"
                          />
                        </Link>
                        <div>
                          <Link
                            to={`/blog/${relatedPost.slug}`}
                            className="font-medium hover:text-primary-600"
                          >
                            {relatedPost.title}
                          </Link>
                          <p className="mt-1 text-sm text-secondary-500">
                            {formatDate(relatedPost.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              <div className="mt-8 p-6 bg-secondary-950 rounded-sm">
                <h3 className="mb-6 text-xl font-medium">Categories</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/blog"
                      className="flex items-center justify-between hover:text-primary-600"
                    >
                      <span>All Categories</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/blog?category=${post.category_id}`}
                      className="flex items-center justify-between text-primary-600"
                    >
                      <span>{post.category_name}</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}