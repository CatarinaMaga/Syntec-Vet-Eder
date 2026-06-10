import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

export const maxDuration = 30;

const SYSTEM_PROMPT = `Você é o **Assistente Syntec Vet**, um consultor veterinário virtual especializado nos produtos da **Syntec Nacional**. Você é amigável, profissional e objetivo.

## Suas Diretrizes:
1. **Responda APENAS sobre produtos veterinários da Syntec.** Se perguntarem sobre outros assuntos, redirecione educadamente para o catálogo Syntec.
2. **USE A FERRAMENTA 'search_products'** sempre que o usuário perguntar sobre um produto, categoria, preço, indicações ou quiser recomendações. Não invente produtos que não estejam no banco de dados.
3. **Seja preciso** nas informações de dosagem, indicações e contraindicações baseadas no que a ferramenta retornar na descrição.
4. **Sempre recomende consultar um médico veterinário** para casos clínicos específicos.
5. **Formate suas respostas** de forma clara, usando listas e destaque quando necessário. Apresente os preços no formato R$ 0,00.
6. Se o cliente pedir para **falar com um humano, negociar preço, ou tiver uma urgência**, responda: "Entendo! Vou te conectar com nosso representante. Clique no botão de telefone 📞 no canto superior para falar diretamente no WhatsApp."

## Número do Representante para Escalonamento:
WhatsApp: +55 (71) 99921-6734
`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-2.0-flash'),
    system: SYSTEM_PROMPT,
    messages,
    tools: {
      search_products: tool({
        description: 'Busca produtos no catálogo da Syntec por nome, termo na descrição ou categoria. Use esta ferramenta sempre que precisar de informações de catálogo.',
        parameters: z.object({
          query: z.string().optional().describe('Termo de busca (nome do produto ou indicação)'),
          category: z.string().optional().describe('Categoria específica (ex: ANESTÉSICOS, ANTIBIÓTICOS, etc)'),
        }),
        execute: async ({ query, category }) => {
          let req = supabase.from('products').select('name, description, price, category').eq('active', true);
          
          if (category) {
            req = req.ilike('category', `%${category}%`);
          }
          if (query) {
            // Busca simples no nome ou descrição usando 'or' com 'ilike'
            req = req.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
          }
          
          const { data, error } = await req.limit(10);
          
          if (error) {
            console.error('Erro na busca de produtos (Tool):', error);
            return { error: 'Falha ao buscar produtos no banco de dados.' };
          }
          
          if (!data || data.length === 0) {
            return { message: 'Nenhum produto encontrado com esses critérios.' };
          }
          
          return data;
        },
      }),
    },
  });

  return result.toTextStreamResponse();
}
