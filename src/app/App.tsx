import { useState, useRef, useCallback } from "react";
import {
  Home, Play, BookOpen, Users, User,
  Heart, MessageCircle, Plus, X, Send,
  Bell, ChevronRight, Video, FileText,
  Camera, AlertTriangle, GraduationCap,
  Eye, Settings, LogOut, Upload, Bot,
  ArrowLeft, Bookmark, Lock, Check,
  ChevronDown, ChevronUp, Volume2, VolumeX,
  Search, MoreHorizontal, Sparkles, Flag,
  CalendarDays, Shield, Award, Baby,
} from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import cepiLogo from "@/imports/image.png";

// ══════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════
type Role = "student" | "teacher" | "guardian";
type Tab = "feed" | "shorts" | "library" | "community" | "account" | "agenda";
type CreateType = "post" | "story" | "library";

interface AppUser { name: string; role: Role; grade: string; turma: string; guardianOf?: string; }
interface Teacher { id: number; name: string; subj: string; ini: string; col: string; photo: string; }
interface Story { id: number; t: Teacher; viewed: boolean; img: string; caption: string; }
interface Comment { id: number; user: string; text: string; age: string; }
interface Post { id: number; t: Teacher; age: string; subj: string; body: string; img: string | null; likes: number; liked: boolean; comments: Comment[]; }

