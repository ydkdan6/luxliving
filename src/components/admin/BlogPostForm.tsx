import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';
import { BlogPost, BlogCategory } from '../../types';

type FormData = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  category_id: string;
  tags: string;
};

interface BlogPostFormProps {
  post?: BlogPost;
  categories: BlogCategory[];
  onSuccess: () => void;
}

export default function BlogPostForm({ post, categories, onSuccess }: BlogPostFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userID, setUserID] = useState<string | null>(null);

  // ✅ Fetch current logged-in user's ID
  useEffect(() => {
    async function fetchCurrentUser() {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user?.id) {
        console.error('Error fetching logged-in user:', error);
        setErrorMessage('You must be logged in to create a blog post.');
        return;
      }

      setUserID(data.user.id);
    }

    fetchCurrentUser();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: post ? {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      image_url: post.image_url,
      category_id: post.category_id,
      tags: post.tags.join(', '),
    } : undefined,
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const tagsArray = data.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');

      if (post) {
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update({
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt,
            content: data.content,
            image_url: data.image_url,
            category_id: data.category_id,
            tags: tagsArray,
            updated_at: new Date().toISOString(),
          })
          .match({ id: post.id });

        if (error) throw error;
      } else {
        // Create new post
        if (!userID) {
          throw new Error("No valid user ID available. Cannot create post without a valid author.");
        }

        const { error } = await supabase
          .from('blog_posts')
          .insert([{
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt,
            content: data.content,
            image_url: data.image_url,
            category_id: data.category_id,
            tags: tagsArray,
            author_id: userID,
          }]);

        if (error) throw error;
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error saving blog post:', error);
      setErrorMessage(`There was an error saving the blog post: ${error.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateSlug = (e: React.MouseEvent) => {
    e.preventDefault();
    const titleField = document.getElementById('title') as HTMLInputElement;
    if (titleField?.value) {
      const slugField = document.getElementById('slug') as HTMLInputElement;
      const generatedSlug = titleField.value
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      slugField.value = generatedSlug;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="label text-black">Title:</label>
        <input
          id="title"
          type="text"
          className={`input text-black mx-3 px-2 h-8 w-[260px] border-primary-500 ${errors.title ? 'border-red-500' : ''}`}
          {...register('title', { required: 'Title is required' })}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="flex items-end space-x-4">
        <div className="flex-grow">
          <label htmlFor="slug" className="label text-black">Slug:</label>
          <input
            id="slug"
            type="text"
            className={`input text-black mx-3 px-2 h-8 w-[260px] border-primary-500 ${errors.slug ? 'border-red-500' : ''}`}
            {...register('slug', { required: 'Slug is required' })}
          />
          {errors.slug && (
            <p className="mt-1 text-sm text-red-500">{errors.slug.message}</p>
          )}
        </div>
        <button
          onClick={generateSlug}
          className="btn btn-outline py-2 px-3 h-[46px] text-black"
        >
          Generate from Title
        </button>
      </div>

      <div>
        <label htmlFor="category_id" className="label text-black">Category:</label>
        <select
          id="category_id"
          className={`input text-black mx-3 px-2 h-8 w-[260px] border-primary-500 ${errors.category_id ? 'border-red-500' : ''}`}
          {...register('category_id', { required: 'Category is required' })}
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.category_id && (
          <p className="mt-1 text-sm text-red-500">{errors.category_id.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="image_url" className="label text-black">Feature Image URL:</label>
        <input
          id="image_url"
          type="text"
          className={`input text-black mx-3 px-2 h-8 w-[260px] border-primary-500 ${errors.image_url ? 'border-red-500' : ''}`}
          {...register('image_url', { required: 'Image URL is required' })}
        />
        {errors.image_url && (
          <p className="mt-1 text-sm text-red-500">{errors.image_url.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="excerpt" className="label text-black">Excerpt:</label>
        <textarea
          id="excerpt"
          rows={3}
          className={`input text-black mx-3 px-2 w-[260px] border-primary-500 ${errors.excerpt ? 'border-red-500' : ''}`}
          {...register('excerpt', { required: 'Excerpt is required' })}
        ></textarea>
        {errors.excerpt && (
          <p className="mt-1 text-sm text-red-500">{errors.excerpt.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="content" className="label text-black">Content:</label>
        <textarea
          id="content"
          rows={10}
          className={`input text-black mx-3 px-2 w-[260px] border-primary-500 ${errors.content ? 'border-red-500' : ''}`}
          {...register('content', { required: 'Content is required' })}
        ></textarea>
        {errors.content && (
          <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="tags" className="label text-black">Tags (comma-separated):</label>
        <input
          id="tags"
          type="text"
          className={`input text-black mx-3 px-2 h-8 w-[260px] border-primary-500 ${errors.tags ? 'border-red-500' : ''}`}
          placeholder="luxury, real estate, lifestyle"
          {...register('tags')}
        />
        {errors.tags && (
          <p className="mt-1 text-sm text-red-500">{errors.tags.message}</p>
        )}
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-100 text-red-700 rounded-sm">
          {errorMessage}
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onSuccess}
          className="btn btn-outline text-red-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
        </button>
      </div>
    </form>
  );
}
