import Header from '@/components/Header';
import Catalog from '@/components/Catalog';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

export const revalidate = 60; // revalida o cache a cada 60s

export default async function Home() {
  // Buscar os produtos do Supabase (Server Side)
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar produtos:', error);
  }

  const catalogProducts = products || [];

  return (
    <>
      <Header />
      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>
            Catálogo <span className={styles.textGradient}>Syntec</span> 2026
          </h1>
          <p className={styles.heroSubtitle}>
            Encontre a medicação veterinária ideal com os melhores preços. Qualidade e confiança em cada dose.
          </p>
        </section>

        <Catalog initialProducts={catalogProducts} />
      </main>
    </>
  );
}