// ══════════════════════════════════════════════════
// CONSTANTS
// ══════════════════════════════════════════════════
const BLOCKED = ["idiota","burro","estúpido","imbecil","merda","bosta","cretino","babaca","otário","lixo","inútil"];
const checkWord = (t: string) => BLOCKED.find(w => t.toLowerCase().includes(w)) ?? null;
const unsplash = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format`;

// ══════════════════════════════════════════════════
// DATA
// ══════════════════════════════════════════════════
const TEACHERS: Teacher[] = [
  { id:1, name:"Carlos Silva",   subj:"Matemática", ini:"CS", col:"#0a6b38", photo:"1601655781320-205e34c94eb1" },
  { id:2, name:"Ana Lima",       subj:"Português",  ini:"AL", col:"#003087", photo:"1590650213165-c1fef80648c4" },
  { id:3, name:"Marcos Reis",    subj:"Ciências",   ini:"MR", col:"#3a9d5c", photo:"1574281570877-bd815ebb50a4" },
  { id:4, name:"Julia Santos",   subj:"História",   ini:"JS", col:"#c0392b", photo:"1573496799652-408c2ac9fe98" },
  { id:5, name:"Fernanda Costa", subj:"Geografia",  ini:"FC", col:"#1a5276", photo:"1590649880765-91b1956b8276" },
];

const GUARDIANS = [
  { name:"Ana",   children:[{ name:"Arthur", grade:"5º Ano", turma:"B" },{ name:"João", grade:"4º Ano", turma:"A" }] },
  { name:"Pedro", children:[{ name:"Maria",  grade:"6º Ano", turma:"C" }] },
  { name:"Igor",  children:[{ name:"Renato", grade:"7º Ano", turma:"A" },{ name:"Kalebe", grade:"5º Ano", turma:"B" },{ name:"Yana", grade:"3º Ano", turma:"D" }] },
];

const INIT_STORIES: Story[] = [
  { id:1, t:TEACHERS[0], viewed:false, img:"1635372722656-389f87a941b7", caption:"Resolução de equações no quadro hoje! 📐 Guardem esse método." },
  { id:2, t:TEACHERS[1], viewed:false, img:"1676302447092-14a103558511",  caption:"Exercício de redação — tema: tecnologia na escola ✏️" },
  { id:3, t:TEACHERS[2], viewed:true,  img:"1466611653911-95081537e5b7",  caption:"Resultado incrível do experimento com plantas! 🌱" },
  { id:4, t:TEACHERS[3], viewed:false, img:"1461360370896-922624d12aa1",  caption:"Visitamos o museu virtual da Revolução Industrial hoje 🏭" },
  { id:5, t:TEACHERS[4], viewed:false, img:"1655157639280-a8e4594d98ac",  caption:"Mapa dos biomas que desenhamos juntos na aula 🌍" },
];

const INIT_POSTS: Post[] = [
  { id:1, t:TEACHERS[0], age:"há 2h", subj:"Matemática",
    body:"Exercícios de frações para o 5º Ano B! Para somar frações com denominadores diferentes, precisamos encontrar o MMC. Revisão amanhã — tragam as dúvidas! 📚",
    img:"1635372722656-389f87a941b7", likes:24, liked:false,
    comments:[{ id:1, user:"Ana Clara", text:"Entendi, prof! Muito obrigada! 😊", age:"1h" },{ id:2, user:"Pedro H.", text:"Posso tirar dúvida amanhã antes da aula?", age:"45min" }] },
  { id:2, t:TEACHERS[1], age:"há 4h", subj:"Português",
    body:"📖 Redação desta semana: 'O impacto das redes sociais na educação'. Mínimo 20 linhas. Entrega: sexta-feira! Qualquer dúvida me chamem.",
    img:"1514369118554-e20d93546b30", likes:18, liked:true,
    comments:[{ id:1, user:"Maria F.", text:"Já comecei! Que tema atual e interessante 📝", age:"3h" }] },
  { id:3, t:TEACHERS[2], age:"há 1 dia", subj:"Ciências",
    body:"🔬 Experimento da semana: observe uma planta por 3 dias, anote as mudanças e tire fotos a cada dia! Traga o registro na próxima aula.",
    img:"1416879595882-3373a0480b5b", likes:31, liked:false, comments:[] },
  { id:4, t:TEACHERS[3], age:"há 2 dias", subj:"História",
    body:"🏛️ Iniciamos hoje o módulo sobre a Revolução Industrial. Assistam o documentário indicado no link da biblioteca antes da próxima aula!",
    img:"1510531704581-5b2870972060", likes:15, liked:false, comments:[] },
];

const SHORTS_DATA = [
  { id:1, t:TEACHERS[0], title:"Como calcular o MMC rapidinho! Método fácil para o 5º ano", views:"1.2k", likes:89, dur:"1:30", img:"1636466497217-26a8cbeaf0aa" },
  { id:2, t:TEACHERS[2], title:"Fotossíntese explicada em menos de 1 minuto! 🌱", views:"980", likes:67, dur:"0:58", img:"1466611653911-95081537e5b7" },
  { id:3, t:TEACHERS[1], title:"Dica rápida: uso correto da vírgula em 3 regras", views:"756", likes:54, dur:"1:12", img:"1676302447092-14a103558511" },
  { id:4, t:TEACHERS[3], title:"Linha do tempo da Revolução Industrial — resumo visual", views:"612", likes:48, dur:"2:05", img:"1461360370896-922624d12aa1" },
  { id:5, t:TEACHERS[4], title:"Os 6 biomas do Brasil em 90 segundos! 🌍", views:"891", likes:73, dur:"1:28", img:"1655157639280-a8e4594d98ac" },
];

type LibrarySubject = { col: string; bg: string; icon: string; bimesters: { name: string; topics: { name: string; files: { n: string; type: "pdf"|"video" }[] }[] }[] };
const LIBRARY: Record<string, LibrarySubject> = {
  "Matemática": { col:"#0a6b38", bg:"#e6f4ec", icon:"📐", bimesters:[
    { name:"1º Bimestre", topics:[
      { name:"Números naturais e sistema decimal", files:[{n:"Apostila Cap.1.pdf",type:"pdf"},{n:"Videoaula: Numerais",type:"video"},{n:"Exercícios resolvidos.pdf",type:"pdf"}] },
      { name:"Adição e subtração com reserva",    files:[{n:"Explicação passo a passo.pdf",type:"pdf"},{n:"Videoaula: Conta armada",type:"video"}] },
      { name:"Multiplicação e propriedades",       files:[{n:"Tabela de multiplicação.pdf",type:"pdf"},{n:"Videoaula: Truques",type:"video"}] },
    ]},
    { name:"2º Bimestre", topics:[
      { name:"Frações equivalentes",   files:[{n:"Frações - Parte 1.pdf",type:"pdf"},{n:"Videoaula: Frações",type:"video"},{n:"Exercícios.pdf",type:"pdf"}] },
      { name:"MMC e MDC",              files:[{n:"Método da decomposição.pdf",type:"pdf"},{n:"Videoaula: MMC fácil",type:"video"}] },
      { name:"Decimais e porcentagem", files:[{n:"Porcentagem no dia a dia.pdf",type:"pdf"},{n:"Videoaula: Decimais",type:"video"},{n:"Gabarito.pdf",type:"pdf"}] },
    ]},
    { name:"3º Bimestre", topics:[
      { name:"Geometria plana: figuras", files:[{n:"Figuras geométricas.pdf",type:"pdf"},{n:"Videoaula: Polígonos",type:"video"}] },
      { name:"Perímetro e área",         files:[{n:"Fórmulas de área.pdf",type:"pdf"},{n:"Videoaula: Perímetro",type:"video"},{n:"Lista de exercícios.pdf",type:"pdf"}] },
      { name:"Ângulos e triângulos",     files:[{n:"Classificação de ângulos.pdf",type:"pdf"},{n:"Videoaula: Triângulos",type:"video"}] },
    ]},
    { name:"4º Bimestre", topics:[
      { name:"Estatística básica",  files:[{n:"Tabelas e gráficos.pdf",type:"pdf"},{n:"Videoaula: Média",type:"video"}] },
      { name:"Probabilidade",       files:[{n:"Introdução à probabilidade.pdf",type:"pdf"},{n:"Videoaula: Chances",type:"video"}] },
      { name:"Revisão geral",       files:[{n:"Caderno de revisão.pdf",type:"pdf"},{n:"Simulado 4º bimestre.pdf",type:"pdf"},{n:"Gabarito simulado.pdf",type:"pdf"}] },
    ]},
  ]},
  "Português":  { col:"#003087", bg:"#e8eef8", icon:"📝", bimesters:[
    { name:"1º Bimestre", topics:[{ name:"Ortografia e acentuação", files:[{n:"Regras ortográficas.pdf",type:"pdf"},{n:"Videoaula: Acentuação",type:"video"}] },{ name:"Pontuação e vírgula", files:[{n:"Guia de pontuação.pdf",type:"pdf"},{n:"Videoaula: Vírgula",type:"video"}] }]},
    { name:"2º Bimestre", topics:[{ name:"Substantivos e artigos",  files:[{n:"Classes de palavras.pdf",type:"pdf"},{n:"Videoaula: Substantivos",type:"video"}] },{ name:"Adjetivos e pronomes", files:[{n:"Adjetivos.pdf",type:"pdf"},{n:"Videoaula: Pronomes",type:"video"}] }]},
    { name:"3º Bimestre", topics:[{ name:"Verbos e conjugações",    files:[{n:"Tabela de verbos.pdf",type:"pdf"},{n:"Videoaula: Conjugação",type:"video"}] },{ name:"Concordância verbal", files:[{n:"Regras de concordância.pdf",type:"pdf"},{n:"Exercícios.pdf",type:"pdf"}] }]},
    { name:"4º Bimestre", topics:[{ name:"Redação dissertativa",    files:[{n:"Guia de redação.pdf",type:"pdf"},{n:"Videoaula: Como escrever",type:"video"},{n:"Redações modelo.pdf",type:"pdf"}] },{ name:"Interpretação de texto", files:[{n:"Estratégias de leitura.pdf",type:"pdf"},{n:"Videoaula: Interpretação",type:"video"}] }]},
  ]},
  "Ciências":   { col:"#3a9d5c", bg:"#edf7f1", icon:"🔬", bimesters:[
    { name:"1º Bimestre", topics:[{ name:"Seres vivos e classificação", files:[{n:"Reinos dos seres vivos.pdf",type:"pdf"},{n:"Videoaula: Taxonomia",type:"video"}] },{ name:"A célula", files:[{n:"Estrutura celular.pdf",type:"pdf"},{n:"Videoaula: Célula",type:"video"}] }]},
    { name:"2º Bimestre", topics:[{ name:"Fotossíntese e respiração",   files:[{n:"Fotossíntese - Slides.pdf",type:"pdf"},{n:"Videoaula: Fotossíntese",type:"video"},{n:"Caderno de experimentos.pdf",type:"pdf"}] }]},
    { name:"3º Bimestre", topics:[{ name:"Sistema solar",               files:[{n:"Planetas do sistema solar.pdf",type:"pdf"},{n:"Videoaula: Astronomia",type:"video"}] },{ name:"Clima e tempo", files:[{n:"Fenômenos climáticos.pdf",type:"pdf"},{n:"Videoaula: Estações",type:"video"}] }]},
    { name:"4º Bimestre", topics:[{ name:"Física básica",               files:[{n:"Força e movimento.pdf",type:"pdf"},{n:"Videoaula: Física iniciantes",type:"video"}] },{ name:"Química básica", files:[{n:"Elementos e misturas.pdf",type:"pdf"},{n:"Videoaula: Átomos",type:"video"}] }]},
  ]},
  "História":   { col:"#c0392b", bg:"#faeae9", icon:"🏛️", bimesters:[
    { name:"1º Bimestre", topics:[{ name:"Pré-história e civilizações antigas", files:[{n:"Pré-história.pdf",type:"pdf"},{n:"Videoaula: Egito antigo",type:"video"}] }]},
    { name:"2º Bimestre", topics:[{ name:"Grécia e Roma antigas",               files:[{n:"Grécia antiga.pdf",type:"pdf"},{n:"Videoaula: Democracia",type:"video"}] },{ name:"Idade Média", files:[{n:"Feudalismo.pdf",type:"pdf"},{n:"Videoaula: Castelos",type:"video"}] }]},
    { name:"3º Bimestre", topics:[{ name:"Grandes navegações e Brasil colônia",  files:[{n:"Os descobrimentos.pdf",type:"pdf"},{n:"Videoaula: Brasil 1500",type:"video"},{n:"Linha do tempo.pdf",type:"pdf"}] }]},
    { name:"4º Bimestre", topics:[{ name:"Revolução Industrial",                 files:[{n:"Revolução Industrial.pdf",type:"pdf"},{n:"Documentário (link).pdf",type:"pdf"},{n:"Videoaula: Impactos",type:"video"}] },{ name:"Brasil imperial e República", files:[{n:"Período imperial.pdf",type:"pdf"},{n:"Videoaula: Dom Pedro",type:"video"}] }]},
  ]},
  "Geografia":  { col:"#1a5276", bg:"#e8f0f6", icon:"🌍", bimesters:[
    { name:"1º Bimestre", topics:[{ name:"Orientação e mapas", files:[{n:"Rosa dos ventos.pdf",type:"pdf"},{n:"Videoaula: Cartografia",type:"video"}] },{ name:"Brasil físico", files:[{n:"Relevo brasileiro.pdf",type:"pdf"},{n:"Videoaula: Brasil físico",type:"video"}] }]},
    { name:"2º Bimestre", topics:[{ name:"Biomas brasileiros", files:[{n:"Os 6 biomas.pdf",type:"pdf"},{n:"Videoaula: Amazônia",type:"video"},{n:"Mapa dos biomas.pdf",type:"pdf"}] },{ name:"Clima e hidrografia", files:[{n:"Tipos de clima.pdf",type:"pdf"},{n:"Videoaula: Rios",type:"video"}] }]},
    { name:"3º Bimestre", topics:[{ name:"Regiões brasileiras", files:[{n:"As 5 regiões.pdf",type:"pdf"},{n:"Videoaula: Norte e Nordeste",type:"video"}] }]},
    { name:"4º Bimestre", topics:[{ name:"Globalização e meio ambiente", files:[{n:"Globalização.pdf",type:"pdf"},{n:"Videoaula: Sustentabilidade",type:"video"}] }]},
  ]},
};

const GRADES_DATA = [
  { subj:"Matemática", col:"#0a6b38", b1:8.5, b2:7.8, b3:null, b4:null },
  { subj:"Português",  col:"#003087", b1:9.0, b2:8.5, b3:null, b4:null },
  { subj:"Ciências",   col:"#3a9d5c", b1:7.5, b2:8.0, b3:null, b4:null },
  { subj:"História",   col:"#c0392b", b1:8.0, b2:7.5, b3:null, b4:null },
  { subj:"Geografia",  col:"#1a5276", b1:9.5, b2:9.0, b3:null, b4:null },
  { subj:"Artes",      col:"#7d5a00", b1:10,  b2:9.5, b3:null, b4:null },
  { subj:"Ed. Física", col:"#0891b2", b1:9.0, b2:10,  b3:null, b4:null },
  { subj:"Inglês",     col:"#65a30d", b1:7.0, b2:7.5, b3:null, b4:null },
];

const AGENDA_DATA = {
  days: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"],
  schedule: [
    { time:"07:30–08:20", classes:["Matemática","Português","Ciências","Matemática","Ed. Física"] },
    { time:"08:20–09:10", classes:["Português","Ciências","Matemática","História","Artes"] },
    { time:"09:10–09:30", classes:["Intervalo","Intervalo","Intervalo","Intervalo","Intervalo"] },
    { time:"09:30–10:20", classes:["Ciências","História","Português","Geografia","Matemática"] },
    { time:"10:20–11:10", classes:["História","Geografia","Inglês","Português","Ciências"] },
    { time:"11:10–12:00", classes:["Geografia","Inglês","Ed. Física","Inglês","História"] },
  ],
  events: [
    { date:"20/09", name:"Prova de Matemática", col:"#0a6b38", type:"Prova" },
    { date:"23/09", name:"Entrega de Redação",  col:"#003087", type:"Entrega" },
    { date:"27/09", name:"Experimento — Ciências", col:"#3a9d5c", type:"Atividade" },
    { date:"30/09", name:"Simulado Geral",       col:"#c0392b", type:"Simulado" },
    { date:"05/10", name:"Início do 3º Bimestre",col:"#1a5276", type:"Marco" },
  ],
};

const CHAT_INIT = [
  { id:1, user:"Ana Clara", me:false, text:"Alguém fez o dever de matemática?",            h:"10:23", ini:"AC", col:"#003087" },
  { id:2, user:"Pedro H.",  me:false, text:"Sim! Mas a questão 5 tá complicada 😅",         h:"10:25", ini:"PH", col:"#3a9d5c" },
  { id:3, user:"Você",      me:true,  text:"Que parte vocês acharam mais difícil?",          h:"10:26", ini:"VC", col:"#0a6b38" },
  { id:4, user:"Maria F.",  me:false, text:"A de frações com denominadores diferentes! 😩", h:"10:28", ini:"MF", col:"#c0392b" },
  { id:5, user:"João V.",   me:false, text:"O prof Carlos mandou vídeo no Shorts! 🎬",      h:"10:30", ini:"JV", col:"#1a5276" },
  { id:6, user:"Larissa",   me:false, text:"Já vi! Recomendo muito 👏",                      h:"10:31", ini:"LP", col:"#7d5a00" },
];

const BOT_QUICK = ["Explica MMC e MDC","O que é fotossíntese?","Dicas para redação","Resumo da Revolução Industrial","Onde acho materiais de Ciências?"];
const BOT_ANSWERS: Record<string, string> = {
  "Explica MMC e MDC": "📐 MMC é o menor número divisível por dois ou mais números.\nEx: MMC(4,6) = 12\n\nMDC é o maior divisor comum.\nEx: MDC(12,8) = 4\n\nAcesse Biblioteca > Matemática > 2º Bimestre!",
  "O que é fotossíntese?": "🌱 Fotossíntese é o processo pelo qual plantas produzem alimento:\n• Luz solar + Água + CO₂ → glicose + O₂\n\nVeja a videoaula em Biblioteca > Ciências > 2º Bimestre!",
  "Dicas para redação": "✏️ 5 dicas para redação:\n1. Leia o tema com atenção\n2. Faça um rascunho\n3. Introdução, desenvolvimento e conclusão\n4. Use conectivos (porém, contudo, além disso)\n5. Revise a ortografia!\n\nMateriais: Biblioteca > Português > 4º Bimestre",
  "Resumo da Revolução Industrial": "🏭 Revolução Industrial (séc. XVIII, Inglaterra):\n• Máquinas substituem o trabalho manual\n• Surgimento das fábricas\n• Carvão como energia principal\n• Crescimento das cidades\n\nVeja em Biblioteca > História > 4º Bimestre!",
  "Onde acho materiais de Ciências?": "🔬 Materiais de Ciências:\n📁 1º Bim: Seres vivos, Célula\n📁 2º Bim: Fotossíntese, Nutrição\n📁 3º Bim: Sistema solar, Clima\n📁 4º Bim: Física e Química\n\nClique em Biblioteca no menu!",
};

const REPORT_REASONS = ["Publicação acidental","Conteúdo inadequado para alunos","Informação incorreta","Conteúdo ofensivo","Outro motivo"];

// ══════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════
function TeacherAvatar({ t, size="md" }: { t: Teacher; size?: "sm"|"md"|"lg" }) {
  const sz = { sm:"w-8 h-8", md:"w-10 h-10", lg:"w-14 h-14" }[size];
  return (
    <div className={`${sz} rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-sm`}>
      <img src={unsplash(t.photo, 120, 120)} alt={t.name} className="w-full h-full object-cover" />
    </div>
  );
}
function Tag({ name, col }: { name: string; col: string }) {
  return <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor:col+"22", color:col }}>{name}</span>;
}
function Av({ ini, col, size="md" }: { ini: string; col: string; size?: "sm"|"md"|"lg" }) {
  const sz = { sm:"w-8 h-8 text-xs", md:"w-10 h-10 text-sm", lg:"w-12 h-12 text-base" }[size];
  return <div className={`${sz} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`} style={{ backgroundColor:col }}>{ini}</div>;
}
function gradeColor(g: number | null) {
  if (g === null) return "text-muted-foreground";
  if (g >= 9) return "text-green-700 font-black";
  if (g >= 7) return "text-primary font-bold";
  if (g >= 5) return "text-yellow-700 font-bold";
  return "text-red-600 font-bold";
}

// ══════════════════════════════════════════════════
// REPORT MODAL
// ══════════════════════════════════════════════════
function ReportModal({ contentType, onClose }: { contentType: "post"|"story"; onClose: ()=>void }) {
  const [reason, setReason] = useState("");
  const [detail, setDetail] = useState("");
  const [sent, setSent] = useState(false);

  if (sent) return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-10 flex flex-col items-center gap-4 shadow-2xl max-w-sm w-full">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
          <Shield className="w-8 h-8 text-orange-600" />
        </div>
        <p className="font-black text-foreground text-lg text-center">Denúncia enviada!</p>
        <p className="text-sm text-muted-foreground text-center">A coordenação foi notificada e irá analisar o conteúdo em breve.</p>
        <button onClick={onClose} className="w-full bg-primary text-white rounded-xl py-3 font-bold text-sm">Fechar</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center">
              <Flag className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-black text-foreground text-base">Denunciar conteúdo</h3>
              <p className="text-xs text-muted-foreground">Este {contentType === "post" ? "post" : "story"} será analisado pela coordenação</p>
            </div>
          </div>
          <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm font-bold text-foreground mb-2">Qual é o motivo da denúncia?</p>
            <div className="space-y-2">
              {REPORT_REASONS.map(r => (
                <button key={r} onClick={() => setReason(r)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm transition-colors ${reason===r ? "border-orange-400 bg-orange-50 text-orange-700 font-semibold" : "border-border hover:bg-muted/40"}`}>
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${reason===r ? "border-orange-500 bg-orange-500" : "border-border"}`}>
                    {reason===r && <Check className="w-3 h-3 text-white m-auto" />}
                  </div>
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-foreground mb-1">Detalhes (opcional)</p>
            <textarea className="w-full rounded-xl border border-border bg-input-background px-4 py-3 text-sm outline-none resize-none focus:ring-2 focus:ring-orange-400/40"
              rows={3} placeholder="Descreva o problema com mais detalhes..." value={detail} onChange={e => setDetail(e.target.value)} />
          </div>
          <button onClick={() => reason && setSent(true)} disabled={!reason}
            className="w-full bg-orange-500 text-white rounded-xl py-3 font-bold text-sm disabled:opacity-40 hover:bg-orange-600 transition-colors">
            Enviar denúncia à coordenação →
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// GRADES MODAL
// ══════════════════════════════════════════════════
function GradesModal({ user, onClose }: { user: AppUser; onClose: ()=>void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-black text-foreground">Boletim Escolar</h3>
              <p className="text-xs text-muted-foreground">{user.role==="guardian" ? user.guardianOf : user.name} · {user.grade} {user.turma} · 2025</p>
            </div>
          </div>
          <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 pr-4 font-black text-foreground">Matéria</th>
                  {["1º Bim","2º Bim","3º Bim","4º Bim","Média"].map(h => (
                    <th key={h} className="text-center py-3 px-3 font-black text-foreground min-w-[70px]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {GRADES_DATA.map(g => {
                  const filled = [g.b1, g.b2, g.b3, g.b4].filter(v => v !== null) as number[];
                  const media = filled.length ? (filled.reduce((a,b)=>a+b,0)/filled.length).toFixed(1) : null;
                  return (
                    <tr key={g.subj} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor:g.col }} />
                          <span className="font-semibold">{g.subj}</span>
                        </div>
                      </td>
                      {[g.b1, g.b2, g.b3, g.b4].map((v, i) => (
                        <td key={i} className={`text-center py-3 px-3 ${gradeColor(v)}`}>
                          {v !== null ? v.toFixed(1) : <span className="text-muted-foreground text-xs">—</span>}
                        </td>
                      ))}
                      <td className={`text-center py-3 px-3 ${gradeColor(media ? parseFloat(media) : null)}`}>
                        {media ?? <span className="text-muted-foreground text-xs">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="text-green-700 font-black">●</span> Excelente (≥9)</span>
            <span className="flex items-center gap-1"><span className="text-primary font-bold">●</span> Aprovado (≥7)</span>
            <span className="flex items-center gap-1"><span className="text-yellow-700 font-bold">●</span> Recuperação (5–6.9)</span>
            <span className="flex items-center gap-1"><span className="text-red-600 font-bold">●</span> Reprovado (&lt;5)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// LOGIN SCREEN
// ══════════════════════════════════════════════════
function LoginScreen({ onLogin }: { onLogin: (u: AppUser) => void }) {
  const [role, setRole] = useState<Role|null>(null);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("5º Ano");
  const [turma, setTurma] = useState("B");
  const [guardian, setGuardian] = useState("");
  const [child, setChild] = useState<{ name:string; grade:string; turma:string }|null>(null);

  const guardianData = GUARDIANS.find(g => g.name === guardian);

  const handleLogin = () => {
    if (role === "guardian") {
      if (!guardian || !child) return;
      onLogin({ name: guardian, role:"guardian", grade: child.grade, turma: child.turma, guardianOf: child.name });
    } else {
      if (!name.trim()) return;
      onLogin({ name:name.trim(), role:role!, grade, turma });
    }
  };

  const roles: { r: Role; label: string; Icon: React.ElementType; desc: string; badge?: string }[] = [
    { r:"student",  label:"Sou Aluno",       Icon:User,          desc:"Acesse conteúdos da sua turma" },
    { r:"teacher",  label:"Sou Professor",   Icon:GraduationCap, desc:"Publique e gerencie turmas" },
    { r:"guardian", label:"Sou Responsável", Icon:Baby,          desc:"Acompanhe seu filho(a)" },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#032815] via-[#054022] to-[#0a6b38]">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 gap-8">
        <div className="w-48 h-48 bg-white rounded-3xl flex items-center justify-center shadow-2xl p-4">
          <ImageWithFallback src={cepiLogo} alt="Colégio CEPI Expansão" className="w-full h-full object-contain" />
        </div>
        <div className="text-center max-w-xs">
          <h1 className="text-4xl font-black text-white mb-3">EduLink</h1>
          <p className="text-green-200 text-lg leading-relaxed">A rede social educacional do Colégio CEPI Expansão. Conectando alunos, professores e famílias.</p>
        </div>
        <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
          {[["📚","Conteúdos","Materiais de todas as matérias"],["🎬","Shorts","Videoaulas rápidas"],["👨‍👩‍👧","Família","Acompanhe seu filho(a)"]].map(([icon,t,d]) => (
            <div key={t} className="bg-white/10 rounded-2xl p-3 text-center">
              <div className="text-2xl mb-1">{icon}</div>
              <p className="text-white font-bold text-xs">{t}</p>
              <p className="text-green-300 text-xs mt-0.5 leading-tight">{d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right login panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:bg-white/5 lg:backdrop-blur-sm">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex lg:hidden items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-border">
              <ImageWithFallback src={cepiLogo} alt="CEPI" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-black text-foreground text-xl">EduLink</h1>
              <p className="text-xs text-muted-foreground">Colégio CEPI Expansão</p>
            </div>
          </div>

          <h2 className="font-black text-foreground text-2xl mb-1">Bem-vindo!</h2>
          <p className="text-muted-foreground text-sm mb-5">Como você deseja entrar?</p>

          {/* 3 role cards */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            {roles.map(({ r, label, Icon, desc }) => (
              <button key={r} onClick={() => { setRole(r); setGuardian(""); setChild(null); }}
                className={`rounded-2xl p-3 border-2 text-left transition-all ${role===r ? "border-primary bg-secondary" : "border-border bg-muted/30 hover:border-primary/40"}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${role===r ? "bg-primary" : "bg-muted"}`}>
                  <Icon className={`w-5 h-5 ${role===r ? "text-white" : "text-muted-foreground"}`} />
                </div>
                <p className={`text-xs font-bold leading-tight ${role===r ? "text-primary" : "text-foreground"}`}>{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-tight hidden sm:block">{desc}</p>
              </button>
            ))}
          </div>

          {/* Student / Teacher form */}
          {role && role !== "guardian" && (
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Nome</label>
                <input className="w-full rounded-xl border border-border bg-input-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder={role==="student" ? "Ex: João Victor" : "Ex: Carlos Silva"}
                  value={name} onChange={e => setName(e.target.value)} />
              </div>
              {role === "student" && (
                <div className="grid grid-cols-2 gap-3">
                  {[["Série", grade, setGrade, ["3º Ano","4º Ano","5º Ano","6º Ano","7º Ano","8º Ano","9º Ano"]],
                    ["Turma", turma, setTurma, ["A","B","C","D"]]
                  ].map(([lbl, val, fn, opts]) => (
                    <div key={String(lbl)}>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">{String(lbl)}</label>
                      <select className="w-full rounded-xl border border-border bg-input-background px-3 py-3 text-sm outline-none"
                        value={String(val)} onChange={e => (fn as (v:string)=>void)(e.target.value)}>
                        {(opts as string[]).map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={handleLogin} disabled={!name.trim()}
                className="w-full bg-primary text-white rounded-xl py-3.5 font-bold text-sm disabled:opacity-40 hover:bg-[#085a30] transition-colors mt-1">
                Entrar no EduLink →
              </button>
            </div>
          )}

          {/* Guardian flow */}
          {role === "guardian" && (
            <div className="flex flex-col gap-3">
              <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-orange-600 flex-shrink-0" />
                <p className="text-xs text-orange-800 font-medium">Acesso exclusivo para responsáveis cadastrados</p>
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Selecione seu nome</label>
                <select className="w-full rounded-xl border border-border bg-input-background px-3 py-3 text-sm outline-none"
                  value={guardian} onChange={e => { setGuardian(e.target.value); setChild(null); }}>
                  <option value="">Escolha o responsável...</option>
                  {GUARDIANS.map(g => <option key={g.name} value={g.name}>{g.name}</option>)}
                </select>
              </div>

              {guardianData && (
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                    Selecione o filho(a) — {guardianData.children.length} {guardianData.children.length===1?"aluno":"alunos"} matriculado{guardianData.children.length===1?"":"s"}
                  </label>
                  <div className="space-y-2">
                    {guardianData.children.map(c => (
                      <button key={c.name} onClick={() => setChild(c)}
                        className={`w-full flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all ${child?.name===c.name ? "border-primary bg-secondary" : "border-border hover:border-primary/40"}`}>
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {c.name[0]}
                        </div>
                        <div>
                          <p className={`font-bold text-sm ${child?.name===c.name ? "text-primary" : "text-foreground"}`}>{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.grade} · Turma {c.turma}</p>
                        </div>
                        {child?.name===c.name && <Check className="w-5 h-5 text-primary ml-auto" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={handleLogin} disabled={!guardian || !child}
                className="w-full bg-primary text-white rounded-xl py-3.5 font-bold text-sm disabled:opacity-40 hover:bg-[#085a30] transition-colors">
                Entrar como responsável →
              </button>
            </div>
          )}

          <p className="text-center text-xs text-muted-foreground mt-6">Colégio CEPI Expansão · 2025</p>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// STORY VIEWER
// ══════════════════════════════════════════════════
function StoryViewer({ story, all, onClose, onNav, onReport }: { story: Story; all: Story[]; onClose: ()=>void; onNav: (id:number)=>void; onReport: ()=>void }) {
  const idx = all.findIndex(s => s.id === story.id);
  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <button onClick={onClose} className="absolute top-4 right-14 text-white/70 hover:text-white z-10">
        <X className="w-7 h-7" />
      </button>
      <button onClick={onReport} className="absolute top-4 right-4 text-white/70 hover:text-orange-400 z-10 transition-colors" title="Denunciar story">
        <Flag className="w-6 h-6" />
      </button>
      <div className="absolute top-4 left-4 right-28 flex gap-1 z-10">
        {all.map((s, i) => (
          <div key={s.id} className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden">
            <div className={`h-full bg-white rounded-full ${i < idx ? "w-full" : i === idx ? "animate-[grow_5s_linear_forwards]" : "w-0"}`} />
          </div>
        ))}
      </div>
      <div className="absolute top-10 left-4 z-10 flex items-center gap-3 mt-2">
        <TeacherAvatar t={story.t} size="md" />
        <div>
          <p className="text-white font-bold text-sm drop-shadow">Prof. {story.t.name}</p>
          <p className="text-white/70 text-xs">{story.t.subj}</p>
        </div>
      </div>
      <img src={unsplash(story.img, 600, 900)} alt={story.caption} className="h-full max-h-[90vh] rounded-2xl object-cover" />
      <div className="absolute bottom-8 left-0 right-0 px-6">
        <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-4">
          <p className="text-white font-semibold text-sm leading-relaxed">{story.caption}</p>
        </div>
      </div>
      {idx > 0 && (
        <button onClick={() => onNav(all[idx-1].id)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 rounded-full flex items-center justify-center text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}
      {idx < all.length - 1 && (
        <button onClick={() => onNav(all[idx+1].id)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 rounded-full flex items-center justify-center text-white rotate-180">
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════
// POST CARD
// ══════════════════════════════════════════════════
function PostCard({ post, onLike, onComment, onReport, readonly }: { post: Post; onLike: (id:number)=>void; onComment: (p:Post)=>void; onReport: (p:Post)=>void; readonly?: boolean }) {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <TeacherAvatar t={post.t} size="md" />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-foreground text-sm">Prof. {post.t.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <Tag name={post.subj} col={post.t.col} />
            <span className="text-xs text-muted-foreground">{post.age}</span>
          </div>
        </div>
        <div className="relative">
          <button onClick={() => setShowMenu(s=>!s)} className="p-1 rounded-lg hover:bg-muted">
            <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-8 bg-card border border-border rounded-xl shadow-lg z-10 py-1 min-w-[160px]">
              <button onClick={() => { onReport(post); setShowMenu(false); }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-orange-600 hover:bg-orange-50 text-left">
                <Flag className="w-4 h-4" /> Denunciar post
              </button>
              <button onClick={() => setShowMenu(false)}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted text-left">
                <Bookmark className="w-4 h-4" /> Salvar
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="px-4 pb-3 text-sm text-foreground leading-relaxed">{post.body}</p>
      {post.img && (
        <div className="mx-4 mb-3 rounded-xl overflow-hidden bg-muted">
          <img src={unsplash(post.img, 680, 380)} alt="Conteúdo" className="w-full object-cover" />
        </div>
      )}
      {!readonly && (
        <div className="flex items-center gap-1 px-4 py-2.5 border-t border-border/50">
          <button onClick={() => onLike(post.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors">
            <Heart className={`w-5 h-5 ${post.liked ? "fill-current text-red-500" : "text-muted-foreground"}`} />
            <span className="text-xs font-semibold text-muted-foreground">{post.likes}</span>
          </button>
          <button onClick={() => onComment(post)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors">
            <MessageCircle className="w-5 h-5 text-muted-foreground" />
            <span className="text-xs font-semibold text-muted-foreground">{post.comments.length}</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════
// COMMENTS MODAL
// ══════════════════════════════════════════════════
function CommentsModal({ post, user, onClose, onAdd }: { post: Post; user: AppUser; onClose: ()=>void; onAdd: (id:number, text:string)=>void }) {
  const [text, setText] = useState("");
  const [warn, setWarn] = useState("");
  const send = () => {
    const bad = checkWord(text);
    if (bad) { setWarn(`A palavra "${bad}" não é permitida.`); return; }
    if (!text.trim()) return;
    onAdd(post.id, text.trim()); setText(""); setWarn("");
  };
  return (
    <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <h3 className="font-black text-foreground">Comentários</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {post.comments.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">Nenhum comentário ainda.</p>}
          {post.comments.map(c => (
            <div key={c.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-secondary-foreground flex-shrink-0">
                {c.user.split(" ").map(w=>w[0]).join("").slice(0,2)}
              </div>
              <div className="flex-1">
                <div className="bg-muted rounded-2xl rounded-tl-sm px-3 py-2">
                  <p className="text-xs font-bold">{c.user}</p>
                  <p className="text-sm mt-0.5">{c.text}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1 ml-2">{c.age}</p>
              </div>
            </div>
          ))}
        </div>
        {warn && (
          <div className="mx-6 mb-2 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-xs text-red-700 font-medium">{warn}</p>
          </div>
        )}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-border flex-shrink-0">
          <Av ini={user.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()} col="#0a6b38" size="sm" />
          <input className="flex-1 bg-muted rounded-2xl px-4 py-2.5 text-sm outline-none"
            placeholder="Escreva um comentário..." value={text}
            onChange={e => { setText(e.target.value); setWarn(""); }}
            onKeyDown={e => e.key === "Enter" && send()} />
          <button onClick={send} disabled={!text.trim()} className="w-9 h-9 bg-primary rounded-full flex items-center justify-center disabled:opacity-40">
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// CREATE MODAL (Teacher)
// ══════════════════════════════════════════════════
function CreateModal({ onClose, onPost }: { onClose: ()=>void; onPost: (type:CreateType, body:string, subject:string)=>void }) {
  const [type, setType] = useState<CreateType|null>(null);
  const [body, setBody] = useState("");
  const [subject, setSubject] = useState("Matemática");
  const [done, setDone] = useState(false);

  if (done) return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-10 flex flex-col items-center gap-3 shadow-2xl">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <p className="font-black text-foreground text-lg">Publicado!</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="font-black text-foreground">Criar conteúdo</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        {!type ? (
          <div className="p-6 space-y-3">
            {([
              { t:"post" as CreateType,    label:"Publicação no Feed",    desc:"Foto, vídeo ou texto",    Icon:FileText, col:"#0a6b38" },
              { t:"story" as CreateType,   label:"Story",                 desc:"Foto/vídeo (24h)",         Icon:Camera,   col:"#c0392b" },
              { t:"library" as CreateType, label:"Adicionar à Biblioteca",desc:"PDF, vídeo ou material",   Icon:BookOpen, col:"#003087" },
            ]).map(({ t, label, desc, Icon, col }) => (
              <button key={t} onClick={() => setType(t)}
                className="w-full flex items-center gap-4 rounded-2xl border border-border p-4 hover:bg-muted/50 text-left">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor:col+"22" }}>
                  <Icon className="w-6 h-6" style={{ color:col }} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <button onClick={() => setType(null)} className="flex items-center gap-1 text-primary text-sm font-semibold">
              <ArrowLeft className="w-4 h-4" /> Voltar
            </button>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Matéria</label>
              <select className="w-full rounded-xl border border-border bg-input-background px-3 py-2.5 text-sm outline-none"
                value={subject} onChange={e => setSubject(e.target.value)}>
                {Object.keys(LIBRARY).map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Conteúdo</label>
              <textarea className="w-full rounded-xl border border-border bg-input-background px-4 py-3 text-sm outline-none resize-none focus:ring-2 focus:ring-primary/40"
                rows={4} placeholder="Escreva aqui..." value={body} onChange={e => setBody(e.target.value)} />
            </div>
            <button className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-4 text-muted-foreground text-sm hover:bg-muted/40">
              <Upload className="w-4 h-4" /> Anexar arquivo (PDF / Foto / Vídeo)
            </button>
            <button onClick={() => { onPost(type!, body, subject); setDone(true); setTimeout(onClose, 1200); }} disabled={!body.trim()}
              className="w-full bg-primary text-white rounded-xl py-3 font-bold text-sm disabled:opacity-40">
              Publicar →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// AI CHATBOT
// ══════════════════════════════════════════════════
function ChatbotPanel({ onClose }: { onClose: ()=>void }) {
  const [msgs, setMsgs] = useState([{ id:0, me:false, text:"Olá! Sou o EduBot 🤖 Posso ajudar com dúvidas, encontrar conteúdos e muito mais. Como posso ajudar?" }]);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs(m => [...m, { id:Date.now(), me:true, text }]);
    setInput("");
    setTimeout(() => {
      const answer = BOT_ANSWERS[text] ?? "Boa pergunta! Recomendo verificar na **Biblioteca** os materiais da matéria correspondente. Se precisar de mais ajuda, fale com seu professor pelo feed. 📚";
      setMsgs(m => [...m, { id:Date.now()+1, me:false, text:answer }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 w-80 bg-card border border-border rounded-3xl shadow-2xl flex flex-col overflow-hidden" style={{ height:420 }}>
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-primary flex-shrink-0">
        <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-white font-bold text-sm">EduBot</p>
          <p className="text-green-200 text-xs">Assistente inteligente</p>
        </div>
        <button onClick={onClose}><X className="w-5 h-5 text-white/70" /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {msgs.map(m => (
          <div key={m.id} className={`flex ${m.me ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${m.me ? "bg-primary text-white rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm"}`}>
              {m.text}
            </div>
          </div>
        ))}
        {msgs.length === 1 && (
          <div className="space-y-1 mt-2">
            {BOT_QUICK.map(q => (
              <button key={q} onClick={() => send(q)}
                className="w-full text-left text-xs bg-secondary text-secondary-foreground rounded-xl px-3 py-2 hover:bg-primary hover:text-white transition-colors">
                {q}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 px-3 py-3 border-t border-border flex-shrink-0">
        <input className="flex-1 bg-muted rounded-2xl px-3 py-2 text-xs outline-none"
          placeholder="Pergunte algo..." value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send(input)} />
        <button onClick={() => send(input)} disabled={!input.trim()}
          className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-40">
          <Send className="w-3.5 h-3.5 text-white" />
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// FEED TAB
// ══════════════════════════════════════════════════
function FeedTab({ user, posts, stories, onLike, onComment, onStory, onReport, onReportStory }: {
  user: AppUser; posts: Post[]; stories: Story[];
  onLike: (id:number)=>void; onComment: (p:Post)=>void; onStory: (s:Story)=>void;
  onReport: (p:Post)=>void; onReportStory: (s:Story)=>void;
}) {
  const isReadonly = user.role === "guardian";
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[640px] mx-auto py-6 px-4 space-y-5">
          {user.role === "guardian" && (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl px-5 py-3 flex items-center gap-3">
              <Shield className="w-5 h-5 text-orange-600 flex-shrink-0" />
              <p className="text-sm text-orange-800 font-medium">Você está vendo o feed de <strong>{user.guardianOf}</strong> ({user.grade} {user.turma})</p>
            </div>
          )}
          {/* Stories */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-3">Stories dos professores</p>
            <div className="flex gap-5 overflow-x-auto pb-1">
              {stories.map(s => (
                <button key={s.id} onClick={() => onStory(s)} className="flex flex-col items-center gap-1.5 flex-shrink-0 group">
                  <div className={`p-0.5 rounded-full transition-all ${s.viewed ? "bg-border" : "bg-gradient-to-tr from-[#0a6b38] to-[#3a9d5c]"} group-hover:scale-105`}>
                    <div className="bg-white p-0.5 rounded-full">
                      <div className="w-14 h-14 rounded-full overflow-hidden">
                        <img src={unsplash(s.t.photo, 120, 120)} alt={s.t.name} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-foreground max-w-[64px] truncate">{s.t.name.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </div>
          {posts.map(p => <PostCard key={p.id} post={p} onLike={onLike} onComment={onComment} onReport={onReport} readonly={isReadonly} />)}
        </div>
      </div>
      {/* Right sidebar */}
      <div className="hidden xl:block w-72 border-l border-border overflow-y-auto p-4 space-y-4 flex-shrink-0">
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-3">Professores</p>
          <div className="space-y-3">
            {TEACHERS.map(t => (
              <div key={t.id} className="flex items-center gap-3">
                <TeacherAvatar t={t} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{t.name}</p>
                  <Tag name={t.subj} col={t.col} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-3">Próximas datas</p>
          <div className="space-y-2">
            {AGENDA_DATA.events.slice(0,4).map(({ date, name: n, col }) => (
              <div key={n} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs font-bold" style={{ backgroundColor:col }}>
                  {date.split("/")[0]}
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{n}</p>
                  <p className="text-xs text-muted-foreground">{date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// SHORTS TAB
// ══════════════════════════════════════════════════
function ShortsTab({ role }: { role: Role }) {
  const [idx, setIdx] = useState(0);
  const [muted, setMuted] = useState(false);
  const [liked, setLiked] = useState<number[]>([]);
  const lastWheelTime = useRef(0);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastWheelTime.current < 700) return;
    lastWheelTime.current = now;
    if (e.deltaY > 30) setIdx(i => Math.min(SHORTS_DATA.length-1, i+1));
    else if (e.deltaY < -30) setIdx(i => Math.max(0, i-1));
  }, []);

  const s = SHORTS_DATA[idx];
  return (
    <div className="flex-1 overflow-hidden bg-black relative" onWheel={handleWheel}>
      <div className="absolute inset-0 transition-all duration-500">
        <img src={unsplash(s.img, 800, 1200)} alt={s.title} className="w-full h-full object-cover opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
      </div>
      {role === "student" && (
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5">
          <Lock className="w-3 h-3 text-yellow-400" />
          <span className="text-white text-xs font-semibold">Só professores postam</span>
        </div>
      )}
      <button onClick={() => setMuted(m=>!m)}
        className="absolute top-4 right-4 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center">
        {muted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
      </button>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
          <Play className="w-7 h-7 text-white fill-white ml-1" />
        </div>
      </div>
      <div className="absolute right-4 bottom-32 flex flex-col items-center gap-5">
        <button onClick={() => setLiked(l => l.includes(s.id) ? l.filter(x=>x!==s.id) : [...l,s.id])} className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Heart className={`w-6 h-6 ${liked.includes(s.id) ? "fill-red-500 text-red-500" : "text-white"}`} />
          </div>
          <span className="text-white text-xs font-bold">{liked.includes(s.id) ? s.likes+1 : s.likes}</span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Eye className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xs font-bold">{s.views}</span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Bookmark className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xs font-bold">Salvar</span>
        </button>
      </div>
      <div className="absolute bottom-0 left-0 right-16 p-5 pb-8">
        <div className="flex items-center gap-3 mb-3">
          <TeacherAvatar t={s.t} size="sm" />
          <div>
            <p className="text-white font-bold text-sm drop-shadow">Prof. {s.t.name}</p>
            <Tag name={s.t.subj} col="#ffffff" />
          </div>
        </div>
        <p className="text-white font-semibold text-base leading-snug mb-2">{s.title}</p>
        <p className="text-white/70 text-xs">{s.dur} · {s.views} visualizações</p>
      </div>
      <div className="absolute right-1/2 translate-x-1/2 bottom-3 flex flex-col items-center gap-1">
        {idx > 0 && <ChevronUp className="w-5 h-5 text-white/60 animate-bounce" />}
        <div className="flex gap-1">
          {SHORTS_DATA.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} className={`rounded-full transition-all ${i===idx ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40"}`} />
          ))}
        </div>
        {idx < SHORTS_DATA.length-1 && <ChevronDown className="w-5 h-5 text-white/60 animate-bounce" />}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// LIBRARY TAB
