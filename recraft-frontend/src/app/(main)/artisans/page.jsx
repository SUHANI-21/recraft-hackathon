import Link from 'next/link';
import Image from 'next/image';
import { fetchArtisans } from '@/lib/api';
import ArtisanGrid from './ArtisanGrid';
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

      <ArtisanGrid initialArtisans={artisans} />
    </div>
  );
}