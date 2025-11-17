'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import styles from './cart.module.css';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

  // If the cart is empty, show a message
  if (cartItems.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <h1 className={styles.pageTitle}>Your Cart is Empty</h1>
        <p>Looks like you haven't added any sustainable treasures yet.</p>
        <Link href="/products" className={styles.continueShoppingButton}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  // If the cart has items, show the main layout
  return (
    <div>
      <h1 className={styles.pageTitle}>Your Shopping Cart</h1>
      <div className={styles.cartLayout}>
        {/* Column 1: Cart Items */}
        <div className={styles.itemsList}>
          {cartItems.map(item => (
            <div key={item._id} className={styles.item}>
              <div className={styles.imageContainer}>
                <Image src={item.photos[0]} alt={item.name} fill={true} className={styles.itemImage} />
              </div>
              <div className={styles.itemDetails}>
                <Link href={`/products/${item._id}`} className={styles.itemName}>
                  {item.name}
                </Link>
                <p className={styles.itemPrice}>₹{item.price.toFixed(2)}</p>
                <div className={styles.itemActions}>
                  <input
                    type="number"
                    min="1"
                    className={styles.quantityInput}
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item._id, e.target.value)}
                    aria-label={`Quantity for ${item.name}`}
                  />
                  <button onClick={() => removeFromCart(item._id)} className={styles.removeButton}>
                    Remove
                  </button>
                </div>
              </div>
              <p className={styles.itemSubtotal}>
                ₹{(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Column 2: Order Summary */}
        <div className={styles.summary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>
          <div className={styles.summaryLine}>
            <span>Subtotal</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>
          <div className={styles.summaryLine}>
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>
          <Link href="/checkout" className={styles.checkoutButton}>
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}