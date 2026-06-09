import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import AddToCartButton from './AddToCartButton';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

export const revalidate = 60; // revalida a cada 60s

export default async function ProductPage({ params }: { params: { id: string } }) {
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className={styles.main}>
        <Link href="/" className={styles.backLink}>
          ← Voltar para o catálogo
        </Link>
        
        <div className={styles.productContainer}>
          <div className={styles.imageSection}>
            <div className={styles.imageWrapper}>
              <Image 
                src={product.image_url || 'https://images.unsplash.com/photo-1584308666744-24d5e4a520d2?auto=format&fit=crop&q=80&w=400&h=300'} 
                alt={product.name}
                fill
                className={styles.image}
              />
            </div>
          </div>
          
          <div className={styles.infoSection}>
            <span className={styles.category}>{product.category}</span>
            <h1 className={styles.title}>{product.name}</h1>
            <p className={styles.price}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
            </p>
            
            <div className={styles.divider} />
            
            <div className={styles.descriptionBox}>
              <h3>Bula / Indicação</h3>
              <p>{product.description}</p>
            </div>
            
            <AddToCartButton product={product} />
          </div>
        </div>
      </main>
    </>
  );
}
