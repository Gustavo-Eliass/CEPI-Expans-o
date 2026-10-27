import type { Story, ReportItem, AIDecidedItem } from "@/app/types";

export const REPORT_REASONS = ["Publicação acidental","Conteúdo inadequado para alunos","Informação incorreta","Conteúdo ofensivo","Outro motivo"];

export const COORD_REPORTS_INIT: ReportItem[] = [
  { id:1, type:"post", content:"Resultado incrível do experimento! 🌱 [Foto] — publicei na conta errada.", author:"Prof. Marcos Reis", turma:"5º Ano B", subject:"Ciências", reason:"Publicação acidental", date:"há 10min", source:"manual", resolved:false, authorDeleted:false },
  { id:2, type:"message", content:"Esse exercício é uma bagunça total, não entendi absolutamente nada.", author:"Pedro H.", turma:"5º Ano B", subject:"Matemática", reason:"Conteúdo inadequado para alunos", date:"há 25min", source:"manual", resolved:false, authorDeleted:false },
  { id:3, type:"story", content:"[Story removido pelo autor]", author:"Prof. Ana Lima", turma:"Todas as turmas", subject:"Português", reason:"Publicação acidental", date:"há 1h", source:"manual", resolved:true, authorDeleted:true,
    decision:{ action:"approved", note:"Story já removido pela própria professora. Caso encerrado.", by:"Coord. Maria", at:"há 45min" } },
];

export const COORD_AI_FLAGGED_INIT: ReportItem[] = [
  { id:101, type:"message", content:"Esse exercício não faz sentido algum, quem inventou isso?", author:"Gabriel M.", turma:"5º Ano B", subject:"Matemática", reason:"Possível linguagem desrespeitosa", date:"há 5min", source:"ai-flagged", resolved:false, confidence:"ambíguo", aiNote:"Expressão de frustração; pode ser interpretada como desrespeito ao professor. Contexto educacional não é conclusivo." },
  { id:102, type:"message", content:"Se você não entender vou te mostrar do que sou capaz, pode esperar.", author:"Lucas T.", turma:"7º Ano A", subject:"Comunidade", reason:"Possível ameaça velada", date:"há 18min", source:"ai-flagged", resolved:false, confidence:"risco alto", aiNote:"Linguagem que pode indicar ameaça; contexto de conflito entre alunos. Revisão humana prioritária recomendada." },
];

export const COORD_AI_DECIDED_INIT: AIDecidedItem[] = [
  { id:201, content:"Alguém fez o dever de matemática? Precisando de ajuda 🙏", author:"Ana Clara", turma:"5º Ano B", reason:"Sem linguagem ofensiva detectada; conteúdo de colaboração acadêmica.", confidence:97, action:"liberado", date:"há 2min", reopened:false },
  { id:202, content:"[mensagem bloqueada — palavra ofensiva detectada]", author:"Usuário anônimo", turma:"5º Ano B", reason:"Correspondência exata com termo bloqueado: 'idiota'.", confidence:100, action:"bloqueado", date:"há 8min", reopened:false },
  { id:203, content:"Já comecei a redação! Que tema atual e interessante 📝", author:"Maria F.", turma:"6º Ano C", reason:"Expressão de entusiasmo acadêmico; sem risco detectado.", confidence:99, action:"liberado", date:"há 15min", reopened:false },
  { id:204, content:"Não entendi nada dessa aula. Que chato 😩", author:"Renato S.", turma:"7º Ano A", reason:"Frustração estudantil típica; sem ofensa ou risco detectado.", confidence:93, action:"liberado", date:"há 32min", reopened:false },
  { id:205, content:"[mensagem bloqueada — variação de termo inadequado]", author:"Usuário anônimo", turma:"4º Ano A", reason:"Correspondência com lista de termos bloqueados: variação de 'burro'.", confidence:95, action:"bloqueado", date:"há 45min", reopened:false },
];
