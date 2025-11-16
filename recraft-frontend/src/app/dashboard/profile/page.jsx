'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { updateUserProfile } from '@/lib/api'; // <-- IMPORT API function
import styles from '../dashboardPages.module.css';
import Image from 'next/image';

export default function ProfilePage() {
  const { user, login } = useAuth(); // We might need to "re-login" to update the context state
  
  // State to manage the form fields
  const [formData, setFormData] = useState({
    name: '',
    profileImage: '', // Will hold the image URL
    phone: '',
    address: '',
  });

  // When the user data loads, populate the form
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        profileImage: user.profileImage || '',
        phone: user.contact?.phone || '',
        address: user.contact?.address || '',
      });
    }
  }, [user]);

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
      }
    };

    try {
      const updatedUser = await updateUserProfile(dataToSend);
      // To update the UI instantly, we can update the user in our AuthContext
      // This is a simplified "re-login" to refresh the user state globally
      const localUserData = JSON.parse(localStorage.getItem('recraft_user'));
      const newLocalUserData = { ...localUserData, ...updatedUser };
      localStorage.setItem('recraft_user', JSON.stringify(newLocalUserData));
      // Manually update context state if `login` doesn't do it
      // This part might need adjustment based on your final AuthContext implementation
      
      alert('Profile updated successfully!');
    } catch (error) {
      alert(`Failed to update profile: ${error.message}`);
    }
  };

  if (!user) { return <p>Loading user profile...</p>; }

  return (
    <div>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>My Profile</h1>
        <p className={styles.pageSubtitle}>Welcome, {user.name}! View and edit your details here.</p>
      </header>
      
      {/* The form now uses the `formData` state for values and onChange */}
      <form onSubmit={handleSave} className={styles.form}>
        {user.type === 'Artisan' && (
           <div className={styles.formGroup}>
            <label htmlFor="profileImage" className={styles.label}>Profile Image URL</label>
            <input type="text" id="profileImage" name="profileImage" value={formData.profileImage} onChange={handleChange} className={styles.input} />
           </div>
        )}
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>{user.type === 'Artisan' ? 'Store Name' : 'Full Name'}</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={styles.input} />
        </div>
        
        {/* ... other fields like email (disabled), phone, address ... */}

        <button type="submit" className={styles.button}>
          Save Changes
        </button>
      </form>
    </div>
  );
}