'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './post.module.css';

const HeartIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

export default function PostActions({ post }) {
  // --- THIS IS THE FIX ---
  // A simple, consistent way to generate a "random" starting number of likes
  // that will be the same every time you load the page for this specific post.
  const getInitialLikes = (postId) => {
    // Use characters from the post ID to create a number
    if (!postId) return 0;
    return (postId.charCodeAt(postId.length - 1) + postId.charCodeAt(postId.length - 2)) % 100;
  };

  const [isLiked, setIsLiked] = useState(false);
  // Initialize the like count with our stable, non-random function
  const [likeCount, setLikeCount] = useState(getInitialLikes(post._id));

  // When the component first loads, set the initial like count.
  // This prevents it from being recalculated on every re-render.
  useEffect(() => {
    setLikeCount(getInitialLikes(post._id));
  }, [post._id]); // Only run this when the post ID changes

  const handleLikeClick = () => {
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    setIsLiked(!isLiked);
  };

  return (
    <div className={styles.actions}>
      <button 
        onClick={handleLikeClick} 
        className={`${styles.likeButton} ${isLiked ? styles.liked : ''}`}
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