"use client";

import { useCart } from '@/context/CartContext';
import { Product } from '@/components/ProductCard';
import { useRouter } from 'next/navigation';

export default function AddToCartAction({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const router = useRouter();

  const handleAdd = () => {
    addToCart(product);
    router.push('/cart');
  };

  return (
    <button className="btn-neon" onClick={handleAdd} style={{ width: '100%' }}>
      Adicionar ao Carrinho
    </button>
  );
}
