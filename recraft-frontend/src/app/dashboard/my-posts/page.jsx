'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchMyPosts, deletePost } from '@/lib/api'; // Make sure deletePost is imported
import styles from '../dashboardPages.module.css';
import listStyles from '../my-products/myProducts.module.css';

export default function MyPostsPage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const myPosts = await fetchMyPosts();
        setPosts(myPosts);
      } catch (err) { 
        setError('Failed to load your posts.');
        console.error(err); 
      } finally { 
        setIsLoading(false); 
      }
    };
    loadPosts();
  }, []);

  // --- DELETE FUNCTIONALITY ---
  const handleDelete = async (postId) => {
    if (window.confirm("Are you sure you want to permanently delete this post?")) {
      try {
        await deletePost(postId); // Call the API to delete
        // Update the UI by removing the deleted post from the state
        setPosts(currentPosts => currentPosts.filter(p => p._id !== postId));
        alert("Post deleted successfully!");
      } catch (err) { 
        alert(`Failed to delete post: ${err.message}`); 
      }
    }
  };

  if (isLoading) return <p>Loading your posts...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <header className={styles.pageHeader}><h1 className={styles.pageTitle}>My Inspiration Posts</h1><p className={styles.pageSubtitle}>Create, edit, and manage your posts.</p></header>
      <div style={{ marginBottom: '2rem' }}><Link href="/dashboard/my-posts/add" className={styles.button}>+ Create New Post</Link></div>
      <div className={listStyles.productList}>
        {posts.length > 0 ? (
          posts.map(post => (
            <div key={post._id} className={listStyles.productItem}>
              <div className={listStyles.productDetails}><h3 className={listStyles.productName}>{post.title}</h3><span className={`${listStyles.status} ${post.status === 'Published' ? listStyles.statusPublished : listStyles.statusDraft}`}>{post.status}</span></div>
              <div className={listStyles.productActions}>
                <Link href={`/dashboard/my-posts/edit/${post._id}`} className={listStyles.editButton}>Edit</Link>
                <button onClick={() => handleDelete(post._id)} className={listStyles.deleteButton}>Delete</button>
              </div>
            </div>
          ))
        ) : (<p>You haven't created any posts yet.</p>)}
      </div>
    </div>
  );
}