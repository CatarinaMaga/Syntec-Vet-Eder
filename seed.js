
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const MOCK_PRODUCTS = [
  {
    name: 'Anestt 50ml',
    description: 'Anestésico local a base de Cloridrato de Lidocaína 2% sem vasoconstritor. Indicado para cães, gatos, bovinos e equinos.',
    price: 35.90,
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5e4a520d2?auto=format&fit=crop&q=80&w=400&h=300',
    category: 'Anestésicos',
    active: true
  },
  {
    name: 'Cortvet 50ml',
    description: 'Anti-inflamatório esteroidal (Dexametasona). Rápida ação para casos de alergias e inflamações severas.',
    price: 42.50,
    image_url: 'https://images.unsplash.com/photo-1583324113626-70df0f4deaab?auto=format&fit=crop&q=80&w=400&h=300',
    category: 'Anti-inflamatórios',
    active: true
  },
  {
    name: 'Maxicam 2% 50ml',
    description: 'Anti-inflamatório não esteroidal (Meloxicam). Ideal para controle de dor aguda e crônica.',
    price: 89.90,
    image_url: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=400&h=300',
    category: 'Anti-inflamatórios',
    active: true
  },
  {
    name: 'Synulox 50mg',
    description: 'Antibiótico de amplo espectro (Amoxicilina + Ácido Clavulânico). Caixa com 10 comprimidos.',
    price: 65.00,
    image_url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=400&h=300',
    category: 'Antibióticos',
    active: true
  },
  {
    name: 'Cefavet 250mg',
    description: 'Antibiótico cefalosporínico para infecções de pele, respiratórias e urinárias em cães e gatos.',
    price: 55.40,
    image_url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=400&h=300',
    category: 'Antibióticos',
    active: true
  },
  {
    name: 'Gastroblock 10mg',
    description: 'Protetor gástrico (Omeprazol) indicado para tratamento de úlceras e gastrites.',
    price: 28.90,
    image_url: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&q=80&w=400&h=300',
    category: 'Gastrointestinais',
    active: true
  }
];

async function seed() {
  console.log('Checando produtos na base...');
  const { data, error } = await supabase.from('products').select('id').limit(1);
  
  if (error) {
    console.error('Erro ao acessar base. Você rodou o supabase_schema.sql?', error);
    return;
  }

  if (data && data.length > 0) {
    console.log('A tabela de produtos já possui dados.');
  } else {
    console.log('Tabela vazia. Inserindo mock products...');
    const { error: insertError } = await supabase.from('products').insert(MOCK_PRODUCTS);
    if (insertError) {
      console.error('Erro ao inserir produtos:', insertError);
    } else {
      console.log('Produtos inseridos com sucesso!');
    }
  }
}

seed();
