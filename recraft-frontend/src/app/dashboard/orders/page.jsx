'use client';

import { useState, useEffect } from 'react';
import { fetchMyOrders } from '@/lib/api';
import styles from '../dashboardPages.module.css';

const INR_CONVERSION_RATE = 83.5;

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const myOrders = await fetchMyOrders();
        setOrders(myOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadOrders();
  }, []);

  if (isLoading) return <p>Loading your order history...</p>;

  return (
    <div>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Order History</h1>
        <p className={styles.pageSubtitle}>View the status and details of your past orders.</p>
      </header>
      
      {orders.length > 0 ? (
        <table className={styles.orderTable}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product Details</th>
              <th>Total (INR)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order._id.substring(0, 8)}...<br/><small>{new Date(order.createdAt).toLocaleDateString()}</small></td>
                <td>
                  {order.orderItems.map(item => (
                    <div key={item._id}><strong>{item.name}</strong> (x{item.qty})</div>
                  ))}
                </td>
                <td>₹{(order.totalPrice * INR_CONVERSION_RATE).toFixed(2)}</td>
                <td>
                  <span className={`${styles.status} ${styles.statusDelivered}`}>{order.orderStatus}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>You have not placed any orders yet.</p>
      )}
    </div>
  );
}