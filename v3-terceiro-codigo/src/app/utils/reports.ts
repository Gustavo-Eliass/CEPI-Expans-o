import type { AppUser, Post, ReportItem, Story } from "@/app/types";

export function buildReport(target: { post?: Post|null; story?: Story|null }, reporter: AppUser, reason: string, detail: string): ReportItem {
  const teacher = target.post?.t ?? target.story!.t;
  const content = target.post?.body ?? target.story!.caption;
  return {
    id: Date.now(),
    type: target.post ? "post" : "story",
    content,
    author: `Prof. ${teacher.name}`,
    turma: reporter.role === "coordinator" ? "Todas as turmas" : `${reporter.grade} ${reporter.turma}`,
    subject: target.post?.subj ?? teacher.subj,
    reason: detail ? `${reason} — "${detail}"` : reason,
    date: "agora",
    source: "manual",
    resolved: false,
  };
}
