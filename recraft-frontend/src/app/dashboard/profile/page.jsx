'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { updateUserProfile } from '@/lib/api';
import styles from '../dashboardPages.module.css';
import Image from 'next/image';

export default function ProfilePage() {
  const { user, setUser } = useAuth(); // assuming your AuthContext exposes setUser()

  const [imagePreview, setImagePreview] = useState('/assets/images/default-avatar.png');

  const [formData, setFormData] = useState({
    name: '',
    profileImage: '',
    phone: '',
    address: '',
  });

  // Load data from user when available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        profileImage: user.profileImage || '',
        phone: user.contact?.phone || '',
        address: user.contact?.address || '',
      });

      setImagePreview(user.profileImage || '/assets/images/default-avatar.png');
    }
  }, [user]);

  // For image URL update
  const handleImageChange = (e) => {
    const url = e.target.value;
    setFormData({ ...formData, profileImage: url });

    // live preview if a valid URL
    if (url?.startsWith('http')) {
      setImagePreview(url);
    } else {
      setImagePreview('/assets/images/default-avatar.png');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const dataToSend = {
      name: formData.name,
      profileImage: formData.profileImage,
      contact: {
        phone: formData.phone,
        address: formData.address,
      },
    };

    try {
      console.log('Sending profile update:', dataToSend);
      const updatedUser = await updateUserProfile(dataToSend);
      console.log('Profile update response:', updatedUser);

      // Merge old + new to avoid deleting fields
      const mergedUser = { ...user, ...updatedUser };

      // Update localStorage
      localStorage.setItem('recraft_user', JSON.stringify(mergedUser));

      // Update AuthContext
      if (setUser) setUser(mergedUser);

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Failed to update profile: ' + error.message);
    }
  };

  if (!user) return <p>Loading user profile...</p>;

  return (
    <div>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>My Profile</h1>
        <p className={styles.pageSubtitle}>Welcome, {user.name}! View and edit your details here.</p>
      </header>

      {/* --- Profile Image Preview --- */}
      {user.userType === 'Artisan' && (
        <div className={styles.profilePictureSection}>
          <div className={styles.avatarPreview}>
            <img
              src={imagePreview}
              alt="Profile avatar"
              className={styles.avatarImage}
              onError={(e) => {
                e.target.src = '/assets/images/default-avatar.png';
              }}
            />
          </div>
        </div>
      )}

      {/* --- FORM --- */}
      <form onSubmit={handleSave} className={styles.form}>
        {user.userType === 'Artisan' && (
          <div className={styles.formGroup}>
            <label htmlFor="profileImage" className={styles.label}>Profile Image URL</label>
            <input
              type="text"
              id="profileImage"
              name="profileImage"
              value={formData.profileImage}
              onChange={handleImageChange}
              className={styles.input}
              placeholder="https://i.imgur.com/xxxx.png"
            />
          </div>
        )}

        {/* NAME */}
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            {user.userType === 'Artisan' ? 'Store Name' : 'Full Name'}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        {/* EMAIL (READ-ONLY) */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Email Address</label>
          <input
            type="email"
            className={styles.input}
            defaultValue={user.email}
            disabled
          />
        </div>

        {/* PHONE + ADDRESS FOR ARTISAN */}
        {user.userType === 'Artisan' && (
          <>
            <div className={styles.formGroup}>
              <label className={styles.label}>Contact Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Shop Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
          </>
        )}

        <button type="submit" className={styles.button}>
          Save Changes
        </button>
      </form>
    </div>
  );
}
