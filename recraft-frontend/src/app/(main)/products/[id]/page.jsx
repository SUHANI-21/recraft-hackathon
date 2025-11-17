'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import { fetchProductById, fetchArtisanById } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import styles from './productDetail.module.css';

const HeartIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

export default function ProductDetailPage() {
  const params = useParams();
  const { id } = params;

  const [product, setProduct] = useState(null);
  const [artisan, setArtisan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;
    const loadProductData = async () => {
      try {
        const productData = await fetchProductById(id);
        setProduct(productData);
        setLikeCount(Math.floor(Math.random() * 250)); // Set initial simulated likes
        if (productData.artisanId) {
          const artisanData = await fetchArtisanById(productData.artisanId);
          setArtisan(artisanData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadProductData();
  }, [id]);

  if (isLoading) return <p>Loading product details...</p>;
  if (error || !product) notFound();

  // --- COMPLETE HANDLER FUNCTIONS ---

  const handleAddToCart = () => {
    const numQuantity = parseInt(quantity, 10);
    if (isNaN(numQuantity) || numQuantity <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }
    if (numQuantity > product.stock) {
      alert(`Sorry, only ${product.stock} items are available.`);
      return;
    }
    addToCart(product, numQuantity);
  };

  const handleContactClick = () => {
    if (!artisan) return;
    const email = artisan.email || 'Not provided';
    const phone = artisan.contact?.phone || 'Not provided';
    const message = `This is a simulation. Contact ${artisan.name} using:\n\nEmail: ${email}\nPhone: ${phone}`;
    alert(message);
  };
  
  const handleLikeClick = () => {
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    setIsLiked(!isLiked);
  };

  return (
    <div className={styles.productContainer}>
      <div className={styles.imageGallery}>
        <div className={styles.mainImageContainer}>
          <Image src={product.photos[0]} alt={product.name} fill={true} className={styles.mainImage} priority />
        </div>
      </div>
      <div className={styles.details}>
        <p className={styles.category}>{product.category}</p>
        <h1 className={styles.name}>{product.name}</h1>
        <p className={styles.price}>₹{product.price.toFixed(2)}</p>
        <p className={styles.description}>{product.description}</p>
        <div className={styles.ctaSection}>
          {product.stock > 0 ? (
            <>
              <label htmlFor="quantity" style={{ fontWeight: '500' }}>Quantity:</label>
              <input
                id="quantity"
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className={styles.quantityInput}
                aria-label="Quantity"
              />
              <button onClick={handleAddToCart} className={styles.addToCartButton}>
                Add to Cart ({product.stock} left)
              </button>
            </>
          ) : (
            <button className={styles.outOfStockButton} disabled>
              Out of Stock
            </button>
          )}
        </div>
        <div className={styles.actions}>
          <button onClick={handleLikeClick} className={`${styles.likeButton} ${isLiked ? styles.liked : ''}`}>
            <HeartIcon className={styles.heartIcon} style={{ fill: isLiked ? 'currentColor' : 'none' }} />
            {likeCount}
          </button>
        </div>
        {artisan && (
          <div className={styles.artisanInfo}>
            <div className={styles.artisanInfoHeader}>
              <div className={styles.artisanAvatarContainer}>
                <Image src={artisan.profileImage || '/assets/images/default-avatar.png'} alt={artisan.name} fill={true} className={styles.artisanImage} />
              </div>
              <div>
                <Link href={`/artisans/${artisan._id}`} className={styles.artisanStoreName}>
                  Sold by {artisan.name}
                </Link>
              </div>
            </div>
            <div className={styles.artisanContact}>
              <button onClick={handleContactClick} className={styles.contactArtisanButton}>
                Contact Artisan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}