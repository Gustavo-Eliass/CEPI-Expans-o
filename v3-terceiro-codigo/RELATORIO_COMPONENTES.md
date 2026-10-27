# Relatório — divisão do `App.tsx` em componentes

O `App.tsx` original tinha **2.096 linhas** com tudo misturado: tipos, dados simulados, funções auxiliares e 37 componentes.
Ele foi dividido em **42 arquivos**. O `App.tsx` ficou com **12 linhas** e só decide qual tela mostrar.

## Como foi feito
- Cada componente foi movido **sem alterar nenhuma linha de lógica**; só ganhou `export` e os `import`s de que precisa.
- A comparação automática do código antigo com o novo deu **zero diferenças** (fora imports/exports).
- `tsc` (checagem de tipos) e `npm run build` passam sem erros, e o CSS gerado é idêntico ao de antes.
- Testado no navegador: login, feed do aluno e painel da coordenação abrem sem erros no console.

## O que ficou no `App.tsx`

```tsx
export default function App() {
  const [user, setUser] = useState<AppUser|null>(null);
  if (!user) return <LoginScreen onLogin={setUser} />;
  if (user.role==="coordinator") return <CoordinatorShell user={user} onLogout={() => setUser(null)} />;
  return <AppShell user={user} onLogout={() => setUser(null)} />;
}
```
Sem usuário logado → tela de login. Coordenador → painel de moderação. Demais perfis → app principal.

## Nova estrutura (`src/app/`)

### Telas principais
| Arquivo | Linhas | O que faz |
|---|---|---|
| `App.tsx` | 12 | Raiz: escolhe entre login, coordenação e app |
| `components/LoginScreen.tsx` | 121 | Escolha de perfil (aluno, professor, responsável, coordenador) e dados de entrada |
| `components/AppShell.tsx` | 193 | Estrutura do app de aluno/professor/responsável: menu, abas, estado dos posts/stories, EXP e modais |

### Abas — `components/tabs/`
| Arquivo | Linhas | O que faz |
|---|---|---|
| `FeedTab.tsx` | 61 | Stories e posts dos professores |
| `ShortsTab.tsx` | 51 | Vídeos curtos em rolagem vertical |
| `LibraryTab.tsx` | 72 | Materiais por matéria › bimestre › tópico |
| `AgendaTab.tsx` | 42 | Provas e eventos |
| `CommunityTab.tsx` | 77 | Chat da turma, com filtro de palavras e denúncia por mensagem |
| `AccountTab.tsx` | 57 | Perfil, notas e sair |
| `ProgressTab.tsx` | 125 | Nível, EXP, histórico e ranking da turma (alunos) |
| `ActivitiesTab.tsx` | 82 | Lista de atividades pendentes e concluídas |

### Feed — `components/feed/`
| Arquivo | Linhas | O que faz |
|---|---|---|
| `PostCard.tsx` | 36 | Cartão de um post (curtir, comentar, denunciar, compartilhar) |
| `StoryViewer.tsx` | 22 | Visualizador de stories em tela cheia |

### Janelas (modais) — `components/modals/`
| Arquivo | Linhas | O que faz |
|---|---|---|
| `CommentsModal.tsx` | 39 | Comentários de um post |
| `CreateModal.tsx` | 58 | Professor cria post, story ou material |
| `ReportModal.tsx` | 55 | Denúncia de post, story ou mensagem |
| `GradesModal.tsx` | 46 | Boletim de notas |
| `ActivityModal.tsx` | 123 | Responder uma atividade e ganhar EXP |

### Gamificação — `components/gamification/`
| Arquivo | Linhas | O que faz |
|---|---|---|
| `FlameIcon.tsx` | 43 | Ícone de chama que muda com o nível |
| `ExpBar.tsx` | 23 | Barra de progresso de EXP |
| `ExpToast.tsx` | 12 | Aviso "+X EXP" |
| `LevelUpModal.tsx` | 29 | Comemoração de subida de nível com confete |

### Coordenação — `components/coordinator/`
| Arquivo | Linhas | O que faz |
|---|---|---|
| `CoordinatorShell.tsx` | 75 | Estrutura do painel: menu e abas da coordenação |
| `CoordDashboard.tsx` | 48 | Visão geral com contadores e itens recentes |
| `CoordReportsQueue.tsx` | 49 | Fila de denúncias feitas por usuários |
| `CoordAIFlagged.tsx` | 42 | Conteúdos que a IA sinalizou para revisão |
| `CoordAIDecided.tsx` | 56 | Decisões tomadas pela IA (para auditoria) |
| `DecisionPanel.tsx` | 90 | Painel para aprovar/remover um conteúdo denunciado |

### Assistente — `components/bot/`
| Arquivo | Linhas | O que faz |
|---|---|---|
| `CePiBotPanel.tsx` | 142 | CePi Bot: chat com respostas rápidas e modo quiz |

### Componentes pequenos reutilizados — `components/common/`
| Arquivo | Linhas | O que faz |
|---|---|---|
| `TeacherAvatar.tsx` | 11 | Foto do professor |
| `Av.tsx` | 4 | Avatar com iniciais |
| `Tag.tsx` | 3 | Etiqueta colorida de matéria |
| `ConfidenceBadge.tsx` | 4 | Selo de confiança da IA |

### Tipos, dados e funções (sem tela)
| Arquivo | Linhas | Conteúdo |
|---|---|---|
| `types.ts` | 48 | Todos os tipos: `AppUser`, `Post`, `Story`, `Teacher`, `ReportItem`… |
| `data/feed.ts` | 51 | Professores, responsáveis, stories, posts e shorts simulados |
| `data/library.ts` | 34 | Conteúdo da biblioteca |
| `data/school.ts` | 59 | Notas, agenda, chat da turma, ranking e atividades |
| `data/bot.ts` | 24 | Respostas do bot e perguntas do quiz |
| `data/moderation.ts` | 23 | Motivos de denúncia e denúncias de exemplo |
| `utils/moderation.ts` | 3 | Lista de palavras bloqueadas e `checkWord` |
| `utils/gamification.ts` | 29 | Níveis de chama, cálculo de nível/porcentagem e confete |
| `utils/grades.ts` | 7 | Cor da nota (verde/amarelo/vermelho) |

**Regra para achar algo:** tela inteira → `components/`; aba → `tabs/`; janela → `modals/`; dado de exemplo → `data/`; cálculo → `utils/`; tipo → `types.ts`.
Quando houver back-end, só os arquivos de `data/` precisam ser trocados por chamadas à API.

## Problemas encontrados na análise (não corrigidos, para não mudar o comportamento)
1. **`AppShell.tsx` (193 linhas)** ainda concentra muito estado (posts, stories, EXP, 7 modais). Próximo passo: extrair um hook `useGamification` (EXP, toast, level-up) e outro para posts/stories.
2. **`ActivityModal.tsx`**: a variável `pct` é calculada e nunca usada.
3. **Animações sem `@keyframes`**: `slideUp` (`ExpToast`), `slideInLeft` (`ExpToast`) e `grow` (barra do `StoryViewer`) não estão definidas em nenhum CSS, então não animam.
4. **`TeacherAvatar` e `Av`** fazem quase o mesmo; podem virar um componente só.
5. **Cores fixas**: 34 estilos inline repetem cores do tema (`#0a6b38`, `#c0392b`, `#003087`); trocar por classes como `bg-primary`.
6. **Dados de EXP iniciais** (`expHistory`, EXP 87) estão dentro do `AppShell`; poderiam ir para `data/school.ts`.
