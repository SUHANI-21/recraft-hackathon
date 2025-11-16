'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPost } from '@/lib/api';
import styles from '../../my-products/add/addProduct.module.css';

export default function AddInspirationPostPage() {
  const router = useRouter();
  const [postData, setPostData] = useState({ title: '', description: '', materialsUsed: '', photos: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(''); // State to hold the error message

  const handleChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(''); // Clear previous errors

    try {
      const dataToSend = {
        title: postData.title,
        description: postData.description,
        photos: [postData.photos], // Send as an array
        materialsUsed: postData.materialsUsed.split(',').map(m => m.trim())
      };
      
      await createPost(dataToSend);
      
      alert("Your post has been created as a draft!");
      router.push('/dashboard/my-posts');

    } catch (err) {
      // --- THIS IS THE IMPORTANT CHANGE ---
      // We now set the specific error message from the backend to our state
      console.error("Error from API:", err); // Log the full error for debugging
      setError(err.message); // Set the user-friendly message to display
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <header className={styles.formHeader}>
        <h1 className={styles.formTitle}>Create a New Inspiration Post</h1>
        <p className={styles.formSubtitle}>Share your project with the community.</p>
      </header>
      
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>Post Title</label>
          <input type="text" id="title" name="title" value={postData.title} onChange={handleChange} className={styles.input} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="photos" className={styles.label}>Image URL</label>
          <input type="text" id="photos" name="photos" value={postData.photos} onChange={handleChange} className={styles.input} placeholder="https://i.imgur.com/your-image.jpg" required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>Description</label>
          <textarea id="description" name="description" value={postData.description} onChange={handleChange} className={styles.textarea} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="materialsUsed" className={styles.label}>Materials Used</label>
          <input type="text" id="materialsUsed" name="materialsUsed" value={postData.materialsUsed} onChange={handleChange} className={styles.input} />
          <p className={styles.helperText}>Separate with commas.</p>
        </div>

        {/* --- NEW: Display the specific error message on the page --- */}
        {error && (
          <p style={{ color: '#c62828', textAlign: 'center', margin: '1rem 0', fontWeight: '500' }}>
            Error: {error}
          </p>
        )}

        <div className={styles.formActions}>
          <button type="submit" className={`${styles.button} ${styles.publishButton}`} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save as Draft'}
          </button>
        </div>
      </form>
    </div>
  );
}