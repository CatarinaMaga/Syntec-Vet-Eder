"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import styles from './page.module.css';

export default function NewProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'ANESTÉSICOS',
    image_url: '',
    active: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: insertError } = await supabase
      .from('products')
      .insert({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image_url: formData.image_url,
        active: formData.active
      });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
    } else {
      router.push('/admin');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <Link href="/admin" className={styles.backBtn}>← Voltar</Link>
          <h1 className={styles.title}>Novo Produto</h1>
        </div>
      </div>

      <div className={styles.formCard}>
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Nome do Produto</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              required 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Ex: ANESTT 50ml"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="description">Descrição</label>
            <textarea 
              id="description" 
              name="description" 
              rows={4} 
              required 
              value={formData.description} 
              onChange={handleChange} 
              placeholder="Detalhes sobre indicações, dosagem, etc..."
            />
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label htmlFor="price">Preço (R$)</label>
              <input 
                type="number" 
                id="price" 
                name="price" 
                step="0.01" 
                min="0" 
                required 
                value={formData.price} 
                onChange={handleChange} 
                placeholder="0.00"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="category">Categoria</label>
              <select 
                id="category" 
                name="category" 
                required 
                value={formData.category} 
                onChange={handleChange}
              >
                <option value="ANESTÉSICOS">Anestésicos</option>
                <option value="ANTI-INFLAMATÓRIOS">Anti-inflamatórios</option>
                <option value="ANTIBIÓTICOS">Antibióticos</option>
                <option value="GASTROINTESTINAIS">Gastrointestinais</option>
                <option value="VITAMINAS">Vitaminas</option>
                <option value="OUTROS">Outros</option>
              </select>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="image_url">URL da Imagem</label>
            <input 
              type="url" 
              id="image_url" 
              name="image_url" 
              required 
              value={formData.image_url} 
              onChange={handleChange} 
              placeholder="https://..."
            />
          </div>

          <div className={styles.checkboxGroup}>
            <input 
              type="checkbox" 
              id="active" 
              name="active" 
              checked={formData.active} 
              onChange={handleChange}
            />
            <label htmlFor="active">Produto Ativo (Visível na loja)</label>
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
