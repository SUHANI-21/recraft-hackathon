
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchPostById, updatePost } from '@/lib/api'; // Use the public fetchPostById
import styles from '../../../my-products/add/addProduct.module.css';

export default function EditInspirationPostPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [postData, setPostData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const loadPostForEdit = async () => {
      try {
        const post = await fetchPostById(id);
        setPostData({
          ...post,
          materialsUsed: post.materialsUsed.join(', '),
          photos: post.photos[0] || '',
        });
      } catch (err) {
        setError('Failed to load post data.');
      }
    };
    loadPostForEdit();
  }, [id]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!postData) return <p>Loading post data...</p>;
  
  const handleChange = (e) => { setPostData({ ...postData, [e.target.name]: e.target.value }); };

  // --- UPDATE (SAVE CHANGES) FUNCTIONALITY ---
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const dataToSend = { 
        ...postData, 
        photos: [postData.photos],
        materialsUsed: postData.materialsUsed.split(',').map(m => m.trim()) 
      };
      await updatePost(id, dataToSend);
      alert("Changes saved successfully!");
      router.push('/dashboard/my-posts');
    } catch (err) {
      setError(`Failed to save changes: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // --- PUBLISH FUNCTIONALITY ---
  const handlePublish = async (e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to publish this post? It will become visible to everyone.")) return;
    
    setIsLoading(true);
    setError('');
    try {
      const dataToSend = { ...postData, status: 'Published', photos: [postData.photos], materialsUsed: postData.materialsUsed.split(',').map(m => m.trim()) };
      await updatePost(id, dataToSend); // We use the same 'update' endpoint
      alert("Post published successfully!");
      router.push('/dashboard/my-posts');
    } catch (err) {
      setError(`Failed to publish post: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <header className={styles.formHeader}><h1 className={styles.formTitle}>Edit Inspiration Post</h1><p className={styles.formSubtitle}>Make changes to your post and publish when ready.</p></header>
      <form>
        <div className={styles.formGroup}><label htmlFor="title" className={styles.label}>Post Title</label><input type="text" id="title" name="title" value={postData.title} onChange={handleChange} className={styles.input} required /></div>
        <div className={styles.formGroup}><label htmlFor="description" className={styles.label}>Description</label><textarea id="description" name="description" value={postData.description} onChange={handleChange} className={styles.textarea} required /></div>
        <div className={styles.formGroup}><label htmlFor="materialsUsed" className={styles.label}>Materials Used</label><input type="text" id="materialsUsed" name="materialsUsed" value={postData.materialsUsed} onChange={handleChange} className={styles.input} /><p className={styles.helperText}>Separate with commas.</p></div>
        <div className={styles.formGroup}><label htmlFor="photos" className={styles.label}>Image URL</label><input type="url" id="photos" name="photos" value={postData.photos} onChange={handleChange} className={styles.input} placeholder="https://example.com/image.jpg" /><p className={styles.helperText}>Update the image URL if needed.</p></div>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <div className={styles.formActions}>
          <button onClick={handleSaveChanges} className={`${styles.button} ${styles.draftButton}`} disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Changes'}</button>
          {postData.status === 'Draft' && (<button onClick={handlePublish} className={`${styles.button} ${styles.publishButton}`} disabled={isLoading}>{isLoading ? 'Publishing...' : 'Publish Post'}</button>)}
        </div>
      </form>
    </div>
  );
}