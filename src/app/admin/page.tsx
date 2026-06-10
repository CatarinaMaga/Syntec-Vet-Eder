"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  active: boolean;
  image_url: string;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('products')
      .update({ active: !currentStatus })
      .eq('id', id);
    
    if (!error) {
      setProducts(products.map(p => p.id === id ? { ...p, active: !currentStatus } : p));
    } else {
      alert('Erro ao atualizar status do produto.');
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
      
    if (!error) {
      setProducts(products.filter(p => p.id !== id));
    } else {
      alert('Erro ao excluir produto.');
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Gerenciar Produtos</h1>
      </div>

      {loading ? (
        <p>Carregando produtos...</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>
                    <div className={styles.productCell}>
                      <div className={styles.imageWrapper}>
                        <Image src={product.image_url} alt={product.name} fill className={styles.image} />
                      </div>
                      <span className={styles.productName}>{product.name}</span>
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}</td>
                  <td>
                    <button 
                      onClick={() => toggleActive(product.id, product.active)}
                      className={`${styles.statusBadge} ${product.active ? styles.active : styles.inactive}`}
                    >
                      {product.active ? 'Ativo' : 'Inativo'}
                    </button>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button onClick={() => deleteProduct(product.id)} className={styles.deleteBtn}>Excluir</button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className={styles.emptyRow}>Nenhum produto cadastrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