// ══════════════════════════════════════════════════
function LibraryTab({ user }: { user: AppUser }) {
  const [openSubject, setOpenSubject] = useState<string|null>(null);
  const [openBimester, setOpenBimester] = useState<string|null>(null);
  const [openTopic, setOpenTopic] = useState<string|null>(null);

  if (openSubject) {
    const sub = LIBRARY[openSubject];
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[860px] mx-auto py-6 px-4">
          <button onClick={() => { setOpenSubject(null); setOpenBimester(null); setOpenTopic(null); }}
            className="flex items-center gap-2 text-primary font-semibold text-sm mb-5 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Voltar à biblioteca
          </button>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ backgroundColor:sub.bg }}>{sub.icon}</div>
            <div>
              <h2 className="text-2xl font-black text-foreground">{openSubject}</h2>
              <p className="text-sm text-muted-foreground">{user.grade} {user.role==="student"?user.turma:"· Todos os bimestres"}</p>
            </div>
          </div>
          <div className="space-y-3">
            {sub.bimesters.map(bim => (
              <div key={bim.name} className="bg-card border border-border rounded-2xl overflow-hidden">
                <button onClick={() => setOpenBimester(openBimester===bim.name ? null : bim.name)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black" style={{ backgroundColor:sub.col }}>{bim.name[0]}</div>
                    <span className="font-bold text-foreground">{bim.name}</span>
                    <span className="text-xs text-muted-foreground">{bim.topics.length} tópicos</span>
                  </div>
                  {openBimester===bim.name ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </button>
                {openBimester===bim.name && (
                  <div className="border-t border-border divide-y divide-border">
                    {bim.topics.map(topic => (
                      <div key={topic.name}>
                        <button onClick={() => setOpenTopic(openTopic===topic.name ? null : topic.name)}
                          className="w-full flex items-center justify-between px-5 py-3 hover:bg-muted/20">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor:sub.col }} />
                            <span className="text-sm font-semibold">{topic.name}</span>
                            <span className="text-xs text-muted-foreground">{topic.files.length} arquivos</span>
                          </div>
                          {openTopic===topic.name ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
                        </button>
                        {openTopic===topic.name && (
                          <div className="bg-muted/30 px-5 pb-3 space-y-2">
                            {topic.files.map(f => (
                              <button key={f.n} className="w-full flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-2.5 hover:bg-muted/50 text-left">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor:sub.col+"22" }}>
                                  {f.type==="video" ? <Video className="w-4 h-4" style={{ color:sub.col }} /> : <FileText className="w-4 h-4" style={{ color:sub.col }} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold truncate">{f.n}</p>
                                  <p className="text-xs text-muted-foreground">{f.type==="video" ? "Videoaula" : "PDF"}</p>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[860px] mx-auto py-6 px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-black text-foreground">Biblioteca</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {user.role==="student" ? `Materiais do ${user.grade} ${user.turma} · selecione a matéria` : user.role==="guardian" ? `Materiais de ${user.guardianOf} (${user.grade} ${user.turma})` : "Materiais de todas as turmas"}
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(LIBRARY).map(([name, sub]) => {
            const total = sub.bimesters.reduce((a,b) => a+b.topics.reduce((c,t) => c+t.files.length, 0), 0);
            return (
              <button key={name} onClick={() => { setOpenSubject(name); setOpenBimester(null); setOpenTopic(null); }}
                className="rounded-2xl p-5 text-left border border-border hover:scale-[1.02] hover:shadow-md transition-all" style={{ backgroundColor:sub.bg }}>
                <span className="text-4xl">{sub.icon}</span>
                <p className="font-black text-foreground text-base mt-3 leading-tight">{name}</p>
                <p className="text-xs font-semibold mt-1" style={{ color:sub.col }}>{sub.bimesters.length} bimestres · {total} arquivos</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// AGENDA TAB
// ══════════════════════════════════════════════════
function AgendaTab({ user }: { user: AppUser }) {
  const subjectColors: Record<string, string> = {
    Matemática:"#0a6b38", Português:"#003087", Ciências:"#3a9d5c", História:"#c0392b",
    Geografia:"#1a5276", Artes:"#7d5a00", "Ed. Física":"#0891b2", Inglês:"#65a30d", Intervalo:"#9ca3af",
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[1000px] mx-auto py-6 px-4 space-y-6">
        <div>
          <h2 className="text-2xl font-black text-foreground">Agenda Semanal</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Semana de 15 a 19 de Setembro · {user.role==="guardian" ? `${user.guardianOf} (${user.grade} ${user.turma})` : `${user.grade} ${user.turma}`}
          </p>
        </div>

        {/* Weekly schedule table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 font-black text-muted-foreground w-28">Horário</th>
                  {AGENDA_DATA.days.map(d => (
                    <th key={d} className="text-center py-3 px-2 font-black text-foreground">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {AGENDA_DATA.schedule.map((row, ri) => (
                  <tr key={ri} className={row.classes[0]==="Intervalo" ? "bg-muted/20" : ""}>
                    <td className="py-3 px-4 text-xs font-semibold text-muted-foreground whitespace-nowrap">{row.time}</td>
                    {row.classes.map((cls, ci) => (
                      <td key={ci} className="py-2 px-2 text-center">
                        {cls === "Intervalo" ? (
                          <span className="text-xs text-muted-foreground font-medium">Intervalo</span>
                        ) : (
                          <span className="inline-block px-2 py-1.5 rounded-xl text-white text-xs font-bold leading-tight"
                                style={{ backgroundColor: subjectColors[cls] || "#6b7280" }}>
                            {cls}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Events */}
        <div>
          <h3 className="font-black text-foreground text-lg mb-3">Próximas datas importantes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {AGENDA_DATA.events.map(ev => (
              <div key={ev.name} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center text-white flex-shrink-0" style={{ backgroundColor:ev.col }}>
                  <span className="text-lg font-black leading-none">{ev.date.split("/")[0]}</span>
                  <span className="text-xs opacity-80">/{ev.date.split("/")[1]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground text-sm leading-tight">{ev.name}</p>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block" style={{ backgroundColor:ev.col+"22", color:ev.col }}>
                    {ev.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// COMMUNITY TAB
// ══════════════════════════════════════════════════
function CommunityTab({ user }: { user: AppUser }) {
  const [msgs, setMsgs] = useState(CHAT_INIT);
  const [text, setText] = useState("");
  const [warn, setWarn] = useState("");
  const ini = user.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  const isReadonly = user.role === "guardian";

  const send = () => {
    const bad = checkWord(text);
    if (bad) { setWarn(`"${bad}" não é permitida.`); return; }
    if (!text.trim()) return;
    const now = new Date();
    const h = `${now.getHours().toString().padStart(2,"0")}:${now.getMinutes().toString().padStart(2,"0")}`;
    setMsgs(m => [...m, { id:Date.now(), user:"Você", me:true, text:text.trim(), h, ini, col:"#0a6b38" }]);
    setText(""); setWarn("");
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="max-w-[700px] w-full mx-auto flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-card flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm" style={{ background:"linear-gradient(135deg,#0a6b38,#3a9d5c)" }}>
              {user.turma}
            </div>
            <div>
              <p className="font-black text-foreground">{user.grade} {user.turma} · Comunidade da turma</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Lock className="w-3 h-3 text-primary" />
                <p className="text-xs text-primary font-semibold">
                  {isReadonly ? `Visualizando como responsável de ${user.guardianOf}` : "Somente alunos desta turma"}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {msgs.map(m => (
            <div key={m.id} className={`flex items-end gap-2 ${m.me ? "flex-row-reverse" : ""}`}>
              {!m.me && <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor:m.col }}>{m.ini}</div>}
              <div className={`max-w-[65%] flex flex-col gap-0.5 ${m.me ? "items-end" : "items-start"}`}>
                {!m.me && <span className="text-xs font-bold text-muted-foreground ml-1">{m.user}</span>}
                <div className={`rounded-2xl px-3 py-2 text-sm ${m.me ? "bg-primary text-white rounded-br-sm" : "bg-card border border-border rounded-bl-sm"}`}>
                  {m.text}
                </div>
                <span className="text-xs text-muted-foreground mx-1">{m.h}</span>
              </div>
            </div>
          ))}
        </div>
        {!isReadonly && (
          <div className="flex-shrink-0 border-t border-border bg-card">
            {warn && (
              <div className="mx-6 mt-2 flex items-center gap-2 bg-red-50 rounded-xl px-3 py-1.5">
                <AlertTriangle className="w-3 h-3 text-red-500" />
                <p className="text-xs text-red-700">{warn}</p>
              </div>
            )}
            <div className="flex items-center gap-3 px-6 py-3">
              <input className="flex-1 bg-muted rounded-2xl px-4 py-2.5 text-sm outline-none"
                placeholder="Mensagem para sua turma..."
                value={text} onChange={e => { setText(e.target.value); setWarn(""); }}
                onKeyDown={e => e.key === "Enter" && send()} />
              <button onClick={send} disabled={!text.trim()}
                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-40">
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// ACCOUNT TAB
// ══════════════════════════════════════════════════
function AccountTab({ user, onLogout, onShowGrades }: { user: AppUser; onLogout: ()=>void; onShowGrades: ()=>void }) {
  const ini = user.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  const isTeacher = user.role === "teacher";
  const isGuardian = user.role === "guardian";
  const stats = isTeacher
    ? [{ label:"Publicações", v:"12" },{ label:"Turmas", v:"4" },{ label:"Alunos", v:"128" }]
    : isGuardian
    ? [{ label:"Filhos", v:String(GUARDIANS.find(g=>g.name===user.name)?.children.length || 1) },{ label:"Posts vistos", v:"34" },{ label:"Alertas", v:"0" }]
    : [{ label:"Curtidas", v:"47" },{ label:"Shorts vistos", v:"23" },{ label:"Salvos", v:"8" }];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[680px] mx-auto py-8 px-4">
        <div className="bg-card border border-border rounded-3xl overflow-hidden mb-5">
          <div className="h-24 bg-gradient-to-r from-[#0a6b38] to-[#3a9d5c]" />
          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-10 mb-4">
              <div className="w-20 h-20 rounded-full border-4 border-card bg-primary flex items-center justify-center text-white font-black text-xl shadow-lg">{ini}</div>
              {isGuardian && <Tag name="Responsável" col="#c0392b" />}
              {isTeacher && <Tag name="Professor" col="#0a6b38" />}
              {!isTeacher && !isGuardian && <div className="flex gap-2"><Tag name={user.grade} col="#0a6b38" /><Tag name={`Turma ${user.turma}`} col="#1a5276" /></div>}
            </div>
            <h2 className="font-black text-foreground text-2xl">{isTeacher ? "Prof. " : ""}{user.name}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {isGuardian ? `Responsável por: ${user.guardianOf} (${user.grade} ${user.turma})` : "Colégio CEPI Expansão"}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-5">
          {stats.map(s => (
            <div key={s.label} className="bg-card border border-border rounded-2xl p-4 text-center">
              <p className="font-black text-foreground text-2xl">{s.v}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {/* Grades button - first item */}
          <button onClick={onShowGrades}
            className="w-full flex items-center gap-4 px-5 py-4 hover:bg-muted/40 transition-colors border-b border-border">
            <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5 text-yellow-700" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-foreground text-sm">
                {isGuardian ? `Boletim de ${user.guardianOf}` : "Minhas Notas"}
              </p>
              <p className="text-xs text-muted-foreground">Notas do semestre · 2025</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
          {[
            { Icon:Bell,          label:"Notificações",    sub:"Ativas" },
            { Icon:Settings,      label:"Configurações",   sub:"Privacidade e conta" },
            ...(isTeacher ? [{ Icon:GraduationCap, label:"Minhas turmas", sub:"4 turmas ativas" }] : []),
            ...(isGuardian ? [{ Icon:Baby, label:"Meus filhos", sub:`${GUARDIANS.find(g=>g.name===user.name)?.children.length || 1} aluno(s)` }] : []),
            { Icon:Bookmark,      label:"Conteúdo salvo",  sub:`${isTeacher?"3":"8"} itens` },
          ].map(({ Icon, label, sub }, i, arr) => (
            <button key={label}
              className={`w-full flex items-center gap-4 px-5 py-4 hover:bg-muted/40 transition-colors ${i < arr.length-1 ? "border-b border-border" : ""}`}>
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-foreground text-sm">{label}</p>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>
        <button onClick={onLogout}
          className="w-full mt-3 flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3.5 text-red-600 font-bold text-sm hover:bg-red-100 transition-colors">
          <LogOut className="w-4 h-4" /> Sair da conta
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// APP SHELL
// ══════════════════════════════════════════════════
function AppShell({ user, onLogout }: { user: AppUser; onLogout: ()=>void }) {
  const [tab, setTab] = useState<Tab>("feed");
  const [posts, setPosts] = useState<Post[]>(INIT_POSTS);
  const [stories, setStories] = useState<Story[]>(INIT_STORIES);
  const [activeStory, setActiveStory] = useState<Story|null>(null);
  const [commentPost, setCommentPost] = useState<Post|null>(null);
  const [reportPost, setReportPost] = useState<Post|null>(null);
  const [reportStory, setReportStory] = useState<Story|null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showBot, setShowBot] = useState(false);
  const [showGrades, setShowGrades] = useState(false);
  const isTeacher = user.role === "teacher";
  const ini = user.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();

  const handleLike = (id:number) =>
    setPosts(ps => ps.map(p => p.id===id ? {...p, liked:!p.liked, likes:p.liked?p.likes-1:p.likes+1} : p));
  const handleAddComment = (postId:number, text:string) =>
    setPosts(ps => ps.map(p => p.id===postId ? {...p, comments:[...p.comments,{id:Date.now(),user:isTeacher?`Prof. ${user.name}`:user.name,text,age:"agora"}]} : p));
  const handleStory = (s:Story) => {
    setActiveStory(s);
    setStories(prev => prev.map(st => st.id===s.id ? {...st, viewed:true} : st));
  };
  const handleCreate = (type:CreateType, body:string, subject:string) => {
    if (type==="post") {
      const t = TEACHERS.find(t=>t.subj===subject) ?? TEACHERS[0];
      setPosts(ps => [{id:Date.now(),t,age:"agora",subj:subject,body,img:null,likes:0,liked:false,comments:[]},...ps]);
    }
    if (type==="story") {
      const t = TEACHERS.find(t=>t.subj===subject) ?? TEACHERS[0];
      setStories(prev => [{id:Date.now(),t,viewed:false,img:t.photo,caption:body},...prev]);
    }
  };

  const navItems: { key:Tab; Icon:React.ElementType; label:string; badge?:string }[] = [
    { key:"feed",      Icon:Home,         label:"Início" },
    { key:"shorts",    Icon:Play,         label:"Shorts", badge:"5" },
    { key:"library",   Icon:BookOpen,     label:"Biblioteca" },
    { key:"community", Icon:Users,        label:"Turma" },
    { key:"agenda",    Icon:CalendarDays, label:"Agenda" },
    { key:"account",   Icon:User,         label:"Conta" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="flex flex-col border-r border-border bg-card flex-shrink-0 w-56 xl:w-64">
        <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-border flex-shrink-0">
            <ImageWithFallback src={cepiLogo} alt="CEPI" className="w-full h-full object-contain p-0.5" />
          </div>
          <div className="min-w-0">
            <p className="font-black text-foreground text-base leading-none">EduLink</p>
            <p className="text-xs text-muted-foreground truncate">CEPI Expansão</p>
          </div>
        </div>
        <div className="px-3 py-3 border-b border-border">
          <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <input className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="Buscar..." />
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(({ key, Icon, label, badge }) => {
            const active = tab === key;
            return (
              <button key={key} onClick={() => setTab(key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${active ? "bg-secondary text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                <Icon className="w-5 h-5 flex-shrink-0" />
                {label}
                {badge && <span className="ml-auto text-xs bg-primary text-white rounded-full px-1.5 py-0.5">{badge}</span>}
              </button>
            );
          })}
          {isTeacher && (
            <>
              <div className="h-px bg-border my-2" />
              <button onClick={() => setShowCreate(true)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-[#085a30] transition-colors">
                <Plus className="w-5 h-5 flex-shrink-0" />
                Criar conteúdo
              </button>
            </>
          )}
        </nav>
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-muted cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{ini}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground truncate">{isTeacher?"Prof. ":""}{user.name.split(" ")[0]}</p>
              <p className="text-xs text-muted-foreground">
                {user.role==="guardian" ? `Resp. por ${user.guardianOf}` : user.role==="student" ? `${user.grade} ${user.turma}` : "Professor"}
              </p>
            </div>
            <Bell className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-card flex-shrink-0">
          <div>
            <h1 className="font-black text-foreground text-lg">{navItems.find(n=>n.key===tab)?.label}</h1>
            {tab !== "shorts" && (
              <p className="text-xs text-muted-foreground">
                {user.role==="student" ? `${user.grade} ${user.turma}` : user.role==="guardian" ? `Responsável por ${user.guardianOf}` : "Professor · CEPI Expansão"}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button className="relative w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-card" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-hidden flex">
          {tab==="feed"      && <FeedTab user={user} posts={posts} stories={stories} onLike={handleLike} onComment={setCommentPost} onStory={handleStory} onReport={setReportPost} onReportStory={setReportStory} />}
          {tab==="shorts"    && <ShortsTab role={user.role} />}
          {tab==="library"   && <LibraryTab user={user} />}
          {tab==="community" && <CommunityTab user={user} />}
          {tab==="agenda"    && <AgendaTab user={user} />}
          {tab==="account"   && <AccountTab user={user} onLogout={onLogout} onShowGrades={() => setShowGrades(true)} />}
        </div>
      </div>

      {/* Floating bot */}
      <button onClick={() => setShowBot(b=>!b)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-xl hover:bg-[#085a30] transition-all hover:scale-105">
        {showBot ? <X className="w-6 h-6 text-white" /> : <Sparkles className="w-6 h-6 text-white" />}
      </button>
      {showBot && <ChatbotPanel onClose={() => setShowBot(false)} />}

      {/* Modals */}
      {activeStory && (
        <StoryViewer story={activeStory} all={stories} onClose={() => setActiveStory(null)}
          onNav={id => { const s=stories.find(x=>x.id===id); if(s) handleStory(s); }}
          onReport={() => { setReportStory(activeStory); setActiveStory(null); }} />
      )}
      {commentPost && <CommentsModal post={commentPost} user={user} onClose={() => setCommentPost(null)} onAdd={handleAddComment} />}
      {(reportPost || reportStory) && <ReportModal contentType={reportPost?"post":"story"} onClose={() => { setReportPost(null); setReportStory(null); }} />}
      {showCreate && isTeacher && <CreateModal onClose={() => setShowCreate(false)} onPost={handleCreate} />}
      {showGrades && <GradesModal user={user} onClose={() => setShowGrades(false)} />}
    </div>
  );
}

// ══════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════
export default function App() {
  const [user, setUser] = useState<AppUser|null>(null);
  return user ? <AppShell user={user} onLogout={() => setUser(null)} /> : <LoginScreen onLogin={setUser} />;
}
