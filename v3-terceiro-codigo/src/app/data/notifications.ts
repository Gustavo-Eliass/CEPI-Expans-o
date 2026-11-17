import type { AppNotification } from "@/app/types";

export const STUDENT_NOTIFICATIONS: AppNotification[] = [
  { id: 1, kind: "post",     title: "Prof. Carlos Silva publicou", message: "Exercícios de frações para o 5º Ano B",   time: "há 2h",  read: false, goesTo: "feed" },
  { id: 2, kind: "activity", title: "Nova atividade",              message: "Ciências: ciclo da água — entrega sexta", time: "há 3h",  read: false, goesTo: "activities" },
  { id: 3, kind: "agenda",   title: "Prova amanhã",                message: "Matemática — frações e MMC",              time: "há 5h",  read: false, goesTo: "agenda" },
  { id: 4, kind: "grade",    title: "Nota lançada",                message: "Português — 2º bimestre: 8,5",            time: "ontem",  read: true,  goesTo: "account" },
  { id: 5, kind: "level",    title: "Você subiu de nível!",        message: "Agora você é Fogo Azul 🔥",               time: "ontem",  read: true,  goesTo: "progress" },
];

export const COORDINATOR_NOTIFICATIONS: AppNotification[] = [
  { id: 1, kind: "post",     title: "Nova denúncia",         message: "Post do Prof. Marcos Reis foi denunciado",    time: "há 10min", read: false },
  { id: 2, kind: "activity", title: "IA sinalizou conteúdo", message: "Comentário com possível linguagem ofensiva", time: "há 1h",    read: false },
];
