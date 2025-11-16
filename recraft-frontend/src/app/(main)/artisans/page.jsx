import Link from 'next/link';
import Image from 'next/image';
import { fetchArtisans } from '@/lib/api';
import styles from './artisans.module.css';

export const revalidate = 0;

export default async function AllArtisansPage() {
  let artisans = [];
  try {
    artisans = await fetchArtisans();
  } catch (error) {
    console.error("Failed to fetch artisans:", error);
  }

  return (
    <div>
      <header className={styles.pageHeader}>
        <h1 className={styles.title}>Our Artisans</h1>
        <p className={styles.subtitle}>Meet the creative minds turning waste into wonder.</p>
      </header>

      <div className={styles.artisanGrid}>
        {artisans.map(artisan => (
          <Link key={artisan._id} href={`/artisans/${artisan._id}`} className={styles.artisanCard}>
            <div className={styles.imageContainer}>
              <Image src={artisan.profileImage || '/assets/images/default-avatar.png'} alt={artisan.name} fill={true} className={styles.artisanImage}/>
            </div>
            <h2 className={styles.storeName}>{artisan.name}</h2>
            <p className={styles.bio}>A passionate creator turning waste into wonder. Explore their unique, sustainable products.</p>
          </Link>
        ))}
      </div>
    </div>
  );
}