// Complete Code for: src/app/dashboard/my-products/add/page.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct } from '@/lib/api';
import styles from './addProduct.module.css';

const COMMON_TAGS = ['Eco-Friendly', 'Handmade', 'Recycled', 'Sustainable', 'Upcycled', 'Organic', 'Fair Trade', 'Vegan'];

export default function AddProductPage() {
  const router = useRouter();
  const [productData, setProductData] = useState({
    name: '', description: '', price: '', stock: '', category: 'Fashion',
    tags: [], photos: '',
  });
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => { setProductData(prev => ({ ...prev, [e.target.name]: e.target.value })); };

  const addTag = (tag) => {
    if (tag && !productData.tags.includes(tag)) {
      setProductData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setProductData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // The backend will automatically set the status to 'Draft'
      
      await createProduct(productData);
      alert("Product created as a draft!");
      router.push('/dashboard/my-products');
    } catch (error) {
      alert(`Failed to create product: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <header className={styles.formHeader}>
        <h1 className={styles.formTitle}>Add a New Product</h1>
        <p className={styles.formSubtitle}>Fill out the details to list a new item. It will be saved as a draft.</p>
      </header>
      <form onSubmit={handleSubmit}>
        <section className={styles.formSection}>
          <h2 className={styles.sectionTitle}>1. Image</h2>
          <div className={styles.formGroup}>
            <label htmlFor="photos" className={styles.label}>Image URL</label>
            <input type="text" id="photos" name="photos" value={productData.photos} onChange={handleChange} className={styles.input} placeholder="https://i.imgur.com/your-image.jpg" required />
          </div>
        </section>
        <section className={styles.formSection}>
          <h2 className={styles.sectionTitle}>2. Basic Information</h2>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>Product Name</label>
            <input type="text" id="name" name="name" value={productData.name} onChange={handleChange} className={styles.input} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>Description</label>
            <textarea id="description" name="description" value={productData.description} onChange={handleChange} className={styles.textarea} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="category" className={styles.label}>Category</label>
            <input type="text" id="category" name="category" value={productData.category} onChange={handleChange} className={styles.input} placeholder="e.g., Fashion, Jewelry, Accessories" required />
          </div>
        </section>
        <section className={styles.formSection}>
          <h2 className={styles.sectionTitle}>3. Pricing & Inventory</h2>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="price" className={styles.label}>Price (INR)</label>
              <input type="number" id="price" name="price" value={productData.price} onChange={handleChange} className={styles.input} min="0" step="0.01" required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="stock" className={styles.label}>Stock Quantity</label>
              <input type="number" id="stock" name="stock" value={productData.stock} onChange={handleChange} className={styles.input} min="0" required />
            </div>
          </div>
        </section>
        <section className={styles.formSection}>
          <h2 className={styles.sectionTitle}>4. Tags</h2>
          <div className={styles.formGroup}>
            <label className={styles.label}>Add Tags</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input 
                type="text" 
                value={newTag} 
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag(newTag))}
                className={styles.input} 
                placeholder="Type a tag and press Enter"
                style={{ flex: 1 }}
              />
              <button 
                type="button" 
                onClick={() => addTag(newTag)} 
                className={`${styles.button} ${styles.publishButton}`}
              >
                Add
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Popular Tags</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
              {COMMON_TAGS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addTag(tag)}
                  className={styles.tagButton}
                  style={{ 
                    padding: '0.5rem 1rem', 
                    border: '1px solid #ddd', 
                    borderRadius: '20px',
                    cursor: 'pointer',
                    backgroundColor: productData.tags.includes(tag) ? '#e8f5e9' : 'white'
                  }}
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          {productData.tags.length > 0 && (
            <div className={styles.formGroup}>
              <label className={styles.label}>Selected Tags</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {productData.tags.map(tag => (
                  <div
                    key={tag}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: '#e8f5e9',
                      borderRadius: '20px',
                      color: '#2e7d32'
                    }}
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#2e7d32',
                        cursor: 'pointer',
                        fontSize: '1.2rem'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
        <div className={styles.formActions}>
          <button type="submit" className={`${styles.button} ${styles.publishButton}`} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save as Draft'}
          </button>
        </div>
      </form>
    </div>
  );
}