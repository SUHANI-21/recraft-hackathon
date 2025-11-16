import Link from 'next/link';
import Image from 'next/image';
import { fetchPosts } from '@/lib/api';
import styles from './inspiration-hub.module.css';

export const revalidate = 0; // Don't cache, always get fresh posts

export default async function InspirationHubPage() {
  let posts = [];
  try {
    posts = await fetchPosts();
  } catch (error) {
    console.error("Failed to fetch inspiration posts:", error);
  }

  return (
    <div>
      <header className={styles.pageHeader}>
        <h1 className={styles.title}>Inspiration Hub</h1>
        <p className={styles.subtitle}>Get inspired by creative projects from our community!</p>
      </header>

      <div className={styles.inspirationGrid}>
        {/* We will filter out any posts that don't have a valid user to prevent other crashes */}
        {posts.filter(post => post.user).map(post => (
          <Link key={post._id} href={`/inspiration-hub/${post._id}`} className={styles.inspirationCard}>
            
            {/* --- THIS IS THE FIX --- */}
            {/* First, check if the photos array exists and is not empty */}
            {post.photos && post.photos.length > 0 ? (
              <div className={styles.imageContainer}>
                <Image 
                  src={post.photos[0]} 
                  alt={post.title} 
                  fill={true} 
                  className={styles.cardImage} 
                />
              </div>
            ) : (
              // OPTIONAL: You can render a placeholder if there's no image
              <div className={styles.imageContainer} style={{ backgroundColor: '#f0f0f0' }}>
                {/* No image available */}
              </div>
            )}

            <div className={styles.cardContent}>
              <h2 className={styles.cardTitle}>{post.title}</h2>
              <p className={styles.cardDescription}>{post.description}</p>
              <div className={styles.cardMeta}>
                <div className={styles.avatarContainer}>
                  <Image 
                    src={post.user.profileImage || '/assets/images/default-avatar.png'} 
                    alt={post.user.name} 
                    fill={true} 
                    className={styles.avatarImage} 
                  />
                </div>
                <span className={styles.userName}>by {post.user.name}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}