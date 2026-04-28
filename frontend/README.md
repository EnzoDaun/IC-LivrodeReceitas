Área dedicada ao desenvolvimento do frontend do projeto. Feito em React.js (jsx) com Vite.

## Configuração

1. Crie `frontend/.env.local` com base em `frontend/.env.example`.
2. Preencha `VITE_SUPABASE_PUBLISHABLE_KEY` com a chave publishable do projeto.
3. Rode `npm install`.
4. Rode `npm run dev`.

## Estrutura Supabase

- `src/lib/supabase/client.js`: cliente único do Supabase no browser.
- `src/contexts/AuthContext.jsx`: sessão, usuário e ações de auth.
- `src/services/supabase/*.js`: camada de acesso ao banco e storage.
- `src/components/auth/ProtectedRoute.jsx`: proteção das rotas privadas.
- `supabase/schema.sql`: schema, RLS, triggers e bucket usados pelo app.
