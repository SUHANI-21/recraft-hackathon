'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import { fetchMyProductById, updateProduct } from '@/lib/api';
import styles from '../../add/addProduct.module.css'; 

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [productData, setProductData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch the specific product data when the page loads
  useEffect(() => {
    if (!id) return;
    const loadProductForEdit = async () => {
      try {
        const product = await fetchMyProductById(id);
        setProductData({
          ...product,
          photos: product.photos[0] || '', // Convert array to string for the form
        });
      } catch (err) {
        setError('Failed to load product data.');
      }
    };
    loadProductForEdit();
  }, [id]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!productData) return <p>Loading product data...</p>;
  
  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };
  
  // Generic handler for both saving and publishing
  const handleUpdate = async (newStatus) => {
    setIsLoading(true);
    setError('');
    try {
      const dataToSend = {
        ...productData,
        photos: [productData.photos], // Convert back to array for the backend
        status: newStatus, // Set the status based on the button clicked
      };
      
      await updateProduct(id, dataToSend);
      alert(`Product successfully ${newStatus === 'Published' ? 'published' : 'updated'}!`);
      router.push('/dashboard/my-products');
    } catch (err) {
      setError(`Failed to update product: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <header className={styles.formHeader}>
        <h1 className={styles.formTitle}>Edit Product</h1>
        <p className={styles.formSubtitle}>Update the details for "{productData.name}"</p>
      </header>

      <form onSubmit={(e) => e.preventDefault()}>
        <section className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Image</h2>
          <div className={styles.formGroup}><label htmlFor="photos" className={styles.label}>Image URL</label><input type="text" id="photos" name="photos" value={productData.photos} onChange={handleChange} className={styles.input} required /></div>
        </section>

        <section className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Basic Information</h2>
          <div className={styles.formGroup}><label htmlFor="name" className={styles.label}>Product Name</label><input type="text" id="name" name="name" value={productData.name} onChange={handleChange} className={styles.input} required /></div>
          <div className={styles.formGroup}><label htmlFor="description" className={styles.label}>Description</label><textarea id="description" name="description" value={productData.description} onChange={handleChange} className={styles.textarea} required /></div>
        </section>

        <section className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Pricing & Inventory</h2>
          <div className={styles.formRow}>
            <div className={styles.formGroup}><label htmlFor="price" className={styles.label}>Price (USD)</label><input type="number" id="price" name="price" value={productData.price} onChange={handleChange} className={styles.input} required min="0" /></div>
            <div className={styles.formGroup}><label htmlFor="stock" className={styles.label}>Stock Quantity</label><input type="number" id="stock" name="stock" value={productData.stock} onChange={handleChange} className={styles.input} required min="0" /></div>
          </div>
        </section>
        
        {error && <p style={{ color: 'red', textAlign: 'center', margin: '1rem 0' }}>{error}</p>}

        <div className={styles.formActions}>
          <button type="button" onClick={() => handleUpdate(productData.status)} className={`${styles.button} ${styles.draftButton}`} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
          
          {/* Conditionally show the "Publish" button only if the product is a draft */}
          {productData.status === 'Draft' && (
            <button type="button" onClick={() => handleUpdate('Published')} className={`${styles.button} ${styles.publishButton}`} disabled={isLoading}>
              {isLoading ? 'Publishing...' : 'Publish Product'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}