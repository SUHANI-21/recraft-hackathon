import Link from 'next/link';
import Image from 'next/image';
import { mockProducts } from '@/lib/mockData'; // We will create this next
import styles from './homepage.module.css'; // Import the CSS module

export default function HomePage() {
  // Use only the first 3 products for the featured section
  const featuredProducts = mockProducts.slice(0, 3); 

  return (
    <div>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Sustainable Creations, Reimagined</h1>
        <p className={styles.heroSubtitle}>
          Discover unique, handcrafted products made from 100% recycled materials. Shop with purpose and support artisans.
        </p>
        <Link href="/products" className={styles.heroButton}>
          Shop All Products
        </Link>
      </section>

      {/* Featured Products Section */}
      <section>
        <h2 className={styles.featuredProductsTitle}>Featured Products</h2>
        
        <div className={styles.productGrid}>
          {featuredProducts.map(product => (
            // The Link component makes the entire card clickable
            <Link key={product._id} href={`/products/${product._id}`} className={styles.productCard}>
              <div className={styles.productImageContainer}>
                <Image
                  src={product.photos[0]}
                  alt={product.name}
                  fill={true}
                  className={styles.productImage}
                  // You will need to add these placeholder images
                  // inside your public/assets/images/ folder.
                />
              </div>
              <div className={styles.productInfo}>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productCategory}>{product.category}</p>
                <p className={styles.productPrice}>₹{product.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}