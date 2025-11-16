'use client'; // <-- This is the most important change

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { fetchArtisanById, fetchProducts } from '@/lib/api';
import styles from './storefront.module.css';

export default function ArtisanStorefrontPage() {
  const params = useParams();
  const { id } = params;

  // State to hold the data we fetch
  const [artisan, setArtisan] = useState(null);
  const [artisanProducts, setArtisanProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Use useEffect to fetch data when the page loads
  useEffect(() => {
    if (!id) return;

    const loadArtisanData = async () => {
      try {
        // Fetch the artisan's public profile
        const artisanData = await fetchArtisanById(id);
        if (!artisanData) throw new Error('Artisan not found');
        setArtisan(artisanData);

        // Fetch all products and then filter for this artisan
        // In a more optimized backend, you'd have a dedicated endpoint for this
        const allProducts = await fetchProducts();
        const products = allProducts.filter(p => p.artisanId === artisanData._id);
        setArtisanProducts(products);

      } catch (err) {
        setError(err.message);
        console.error("Failed to load artisan data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadArtisanData();
  }, [id]); // Rerun if the ID changes

  if (isLoading) {
    return <p>Loading artisan's storefront...</p>;
  }

  // If there was an error or no artisan was found, show a 404 page
  if (error || !artisan) {
    notFound();
  }

  return (
    <div>
      <header className={styles.profileBanner}>
        <div className={styles.imageContainer}>
          <Image src={artisan.profileImage || '/assets/images/default-avatar.png'} alt={artisan.name} fill={true} className={styles.artisanImage} priority />
        </div>
        <div className={styles.profileInfo}>
          <h1 className={styles.storeName}>{artisan.name}</h1>
          <p className={styles.bio}>A passionate creator turning waste into wonder. Explore their unique, sustainable products.</p>
          {artisan.contact && (
            <div className={styles.contactSection}>
              <div className={styles.contactGrid}>
                <div className={styles.contactItem}><strong>Email:</strong><br /><a href={`mailto:${artisan.contact.email}`}>{artisan.contact.email}</a></div>
                <div className={styles.contactItem}><strong>Phone:</strong><br /><a href={`tel:${artisan.contact.phone}`}>{artisan.contact.phone}</a></div>
                <div className={styles.contactItem}><strong>Address:</strong><br /><span>{artisan.contact.address}</span></div>
              </div>
            </div>
          )}
        </div>
      </header>

      <section>
        <h2 className={styles.productsTitle}>Products by {artisan.name}</h2>
        {artisanProducts.length > 0 ? (
          <div className={styles.productGrid}>
            {artisanProducts.map(product => (
              <Link key={product._id} href={`/products/${product._id}`} className={styles.productCard}>
                <div className={styles.productImageContainer}><Image src={product.photos[0]} alt={product.name} fill={true} className={styles.productImage} /></div>
                <div className={styles.productInfo}><h3 className={styles.productName}>{product.name}</h3><p className={styles.productPrice}>${product.price.toFixed(2)}</p></div>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.noProductsMessage}><p>{artisan.name} hasn't listed any products yet.</p></div>
        )}
      </section>
    </div>
  );
}