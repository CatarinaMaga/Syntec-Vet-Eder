"use client";

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/components/ProductCard';
import styles from './page.module.css';

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className={styles.actionSection}>
      <div className={styles.quantityControl}>
        <button 
          onClick={() => setQuantity(q => Math.max(1, q - 1))}
          className={styles.qtyBtn}
        >-</button>
        <span className={styles.qtyDisplay}>{quantity}</span>
        <button 
          onClick={() => setQuantity(q => q + 1)}
          className={styles.qtyBtn}
        >+</button>
      </div>
      
      <button 
        onClick={handleAdd}
        className={`${styles.mainAddBtn} ${added ? styles.added : ''}`}
      >
        {added ? 'Adicionado ao Carrinho! ✓' : 'Adicionar ao Carrinho'}
      </button>
    </div>
  );
}
