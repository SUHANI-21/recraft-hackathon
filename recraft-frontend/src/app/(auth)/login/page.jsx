'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import VantaBackground from '@/components/common/VantaBackground';
import styles from '../auth.module.css';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth(); // <-- Use the new REAL login function from the context
  const [formData, setFormData] = useState({ email: '', password: '' });
  
  // State for handling loading and errors
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Call the new async login function from the context
      await login(formData.email, formData.password);
      
      // On success, redirect the user to their dashboard profile
      router.push('/dashboard/profile');

    } catch (err) {
      // If the API throws an error, display it to the user
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <VantaBackground />
      <div className={styles.authContainer}>
        <div className={styles.formCard}>
          <h1 className={styles.title}>Login</h1>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input 
                type="email" id="email" name="email" 
                className={styles.input} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input 
                type="password" id="password" name="password" 
                className={styles.input} 
                onChange={handleChange} 
                required 
              />
            </div>

            {/* Display error message if there is one from the backend */}
            {error && (
              <p style={{ color: '#c62828', textAlign: 'center', marginBottom: '1rem' }}>
                {error}
              </p>
            )}
            
            <button type="submit" className={styles.button} disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className={styles.altLink}>
            Don't have an account? <Link href="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </>
  );
}