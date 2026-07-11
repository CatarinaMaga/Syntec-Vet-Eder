# Deploy do novo SyntecVet no projeto antigo da Vercel

## Objetivo

Publicar o novo codigo local deste diretorio no mesmo projeto da Vercel que ja possui o dominio antigo, por exemplo:

```txt
https://syntec-vet-eder-x47q.vercel.app
```

Assim, o dominio antigo passa a mostrar o novo SyntecVet.

## Antes de publicar

Confira `config.js`:

```js
window.SYNTECVET_CONFIG = {
  salesRepWhatsapp: "",
  supabaseUrl: "https://nhbftmmobtfdajpbxldo.supabase.co",
  supabaseAnonKey: "COLE_AQUI_A_CHAVE_PUBLICA_ANON_OU_PUBLISHABLE",
};
```

Nao use `service_role` nem `secret key` nesse arquivo.

## Opcao recomendada: GitHub + Vercel

1. Suba a pasta `SyntecVet` para o repositorio GitHub conectado ao projeto antigo da Vercel.
2. Na Vercel, abra o projeto antigo.
3. Va em `Settings > Git`.
4. Confirme se o repositorio conectado e o mesmo onde voce publicou o novo codigo.
5. Va em `Deployments`.
6. Clique em `Redeploy` ou faca um novo commit no GitHub.
7. Depois do deploy, abra o dominio antigo e confira se aparece o novo layout.

## Opcao por terminal com Vercel CLI

No PowerShell:

```powershell
cd "C:\Users\Djktita\OneDrive\Documentos\Cadastro Contatos\SyntecVet"
npm install -g vercel
vercel login
vercel link
vercel --prod
```

Durante `vercel link`, escolha:

- a conta correta;
- o projeto antigo da Vercel;
- o mesmo nome do projeto que possui o dominio atual.

## Depois do deploy

No Supabase, em `Authentication > URL Configuration`, use o dominio final:

```txt
Site URL:
https://SEU-DOMINIO-VERCEL.vercel.app

Redirect URLs:
https://SEU-DOMINIO-VERCEL.vercel.app/
https://SEU-DOMINIO-VERCEL.vercel.app/login
http://127.0.0.1:4173/
```

No Google Cloud, em `Authorized JavaScript origins`, use:

```txt
https://SEU-DOMINIO-VERCEL.vercel.app
```

No Google Cloud, em `Authorized redirect URIs`, use a URL do Supabase:

```txt
https://nhbftmmobtfdajpbxldo.supabase.co/auth/v1/callback
```
