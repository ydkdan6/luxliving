import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

type FormData = {
  content: string;
};

interface CommentFormProps {
  postId: string;
  onCommentAdded: () => void;
}

export default function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { user } = useAuth();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  if (!user) {
    return (
      <div className="p-4 bg-secondary-900 rounded-sm">
        <p className="text-secondary-700">
          Please <a href="/login" className="text-primary-500 hover:text-primary-700">sign in</a> to leave a comment.
        </p>
      </div>
    );
  }

  const onSubmit = async (data: FormData) => {
    if (!user) return;
    
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const { error } = await supabase.from('blog_comments').insert([
        {
          post_id: postId,
          user_id: user.id,
          content: data.content,
        },
      ]);
      
      if (error) throw error;
      
      reset();
      onCommentAdded();
    } catch (error) {
      console.error('Error submitting comment:', error);
      setErrorMessage('There was an error posting your comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-secondary-900 rounded-sm shadow-md p-6">
      <h3 className="text-xl font-medium mb-4">Leave a Comment</h3>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="content" className="label mr-4">Your Comment:</label>
          <textarea
            id="content"
            cols={90}
            rows={10}
            className={`input rounded-sm ${errors.content ? 'border-red-500' : ''}`}
            {...register('content', { 
              required: 'Comment content is required',
              minLength: {
                value: 3,
                message: 'Comment must be at least 3 characters'
              } 
            })}
          ></textarea>
          {errors.content && (
            <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
          )}
        </div>
        
        {errorMessage && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-sm">
            {errorMessage}
          </div>
        )}
        
        <button
          type="submit"
          className="mt-4 btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
    </div>
  );
}