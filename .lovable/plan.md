## Objetivo

Remover completamente a dependência do Lovable Cloud/Supabase e a autenticação real do app, mantendo apenas uma tela de login **decorativa** com email/senha pré-preenchidos. Isso simplifica o deploy no GitHub Pages (sem variáveis de ambiente, sem backend).

## O que muda

### 1. Rotas e proteção
- `src/App.tsx`: remover `ProtectedRoute` de todas as rotas. Todas passam a ser públicas.
- `src/components/ProtectedRoute.tsx`: excluir arquivo.

### 2. Tela de login (`src/pages/Auth.tsx`)
- Reescrever como tela puramente visual.
- Campos email e senha **pré-preenchidos** (`demo@geo-sense.app` / `demo123`) apenas para demonstração.
- Botão "Entrar" faz `navigate("/dashboard")` sem qualquer chamada de backend.
- Remover aba "Criar Conta" (ou deixar apenas visual, sem ação) — proponho remover para simplificar.
- Remover todos os `import` do Supabase.

### 3. Remover cliente Supabase e chamadas
- Excluir `src/integrations/supabase/` (client + types).
- Excluir `supabase/` (edge functions, config.toml, migrations).
- Substituir todas as chamadas `supabase.from(...)`, `supabase.auth.*`, `supabase.functions.invoke(...)` em componentes/pages por **dados mockados estáticos** locais (arrays em memória) para que as telas continuem renderizando.
  - Áreas afetadas (identificadas na árvore): componentes em `analytics/`, `audit/`, `dashboard/`, `governance/`, `integrations/`, `monitoring/`, `reports/`, `risks/`, além de `pages/Territories.tsx`, `Assets.tsx`, `Settings.tsx`, etc.
  - Estratégia: criar `src/lib/mock-data.ts` com um pequeno conjunto sintético (1 organização, 2 territórios, alguns assets, métricas e riscos) e adaptar hooks/queries para lerem daí.
  - Mutações (criar território, calcular emissão, etc.) passam a atualizar apenas o estado local com `toast` de sucesso — sem persistência.

### 4. Variáveis de ambiente
- Remover `.env` do repositório (ou zerar), remover secrets `VITE_SUPABASE_*` do workflow `.github/workflows/deploy.yml`.
- Remover `@supabase/supabase-js` do `package.json`.

### 5. Cabeçalho da aplicação
- `AppHeader`/`AppSidebar`: remover botão de logout e qualquer leitura de `supabase.auth.getUser()`, exibir nome fixo do usuário demo.

## Detalhes técnicos

- Como há **muitos componentes** consumindo Supabase, o plano é substituí-los por um módulo único `src/lib/mock-data.ts` exportando funções assíncronas equivalentes (`listTerritories()`, `listAssets()`, `calculateEmissions()`, etc.) que devolvem `Promise.resolve(...)`. Isso minimiza mudanças estruturais em cada componente — só troca `supabase.from('x').select()` por `listX()`.
- Mantém React Query, toasts, layouts, roteamento, Mapbox e todo o restante da UI intactos.
- Após remoção, o build fica 100% estático — ideal para GitHub Pages.

## Ações manuais necessárias

1. **No GitHub**: remover os secrets `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID` (não são mais usados).
2. **No Lovable**: opcionalmente desativar/ignorar o Lovable Cloud para este projeto (ele fica ocioso; o app deixa de chamá-lo).
3. Fazer novo sync/push para disparar o workflow do GitHub Pages.

## O que **não** faremos

- Não manteremos signup real, reset de senha nem qualquer chamada a backend.
- Não removeremos as tabelas do Cloud (elas ficam órfãs, o app apenas para de acessá-las).

## Confirmação

Confirma que:
- (a) posso apagar `src/integrations/supabase/` e `supabase/` inteiros;
- (b) email/senha demo `demo@geo-sense.app` / `demo123` servem;
- (c) prefere manter apenas a aba "Entrar" (sem "Criar Conta")?
