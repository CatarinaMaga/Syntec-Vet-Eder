# SyntecVet PWA

Novo projeto local do SyntecVet criado a partir do catalogo AGP/Syntec 2026.

## Como rodar localmente

Na pasta `SyntecVet`, rode um servidor estatico:

```powershell
python -m http.server 4173
```

Depois acesse:

```text
http://127.0.0.1:4173
```

## Acessos de demonstracao

Cliente:

```text
email: cliente@syntecvet.local
senha: cliente123
```

Representante/admin:

```text
email: representante@syntecvet.local
senha: admin123
```

## O que ja esta implementado

- Vitrine de produtos com imagens extraidas do PDF.
- Quantidade por produto e carrinho.
- Cadastro/login local para teste.
- Campo de senha com botao de mostrar/ocultar.
- Botao de login com Google preparado para Supabase.
- Perfil do cliente com consulta de CEP via ViaCEP.
- Pedido enviado ao WhatsApp do representante.
- Painel admin para atualizar preco, imagem, categoria, estoque e WhatsApp.
- Dashboard com produtos mais/menos vendidos, clientes e mensagens de atendimento.
- Chatbot com respostas por produto e alerta para atendimento humano.
- PWA com manifest e service worker.

## Configuracao para producao

Edite `config.js`:

```js
window.SYNTECVET_CONFIG = {
  salesRepWhatsapp: "",
  supabaseUrl: "https://SEU_PROJECT_REF.supabase.co",
  supabaseAnonKey: "SUA_CHAVE_PUBLICA_ANON",
};
```

No Supabase:

1. Rode `supabase/schema.sql` no SQL Editor.
2. Habilite Google em `Authentication > Providers > Google`.
3. Configure o redirect do Google Cloud:

```text
https://SEU_PROJECT_REF.supabase.co/auth/v1/callback
```

4. Configure o dominio do app em `Authentication > URL Configuration`.
5. Cadastre o representante e rode o `update` final do SQL para marcar como admin.

## Observacao sobre precos

O PDF nao contem precos. Por isso os produtos entram como `sob consulta`; o representante pode preencher os valores reais no painel admin.
