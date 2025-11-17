'use client';

import { useAuth } from '@/context/AuthContext';
import styles from './dashboard.module.css';
import Link from 'next/link'; // <-- IMPORT Link

// Reusable Sidebar component
function Sidebar() {
  const { user, logout } = useAuth(); // <-- GET THE FULL USER OBJECT
   console.log('Inspecting user in Sidebar:', user);
  
  return (
    <aside className={styles.sidebar}>
      <h3>My Account</h3>
      <nav>
        <ul className={styles.sidebarNav}>
          <li><Link href="/dashboard/profile" className={styles.navLink}>Profile</Link></li>
          <li><Link href="/dashboard/orders" className={styles.navLink}>Order History</Link></li>
          
          {/* --- NEW LINK FOR ALL USERS --- */}
          <li><Link href="/dashboard/my-posts" className={styles.navLink}>My Posts</Link></li>

         {user && user.userType === 'Artisan' && (
            <li>
              <Link href="/dashboard/my-products" className={styles.navLink}>
                My Products
              </Link>
            </li>
          )}
          
          <li><Link href="/dashboard/settings" className={styles.navLink}>Settings</Link></li>
        </ul>
      </nav>
      <button onClick={logout} className={styles.logoutButton}>Logout</button>
    </aside>
  );

}

// ... the rest of the file (DashboardLayout) remains the same ...
export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();

  // Show loading state while auth context is initializing
  if (loading) {
    return <div className={styles.dashboardLayout}><p>Loading...</p></div>;
  }

  // Redirect to login only if loading is complete AND user is not authenticated
  if (!user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }

  return (
    <div className={styles.dashboardLayout}>
      <Sidebar />
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}