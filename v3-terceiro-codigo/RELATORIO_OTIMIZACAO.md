# Relatório de otimização — v2 → v3

## Resultado

| Item | v2 | v3 |
|---|---|---|
| Dependências | 53 (+4 dev) | 3 (+8 dev) |
| Arquivos em `src/app/components/ui/` | 48 (nenhum usado) | 0 |
| CSS do build | 114 KB (18 KB gzip) | 47 KB (8,6 KB gzip) |
| JS do build | 290 KB (80 KB gzip) | 290 KB (80 KB gzip) |
| Checagem de tipos | não havia | `tsc` roda no build |

O JS não mudou porque o Vite já descartava o código não usado; o ganho está na instalação, no CSS e na clareza do projeto.

## Mudanças feitas

### Correções
- `react` e `react-dom` estavam só como `peerDependencies` opcionais; agora estão em `dependencies`.
- Adicionados `typescript`, `@types/*` e `tsconfig.json`.
- Bug corrigido em `App.tsx` (aba Progresso): o estilo usava `ringColor`, que não existe em CSS, então o contorno do nível atual não tinha cor. Agora usa `--tw-ring-color`.
- `.gitignore` da raiz passou a ignorar `dist/`.

### Removido
- 50 dependências não usadas: MUI + Emotion, 26 pacotes Radix UI, `recharts`, `react-router`, `motion`, `date-fns`, `react-hook-form`, `sonner`, `vaul`, `tw-animate-css` etc.
- `src/app/components/ui/` (48 componentes shadcn nunca importados).
- `default_shadcn_theme.css`, `src/styles/globals.css` (vazio), `src/styles/fonts.css`, `guidelines/`, `postcss.config.mjs`, `pnpm-workspace.yaml`.
- Variáveis `--chart-*` e `--sidebar-*` do `theme.css`.
- Import do ícone `Star` (não usado).
- Plugin `figmaAssetResolver` do `vite.config.ts` (apontava para pasta inexistente).

### Ajustado
- `index.html`: `lang="pt-BR"`, título e descrição em português, fonte Nunito via `<link>` com `preconnect` (antes era `@import` no CSS, que atrasa a renderização).
- `package.json`: nome, versão 0.3.0 e scripts `preview` e `typecheck`.

## Pendências (não feitas nesta versão)

1. **Dividir `App.tsx`** (2.096 linhas) em `types.ts`, `data/`, `utils/`, `components/`, `modals/`, `tabs/`, `coordinator/` e `bot/`.
2. **Cores fixas**: 34 estilos inline repetem cores que já existem no tema (`#0a6b38` 13×, `#c0392b` 9×, `#003087` 7×). Trocar por classes como `bg-primary`.
3. **`TeacherAvatar` e `Av`** fazem quase o mesmo; podem virar um componente.
4. **Animações sem `@keyframes`**: `slideUp`, `grow` (barra dos stories) e `slideInLeft` são usadas mas nunca definidas, então não animam.
5. **Modo escuro** (`.dark`) definido no tema, mas nada o ativa.
6. **Moderação** (`BLOCKED`) roda só no navegador; em produção deve rodar no servidor.
7. **Imagens** vêm do Unsplash por URL externo.
