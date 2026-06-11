import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import AddToCartAction from './AddToCartAction';
import styles from './page.module.css';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !product) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h1>Erro ao carregar o produto</h1>
        <p>ID Buscado: {id}</p>
        <p>Erro do banco: {error?.message || 'Produto não encontrado'}</p>
        <Link href="/">Voltar para o catálogo</Link>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className={styles.container}>
        <Link href="/" className={styles.backLink}>
          ← Voltar para o catálogo
        </Link>
        
        <div className={styles.productWrapper}>
          <div className={styles.imageBox}>
            <Image 
              src={product.image_url || '/placeholder.png'} 
              alt={product.name} 
              fill
              className={styles.image}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          
          <div className={styles.info}>
            <span className={styles.category}>{product.category}</span>
            <h1 className={styles.title}>{product.name}</h1>
            
            <p className={styles.description}>{product.description}</p>
            
            <div className={styles.priceBox}>
              <span className={styles.priceLabel}>Preço sugerido</span>
              <div className={styles.price}>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
              </div>
            </div>
            
            <AddToCartAction product={product} />
          </div>
        </div>
      </main>
    </>
  );
}
