'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './artisans.module.css';

export default function ArtisanGrid({ initialArtisans }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filteredArtisans, setFilteredArtisans] = useState(initialArtisans);

  useEffect(() => {
    let result = initialArtisans;

    // Apply search filter
    const lowercasedTerm = searchTerm.toLowerCase();
    if (lowercasedTerm) {
      result = result.filter(artisan => {
        if (artisan.name && artisan.name.toLowerCase().includes(lowercasedTerm)) return true;
        if (artisan.contact?.address && artisan.contact.address.toLowerCase().includes(lowercasedTerm)) return true;
        return false;
      });
    }

    // Apply sorting
    if (sortBy === 'name') {
      result = [...result].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    setFilteredArtisans(result);
  }, [searchTerm, sortBy, initialArtisans]);

  return (
    <>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search by artisan name or location..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredArtisans.length > 0 ? (
        <div className={styles.artisanGrid}>
          {filteredArtisans.map(artisan => (
            <Link key={artisan._id} href={`/artisans/${artisan._id}`} className={styles.artisanCard}>
              <div className={styles.imageContainer}>
                <Image 
                  src={artisan.profileImage || '/assets/images/default-avatar.png'} 
                  alt={artisan.name} 
                  fill={true} 
                  className={styles.artisanImage}
                />
              </div>
              <h2 className={styles.storeName}>{artisan.name}</h2>
              <p className={styles.bio}>A passionate creator turning waste into wonder. Explore their unique, sustainable products.</p>
            </Link>
          ))}
        </div>
      ) : (
        <p style={{textAlign: 'center', marginTop: '2rem'}}>No artisans found.</p>
      )}
    </>
  );
}
