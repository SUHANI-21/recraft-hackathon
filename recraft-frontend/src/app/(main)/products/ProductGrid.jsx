'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './products.module.css';
import { useCart } from '@/context/CartContext';

export default function ProductGrid({ initialProducts }) {
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);

  useEffect(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    if (!lowercasedTerm) {
      setFilteredProducts(initialProducts);
      return;
    }
    const filtered = initialProducts.filter(product => 
      product.name.toLowerCase().includes(lowercasedTerm) ||
      product.category.toLowerCase().includes(lowercasedTerm) ||
      (product.tags && product.tags.some(tag => tag.toLowerCase().includes(lowercasedTerm)))
    );
    setFilteredProducts(filtered);
  }, [searchTerm, initialProducts]);

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
                <p className={styles.productCategory}>{product.category}</p>
                {product.tags && (
                  <div className={styles.tagsContainer}>
                    {product.tags.slice(0, 3).map(tag => ( <span key={tag} className={styles.tag}>{tag}</span> ))}
                  </div>
                )}
                <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
                
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