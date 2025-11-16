'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchMyProducts, deleteProduct } from '@/lib/api'; // These API functions need to be created
import styles from '../dashboardPages.module.css';
import listStyles from './myProducts.module.css';

export default function MyProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadMyProducts = async () => {
      try {
        // Fetch only the products belonging to the logged-in artisan
        const myProducts = await fetchMyProducts();
        setProducts(myProducts);
      } catch (err) {
        setError('Failed to load your products. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadMyProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to permanently delete this product?")) {
      try {
        await deleteProduct(productId);
        // Update the UI by removing the deleted product from the state
        setProducts(currentProducts => currentProducts.filter(p => p._id !== productId));
        alert("Product deleted successfully!");
      } catch (err) {
        alert(`Failed to delete product: ${err.message}`);
      }
    }
  };

  if (isLoading) {
    return <p>Loading your products...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>My Products</h1>
        <p className={styles.pageSubtitle}>Manage your product listings, inventory, and status.</p>
      </header>

      <div style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard/my-products/add" className={styles.button}>
          + Add New Product
        </Link>
      </div>

      <div className={listStyles.productList}>
        {products.length > 0 ? (
          products.map(product => (
            <div key={product._id} className={listStyles.productItem}>
              <div className={listStyles.productDetails}>
                <h3 className={listStyles.productName}>{product.name}</h3>
                <span className={`${listStyles.status} ${product.status === 'Published' ? listStyles.statusPublished : listStyles.statusDraft}`}>
                  {product.status}
                </span>
                <span className={listStyles.stock}>Stock: {product.stock}</span>
              </div>
              <div className={listStyles.productActions}>
                <Link href={`/dashboard/my-products/edit/${product._id}`} className={listStyles.editButton}>
                  Edit
                </Link>
                <button onClick={() => handleDelete(product._id)} className={listStyles.deleteButton}>
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed #ddd', borderRadius: '8px' }}>
            <p>You haven't listed any products yet. Click the "Add New Product" button to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}