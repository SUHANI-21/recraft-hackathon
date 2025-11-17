'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { fetchPostById } from '@/lib/api';
import styles from './post.module.css';
import PostActions from './PostActions';

export default function InspirationPostPage() {
  const params = useParams();
  const { id } = params;

  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const loadPost = async () => {
      try {
        const fetchedPost = await fetchPostById(id);
        if (!fetchedPost || !fetchedPost.user) {
          throw new Error('Post not found');
        }
        setPost(fetchedPost);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadPost();
  }, [id]);

  if (isLoading) return <p>Loading post...</p>;
  if (error || !post) notFound();
  
  const isArtisan = post.user.userType === 'Artisan';

  return (
    <div className={styles.postContainer}>
      <h1 className={styles.title}>{post.title}</h1>
      
      <div className={styles.meta}>
        {isArtisan && (
          <div className={styles.avatarContainer}>
            <Image src={post.user.profileImage || '/assets/images/default-avatar.png'} alt={post.user.name} fill={true} className={styles.avatarImage} />
          </div>
        )}
        <div className={styles.authorInfo}>
          
          {/* --- THIS IS THE FIX --- */}
          {isArtisan ? (
            // Apply the className DIRECTLY to the Link component
            <Link href={`/artisans/${post.user._id}`} className={styles.userName}>
              by {post.user.name}
            </Link>
          ) : (
            // The non-link version now uses a span as before
            <span className={styles.userName}>by {post.user.name}</span>
          )}

        </div>
      </div>

      {post.photos && post.photos.length > 0 && (
        <div className={styles.mainImageContainer}><Image src={post.photos[0]} alt={post.title} fill={true} className={styles.mainImage} priority /></div>
      )}

      <p className={styles.description}>{post.description}</p>
      
      <h3 className={styles.sectionTitle}>Materials Used</h3>
      <ul className={styles.materialsList}>
        {post.materialsUsed.map((material, index) => (<li key={index} className={styles.materialItem}>{material}</li>))}
      </ul>
      
      <PostActions post={post} />
    </div>
  );
}