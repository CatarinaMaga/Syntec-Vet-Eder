"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price_at_time: number;
  product: {
    name: string;
    image_url: string;
  };
}

interface Order {
  id: string;
  status: string;
  total_amount: number;
  shipping_address: string;
  created_at: string;
  order_items: OrderItem[];
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        // Obter pedidos e seus itens
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              id,
              product_id,
              quantity,
              price_at_time,
              product:products(name, image_url)
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          // Ajustando tipagem devido a junções do Supabase
          const formattedOrders = data.map(order => ({
            ...order,
            order_items: order.order_items.map((item: any) => ({
              ...item,
              product: item.product || { name: 'Produto Indisponível', image_url: '' }
            }))
          }));
          setOrders(formattedOrders as Order[]);
        }
        setOrdersLoading(false);
      };
      
      fetchOrders();
    }
  }, [user]);

  if (loading || !user) {
    return (
      <>
        <Header />
        <main className={styles.main}>
          <div className={styles.loading}>Carregando...</div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.profileHeader}>
            <h1 className={styles.title}>Minha Conta</h1>
            <p className={styles.subtitle}>Bem-vindo, {profile?.full_name || user.email}</p>
          </div>

          <div className={styles.ordersSection}>
            <h2>Histórico de Pedidos</h2>
            {ordersLoading ? (
              <p>Carregando pedidos...</p>
            ) : orders.length === 0 ? (
              <p className={styles.emptyMsg}>Você ainda não realizou nenhum pedido.</p>
            ) : (
              <div className={styles.ordersList}>
                {orders.map(order => (
                  <div key={order.id} className={styles.orderCard}>
                    <div className={styles.orderHeader}>
                      <div>
                        <span className={styles.orderId}>Pedido #{order.id.split('-')[0]}</span>
                        <span className={styles.orderDate}>
                          {new Date(order.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <span className={`${styles.statusBadge} ${styles[order.status]}`}>
                        {order.status === 'pending' ? 'Pendente' : 
                         order.status === 'completed' ? 'Concluído' : 'Cancelado'}
                      </span>
                    </div>

                    <div className={styles.orderAddress}>
                      <strong>Endereço de Entrega:</strong> {order.shipping_address || 'Não informado'}
                    </div>

                    <div className={styles.orderItems}>
                      {order.order_items.map(item => (
                        <div key={item.id} className={styles.itemRow}>
                          <span className={styles.itemName}>{item.quantity}x {item.product.name}</span>
                          <span className={styles.itemPrice}>
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price_at_time)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className={styles.orderTotal}>
                      <strong>Total:</strong>
                      <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total_amount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
