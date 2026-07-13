
# Deploy no GitHub Pages — geo-sense-mrv

Objetivo: publicar a aplicação Vite/React em `https://marloshb.github.io/geo-sense-mrv/` mantendo o funcionamento no preview do Lovable (que serve na raiz `/`).

## Estratégia geral

O repositório é `geo-sense-mrv`, então o site será servido em `/geo-sense-mrv/`. Precisamos que:

- Assets sejam resolvidos a partir de `/geo-sense-mrv/` no build de produção.
- O React Router use `basename` correspondente em produção.
- Deep links (ex.: `/dashboard`) não retornem 404 no GitHub Pages (que não tem SPA fallback nativo).
- Um workflow do GitHub Actions faça build e deploy automáticos a cada push na `main`.
- O preview do Lovable (que continua servindo em `/`) siga funcionando sem alterações visíveis.

## Mudanças de código

### 1. `vite.config.ts` — base path condicional

Adicionar `base` dinâmico: usa `/geo-sense-mrv/` quando `process.env.GITHUB_PAGES === 'true'` (definido pelo workflow), senão mantém `/` para preview do Lovable e dev local.

```text
base: process.env.GITHUB_PAGES === 'true' ? '/geo-sense-mrv/' : '/'
```

### 2. `src/App.tsx` — basename do BrowserRouter

Ler `import.meta.env.BASE_URL` (que o Vite injeta a partir do `base` acima) e passar como `basename` ao `<BrowserRouter>`. Isso mantém `/` no Lovable e `/geo-sense-mrv` no GitHub Pages, sem hardcode.

### 3. `public/404.html` — SPA fallback

Criar `public/404.html` com o script "spa-github-pages" (redireciona qualquer 404 preservando a rota para o `index.html` via query string) e adicionar um pequeno snippet correspondente no `<head>` de `index.html` para reconstruir a URL original antes do React montar. Solução padrão para SPAs no GitHub Pages.

### 4. `public/.nojekyll`

Arquivo vazio para impedir que o Jekyll do GitHub Pages ignore arquivos que começam com `_` (necessário para assets do Vite).

### 5. `.github/workflows/deploy.yml`

Workflow que:

- Dispara em `push` na `main` e permite execução manual.
- Instala Node 20 e roda `npm ci` + `npm run build` com `GITHUB_PAGES=true` e as variáveis públicas do Vite (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`) lidas de GitHub Secrets.
- Publica a pasta `dist/` usando as actions oficiais `actions/upload-pages-artifact` e `actions/deploy-pages`.
- Concede permissões `pages: write` e `id-token: write`.

## Considerações sobre backend

O app usa Lovable Cloud (Supabase gerenciado). No GitHub Pages roda só o frontend estático, mas ele continuará chamando o mesmo backend do Lovable Cloud via as variáveis `VITE_SUPABASE_*`. Edge functions, banco e auth permanecem no Lovable Cloud — nada muda no backend.

Auth OAuth (se usado): o domínio `marloshb.github.io` precisa estar na lista de Redirect URLs do provedor, mas isso é passo manual do usuário (ver abaixo).

## Ações manuais que você precisa fazer

1. **Ativar GitHub Pages no repositório**
   - Repo → Settings → Pages → Source: selecionar **GitHub Actions** (não "Deploy from a branch").

2. **Cadastrar os secrets do build** em Repo → Settings → Secrets and variables → Actions → New repository secret:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`
   
   Os valores atuais estão no `.env` do projeto. São chaves públicas (anon/publishable), seguras para ficarem no bundle, mas mesmo assim passamos via secrets para facilitar rotação.

3. **Rodar o workflow pela primeira vez**
   - Após o merge das mudanças na `main`, o workflow dispara automaticamente. Acompanhe em Repo → Actions.
   - Se preferir, dispare manualmente em Actions → "Deploy to GitHub Pages" → Run workflow.

4. **Confirmar URL final**
   - Ao terminar o deploy, o site fica em `https://marloshb.github.io/geo-sense-mrv/`.

5. **Se usar login social/OAuth** (Google etc.):
   - Adicionar `https://marloshb.github.io/geo-sense-mrv/` como Site URL/Redirect URL permitida na configuração de auth do backend, senão o login redireciona errado.

6. **CORS de APIs externas** (Mapbox já está tudo bem — token público): se alguma integração restringir origem, adicionar `https://marloshb.github.io` na allowlist.

7. **Opcional — custom domain**: se quiser um domínio próprio no GitHub Pages, criar arquivo `public/CNAME` com o domínio e configurar DNS. Nesse caso, o `base` do Vite volta a ser `/` (posso ajustar quando você tiver o domínio).

## Limitações que você precisa saber

- GitHub Pages serve só arquivos estáticos: qualquer edge function continua rodando no Lovable Cloud, o Pages não hospeda backend.
- Não há variáveis de ambiente em runtime no Pages — só no momento do build. Alterar uma `VITE_*` exige novo build/deploy.
- Deep links funcionam graças ao `404.html`, mas há um "flash" de milissegundos de redirect na primeira carga de uma URL profunda. Comportamento padrão de SPAs no Pages.

## Arquivos que serão criados/modificados

- Modificar: `vite.config.ts`, `src/App.tsx`, `index.html`
- Criar: `public/404.html`, `public/.nojekyll`, `.github/workflows/deploy.yml`
