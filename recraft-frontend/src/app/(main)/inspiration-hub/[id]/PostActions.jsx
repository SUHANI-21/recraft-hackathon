'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { likePost, unlikePost } from '@/lib/api';
import styles from './post.module.css';

const HeartIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

export default function PostActions({ post }) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [isLoading, setIsLoading] = useState(false);

  // Check if current user has liked the post
  useEffect(() => {
    if (user && post.likes) {
      setIsLiked(post.likes.includes(user._id));
    }
    setLikeCount(post.likes?.length || 0);
  }, [post, user]);

  const handleLikeClick = async () => {
    if (!user) {
      alert('Please log in to like posts');
      return;
    }

    setIsLoading(true);
    try {
      if (isLiked) {
        await unlikePost(post._id);
        setIsLiked(false);
        setLikeCount(likeCount - 1);
      } else {
        await likePost(post._id);
        setIsLiked(true);
        setLikeCount(likeCount + 1);
      }
    } catch (err) {
      console.error('Error liking post:', err);
      alert('Failed to like post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.actions}>
      <button 
        onClick={handleLikeClick} 
        className={`${styles.likeButton} ${isLiked ? styles.liked : ''}`}
        disabled={isLoading}
      >
        <HeartIcon 
          className={styles.heartIcon} 
          style={{ fill: isLiked ? 'currentColor' : 'none' }} 
        />
        {likeCount}
      </button>

      {post.linkedProductId && (
        <Link href={`/products/${post.linkedProductId}`} className={styles.buyButton}>
          Buy This Item
        </Link>
      )}
    </div>
  );
}