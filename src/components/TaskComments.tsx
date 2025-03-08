'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTaskComments, useAddComment } from '@/lib/hooks/useTasks';
import RichTextEditor from './RichTextEditor';

export default function TaskComments({ taskId }: { taskId: number }) {
  const { data: session } = useSession();
  const { data: comments, isLoading, error } = useTaskComments(taskId);
  const addCommentMutation = useAddComment(taskId);
  
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;
    
    setIsSubmitting(true);
    try {
      await addCommentMutation.mutateAsync({
        text: commentText,
        userId: session?.user?.id || '1',
        userName: session?.user?.name || 'Anonymous',
      });
      setCommentText('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mt-4 space-y-4">
        <h3 className="text-lg font-semibold">Comments</h3>
        <div className="animate-pulse space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-[#111827] p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-700 rounded w-full"></div>
                <div className="h-3 bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Comments</h3>
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mt-2">
          Error loading comments. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      <h3 className="text-lg font-semibold">Comments ({comments?.length || 0})</h3>
      
      {/* Add new comment */}
      <div className="bg-[#111827] p-4 rounded-lg">
        <h4 className="font-medium mb-3">Add a Comment</h4>
        <RichTextEditor 
          value={commentText} 
          onChange={setCommentText} 
          placeholder="Write your comment here..."
          height="150px"
        />
        <div className="mt-3 flex justify-end">
          <button
            onClick={handleSubmitComment}
            disabled={isSubmitting || !commentText.trim()}
            className="bg-[#8B5CF6] hover:bg-opacity-90 transition px-4 py-2 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </div>
      
      {/* Comments list */}
      {comments && comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-[#111827] p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-[#8B5CF6] rounded-full flex items-center justify-center text-white font-medium">
                  {comment.userName.charAt(0)}
                </div>
                <div>
                  <div className="font-medium">{comment.userName}</div>
                  <div className="text-xs text-gray-400">
                    {new Date(comment.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
              <div 
                className="prose prose-sm max-w-none prose-invert"
                dangerouslySetInnerHTML={{ __html: comment.text }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#111827] p-4 rounded-lg text-center text-gray-400">
          No comments yet. Be the first to comment.
        </div>
      )}
    </div>
  );
} 