import type { AppNotification, Role } from "@/app/types";

const STUDENT_NOTIFICATIONS: AppNotification[] = [
  { id: 1, kind: "post",     title: "Prof. Carlos Silva publicou", message: "Exercícios de frações para o 5º Ano B",   time: "há 2h",  read: false, goesTo: "feed" },
  { id: 2, kind: "activity", title: "Nova atividade",              message: "Ciências: ciclo da água — entrega sexta", time: "há 3h",  read: false, goesTo: "activities" },
  { id: 3, kind: "agenda",   title: "Prova amanhã",                message: "Matemática — frações e MMC",              time: "há 5h",  read: false, goesTo: "agenda" },
  { id: 4, kind: "grade",    title: "Nota lançada",                message: "Português — 2º bimestre: 8,5",            time: "ontem",  read: true,  goesTo: "grades" },
  { id: 5, kind: "level",    title: "Quase subindo de nível!",     message: "Faltam 13 EXP para o Fogo Azul 🔥",       time: "ontem",  read: true,  goesTo: "progress" },
];

const TEACHER_NOTIFICATIONS: AppNotification[] = [
  { id: 1, kind: "post",   title: "Novos comentários",      message: "3 alunos comentaram no seu post de frações", time: "há 1h", read: false, goesTo: "feed" },
  { id: 2, kind: "grade",  title: "Notas pendentes",        message: "Lance as notas do 2º bimestre do 6º Ano C",   time: "há 4h", read: false, goesTo: "grades" },
  { id: 3, kind: "agenda", title: "Prova de Matemática",    message: "5º Ano B — sexta-feira, 1º horário",          time: "ontem", read: true,  goesTo: "agenda" },
];

const GUARDIAN_NOTIFICATIONS: AppNotification[] = [
  { id: 1, kind: "grade",  title: "Nota lançada",           message: "Matemática — 2º bimestre: 7,8", time: "há 2h", read: false, goesTo: "grades" },
  { id: 2, kind: "agenda", title: "Prova amanhã",           message: "Matemática — frações e MMC",           time: "há 5h", read: false, goesTo: "agenda" },
  { id: 3, kind: "post",   title: "Prof. Carlos Silva publicou", message: "Exercícios de frações para o 5º Ano B", time: "ontem", read: true, goesTo: "feed" },
];

const COORDINATOR_NOTIFICATIONS: AppNotification[] = [
  { id: 1, kind: "post",     title: "Nova denúncia",         message: "Post do Prof. Marcos Reis foi denunciado",    time: "há 10min", read: false, goesTo: "reports" },
  { id: 2, kind: "activity", title: "IA sinalizou conteúdo", message: "Mensagem com possível ameaça no 7º Ano A",     time: "há 18min", read: false, goesTo: "ai-flagged" },
];

export const NOTIFICATIONS_BY_ROLE: Record<Role, AppNotification[]> = {
  student: STUDENT_NOTIFICATIONS,
  teacher: TEACHER_NOTIFICATIONS,
  guardian: GUARDIAN_NOTIFICATIONS,
  coordinator: COORDINATOR_NOTIFICATIONS,
};
