import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { BlogPost, BlogCategory } from '../../types';
import AdminLayout from './AdminLayout';
import BlogPostForm from '../../components/admin/BlogPostForm';
import { formatDate } from '../../utils/formatters';

export default function BlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    
    try {
      // Fetch blog posts
      const { data: postsData, error: postsError } = await supabase
        .from('blog_posts')
        .select('*, blog_categories(name)')
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;
      
      // Format the posts data
      const formattedPosts = postsData?.map(post => ({
        ...post,
        category_name: post.blog_categories?.name || 'Uncategorized',
      })) || [];
      
      setPosts(formattedPosts);
      
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('blog_categories')
        .select('*');

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error fetching blog data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    setSelectedPost(null);
    setIsEditing(true);
  };

  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setIsEditing(true);
  };

  const handleDeleteClick = (postId: string) => {
    setPostToDelete(postId);
    setShowConfirmDelete(true);
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .match({ id: postToDelete });
      
      if (error) throw error;
      
      // Refresh data
      fetchData();
    } catch (error) {
      console.error('Error deleting blog post:', error);
    } finally {
      setShowConfirmDelete(false);
      setPostToDelete(null);
    }
  };

  const handleFormSuccess = () => {
    setIsEditing(false);
    fetchData();
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-medium text-secondary-900">Blog Posts</h1>
          <p className="mt-1 text-secondary-600">Manage your blog content</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="mt-4 sm:mt-0 btn btn-primary flex items-center"
        >
          <Plus size={18} className="mr-2 text-black" />
          Create New Post
        </button>
      </div>

      {isEditing ? (
        <div className="bg-white p-6 rounded-sm shadow-sm">
          <h2 className="text-2xl font-medium mb-6 text-black">
            {selectedPost ? 'Edit Post' : 'Create New Post'}
          </h2>
          <BlogPostForm
            post={selectedPost || undefined}
            categories={categories}
            onSuccess={handleFormSuccess}
          />
        </div>
      ) : isLoading ? (
        <div className="text-center py-12">Loading blog posts...</div>
      ) : (
        <div className="bg-white rounded-sm shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-cream-200">
              <thead className="bg-cream-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
                  >
                    Published
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
                  >
                    Author
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-cream-200">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <tr key={post.id} className="hover:bg-cream-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-secondary-900">
                          {post.title}
                        </div>
                        <div className="text-sm text-secondary-500">
                          {post.slug}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                          {post.category_name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                        {formatDate(post.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                        {post.author_name || 'Admin'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <a
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-secondary-600 hover:text-secondary-900"
                          >
                            <Eye size={18} />
                          </a>
                          <button
                            onClick={() => handleEdit(post)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(post.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-secondary-500">
                      No blog posts found. Create your first post!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-sm shadow-lg max-w-md w-full">
            <h3 className="text-xl font-medium mb-4">Confirm Delete</h3>
            <p className="text-secondary-600 mb-6">
              Are you sure you want to delete this blog post? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="btn bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}