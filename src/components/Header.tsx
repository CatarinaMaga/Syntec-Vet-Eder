"use client";

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import styles from './Header.module.css';

export default function Header() {
  const { items } = useCart();
  const { user, signOut } = useAuth();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Syntec<span className={styles.highlight}>Vet</span>
        </Link>
        <nav className={styles.nav}>
          {user ? (
            <div className={styles.userMenu}>
              <span className={styles.userEmail}>{user.email}</span>
              <button onClick={signOut} className={styles.logoutBtn}>Sair</button>
            </div>
          ) : (
            <Link href="/login" className={styles.loginBtn}>Entrar</Link>
          )}
          <Link href="/cart" className={styles.cartBtn}>
            <span className={styles.cartIcon}>🛒</span>
            {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
}
