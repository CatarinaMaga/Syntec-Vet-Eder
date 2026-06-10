"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Header from '@/components/Header';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

export default function CartPage() {
  const router = useRouter();
  const { items, removeFromCart, total, clearCart } = useCart();
  const { user } = useAuth();
  const [shippingAddress, setShippingAddress] = useState('');

  const handleCheckout = async () => {
    if (items.length === 0) return;
    if (!user) {
      router.push('/login');
      return;
    }
    if (!shippingAddress.trim()) {
      alert("Por favor, preencha o endereço de entrega.");
      return;
    }
    
    try {
      // 1. Criar pedido no Supabase
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: total,
          status: 'pending',
          shipping_address: shippingAddress.trim()
        })
        .select()
        .single();
        
      if (orderError) throw orderError;

      // 2. Criar itens do pedido
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_time: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Constrói a mensagem para o WhatsApp
      let message = `Olá! Gostaria de fazer um pedido (ID: ${order.id.split('-')[0]}) da vitrine Syntec:\n\n`;
      items.forEach(item => {
        message += `- ${item.quantity}x ${item.name} (${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)} cada)\n`;
      });
      message += `\n*Endereço de Entrega:* ${shippingAddress.trim()}\n`;
      message += `\n*Total: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}*\n\n`;
      message += "Por favor, aguardo retorno para confirmar os detalhes da entrega e pagamento.";

      const whatsappNumber = "5571999216734";
      const encodedMessage = encodeURIComponent(message);
      
      clearCart();
      window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
      router.push('/');
    } catch (error) {
      console.error("Erro ao fechar pedido:", error);
      alert("Houve um erro ao processar seu pedido. Tente novamente.");
    }
  };

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Seu Carrinho</h1>
          <Link href="/" className={styles.continueBtn}>Continuar Comprando</Link>
        </div>

        {items.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🛒</div>
            <h2>Seu carrinho está vazio</h2>
            <p>Explore nosso catálogo e encontre os produtos ideais.</p>
          </div>
        ) : (
          <div className={styles.cartLayout}>
            <div className={styles.itemsList}>
              {items.map(item => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <Image src={item.image_url} alt={item.name} fill className={styles.image} />
                  </div>
                  <div className={styles.itemInfo}>
                    <h3>{item.name}</h3>
                    <p className={styles.itemCategory}>{item.category}</p>
                    <div className={styles.itemMeta}>
                      <span className={styles.itemPrice}>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
                      </span>
                      <span className={styles.itemQty}>Qtd: {item.quantity}</span>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className={styles.removeBtn} aria-label="Remover item">
                    ✕
                  </button>
                </div>
              ))}
            </div>
            
            <div className={styles.summary}>
              <h2>Resumo do Pedido</h2>
              
              <div className={styles.addressGroup}>
                <label htmlFor="address">Endereço de Entrega</label>
                <textarea 
                  id="address" 
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Rua, Número, Bairro, Cidade, CEP..."
                  rows={3}
                  className={styles.addressInput}
                />
              </div>

              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Frete</span>
                <span className={styles.highlight}>A combinar</span>
              </div>
              <div className={styles.divider} />
              <div className={styles.summaryTotal}>
                <span>Total</span>
                <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
              </div>
              
              <button onClick={handleCheckout} className={styles.checkoutBtn}>
                Finalizar Pedido via WhatsApp
              </button>
              <p className={styles.checkoutNote}>
                Você será redirecionado para o WhatsApp do nosso representante para combinar entrega e pagamento.
              </p>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
