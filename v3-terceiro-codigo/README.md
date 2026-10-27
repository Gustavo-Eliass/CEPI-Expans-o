# CePI — Rede Social Escolar (v3)

Versão otimizada do protótipo da rede social escolar do Colégio CePI Expansão. Reúne alunos, professores, responsáveis e coordenação em um só lugar.

> ⚠️ **Protótipo de front-end.** Os dados (usuários, posts, notas, agenda, moderação) são simulados em memória e se perdem ao recarregar a página. Não há back-end nem autenticação real.

## Funcionalidades

| Perfil | O que vê |
|---|---|
| **Aluno** | Feed, Shorts, Biblioteca, Comunidade, Atividades, Progresso (EXP/níveis), Agenda, Conta |
| **Professor** | Feed com criação de posts/stories/materiais, Biblioteca, Comunidade, Conta |
| **Responsável** | Acompanhamento do aluno: feed (somente leitura), agenda e notas |
| **Coordenação** | Moderação: dashboard, fila de denúncias, conteúdos sinalizados e decididos pela IA |

Outros módulos: stories, shorts em rolagem vertical, biblioteca por matéria › bimestre › tópico, gamificação com EXP e ranking da turma, **CePi Bot** (respostas rápidas e quiz) e filtro de palavras ofensivas.

## Tecnologias

- React 18 + TypeScript
- Vite 6
- Tailwind CSS 4
- lucide-react (ícones)

## Como rodar

Pré-requisito: **Node.js 20+**.

```bash
cd v3-terceiro-codigo
npm install
npm run dev
```

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com hot reload |
| `npm run build` | Checa os tipos e gera o build em `dist/` |
| `npm run preview` | Serve o build de produção localmente |
| `npm run typecheck` | Só checa os tipos (TypeScript) |

## Estrutura

```
v3-terceiro-codigo/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── main.tsx                 # Entrada do React
    ├── imports/image.png        # Logo do CePI
    ├── styles/                  # index.css, tailwind.css, theme.css
    └── app/
        ├── App.tsx              # Raiz: login → coordenação ou app
        ├── types.ts             # Tipos compartilhados
        ├── data/                # Dados simulados (trocar pela API no futuro)
        ├── utils/               # Moderação, gamificação, notas
        └── components/
            ├── LoginScreen.tsx
            ├── AppShell.tsx     # App de aluno/professor/responsável
            ├── tabs/            # Feed, Shorts, Biblioteca, Agenda, Comunidade, Conta, Progresso, Atividades
            ├── feed/            # PostCard, StoryViewer
            ├── modals/          # Comentários, Criar, Denúncia, Notas, Atividade
            ├── gamification/    # FlameIcon, ExpBar, ExpToast, LevelUpModal
            ├── coordinator/     # Painel de moderação
            ├── bot/             # CePiBotPanel
            ├── common/          # Avatares e etiquetas
            └── figma/           # ImageWithFallback
```

Detalhes de cada arquivo em [RELATORIO_COMPONENTES.md](RELATORIO_COMPONENTES.md).

## Tema

| Token | Cor | Uso |
|---|---|---|
| `--primary` | `#0a6b38` | Verde institucional |
| `--accent` | `#003087` | Azul de destaque |
| `--destructive` | `#c0392b` | Erros e denúncias |
| `--background` | `#f4faf6` | Fundo |

## O que mudou em relação à v2

Veja [RELATORIO_OTIMIZACAO.md](RELATORIO_OTIMIZACAO.md).

## Próximos passos

- [x] Dividir `App.tsx` em componentes
- [ ] Extrair a lógica de EXP e posts do `AppShell` para hooks
- [ ] Back-end com autenticação e persistência
- [ ] Moderação de conteúdo no servidor
- [ ] Upload real de mídias

## Créditos

Projeto original no [Figma](https://www.figma.com/design/w6tsodW3HjrB2ReOA5bTtp/Rede-social-escolar). Veja [ATTRIBUTIONS.md](ATTRIBUTIONS.md).
