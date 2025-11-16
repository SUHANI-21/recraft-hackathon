import { fetchProducts } from '@/lib/api';
import ProductGrid from './ProductGrid'; // The interactive part of the page
import styles from './products.module.css';

// This special variable tells Next.js not to cache this page,
// so you always see the latest products from the database.
export const revalidate = 0; 

// This is a SERVER COMPONENT. It runs on the server.
export default async function AllProductsPage() {
  let initialProducts = [];
  try {
    // 1. Fetch data on the server when a user requests this page
    initialProducts = await fetchProducts();
  } catch (error) {
    console.error("Failed to fetch products:", error);
    // You could render an error component here
  }

  return (
    <div>
      <header className={styles.pageHeader}>
        <h1 className={styles.title}>All Products</h1>
        <p className={styles.subtitle}>Browse our collection of unique, sustainable creations.</p>
      </header>
      
      {/* 2. Pass the server-fetched data as a prop to our Client Component */}
      <ProductGrid initialProducts={initialProducts} />
    </div>
  );
}