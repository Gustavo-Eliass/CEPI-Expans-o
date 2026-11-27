import type { AppUser, Role } from "@/app/types";

export const DEMO_ACCOUNTS: Record<Role, AppUser> = {
  student:     { name:"Arthur",       role:"student",     grade:"5º Ano", turma:"B" },
  teacher:     { name:"Carlos Silva", role:"teacher",     grade:"5º Ano", turma:"B" },
  guardian:    { name:"Ana",          role:"guardian",    grade:"5º Ano", turma:"B", guardianOf:"Arthur" },
  coordinator: { name:"Maria",        role:"coordinator", grade:"",       turma:""  },
};

export function describeAccount(user: AppUser) {
  if (user.role === "student") return `Aluno · ${user.grade} ${user.turma}`;
  if (user.role === "teacher") return "Professor de Matemática";
  if (user.role === "guardian") return `Responsável por ${user.guardianOf}`;
  return "Coordenação · Painel de moderação";
}
