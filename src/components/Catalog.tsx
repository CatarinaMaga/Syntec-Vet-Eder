"use client";

import { useState, useMemo } from 'react';
import ProductCard, { Product } from '@/components/ProductCard';
import styles from '@/app/page.module.css';

interface CatalogProps {
  initialProducts: Product[];
}

export default function Catalog({ initialProducts }: CatalogProps) {
  const [activeCategory, setActiveCategory] = useState<string>('Todos');

  // Extrair categorias únicas dos produtos
  const categories = useMemo(() => {
    const cats = new Set(initialProducts.map(p => p.category));
    return ['Todos', ...Array.from(cats)];
  }, [initialProducts]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'Todos') return initialProducts;
    return initialProducts.filter(p => p.category === activeCategory);
  }, [initialProducts, activeCategory]);

  return (
    <section className={styles.catalogSection}>
      <div className={styles.catalogHeader}>
        <h2 className={styles.sectionTitle}>Todos os Produtos</h2>
        <div className={styles.filters}>
          {categories.map(category => (
            <button
              key={category}
              className={`${styles.filterBtn} ${activeCategory === category ? styles.active : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
        {filteredProducts.length === 0 && (
          <p style={{ color: 'var(--text-secondary)' }}>Nenhum produto encontrado nesta categoria.</p>
        )}
      </div>
    </section>
  );
}
