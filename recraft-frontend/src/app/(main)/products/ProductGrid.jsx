'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './products.module.css';
import { useCart } from '@/context/CartContext';

export default function ProductGrid({ initialProducts }) {
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // 'name', 'price-low', 'price-high'
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);

  useEffect(() => {
    let result = initialProducts;
    
    // Apply search filter
    const lowercasedTerm = searchTerm.toLowerCase();
    if (lowercasedTerm) {
      result = result.filter(product => {
        if (product.name && product.name.toLowerCase().includes(lowercasedTerm)) return true;
        if (product.category && product.category.toLowerCase().includes(lowercasedTerm)) return true;
        if (product.tags && Array.isArray(product.tags) && product.tags.some(tag => tag.toLowerCase().includes(lowercasedTerm))) return true;
        if (product.description && product.description.toLowerCase().includes(lowercasedTerm)) return true;
        return false;
      });
    }
    
    // Apply sorting
    if (sortBy === 'price-low') {
      result = [...result].sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-high') {
      result = [...result].sort((a, b) => (b.price || 0) - (a.price || 0));
    } else {
      result = [...result].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }
    
    setFilteredProducts(result);
  }, [searchTerm, sortBy, initialProducts]);

  const handleAddToCart = (event, product) => {
    event.preventDefault();
    event.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search by name, category, or tag..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className={styles.sortSelect} 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="name">Sort by Name</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      {filteredProducts.length > 0 ? (
        <div className={styles.productGrid}>
          {filteredProducts.map(product => (
            <Link key={product._id} href={`/products/${product._id}`} className={styles.productCard}>
              <div className={styles.productImageContainer}>
                {/* Use the first image URL from the product's photos array */}
                <Image src={product.photos[0]} alt={product.name} fill={true} className={styles.itemImage} />
              </div>
              <div className={styles.productInfo}>
                <h3 className={styles.productName}>{product.name}</h3>
                {product.tags && (
                  <div className={styles.tagsContainer}>
                    {product.tags.slice(0, 3).map(tag => ( <span key={tag} className={styles.tag}>{tag}</span> ))}
                  </div>
                )}
                <p className={styles.productPrice}>₹{product.price.toFixed(2)}</p>
                
                {product.stock > 0 && (
                  <button 
                    onClick={(e) => handleAddToCart(e, product)} 
                    className={styles.addToCartButton}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p style={{textAlign: 'center', marginTop: '2rem'}}>No products found.</p>
      )}
    </>
  );
}