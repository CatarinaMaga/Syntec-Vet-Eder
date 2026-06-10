import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import AddToCartAction from './AddToCartAction';
import styles from './page.module.css';
import { notFound } from 'next/navigation';

export const revalidate = 60;

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
