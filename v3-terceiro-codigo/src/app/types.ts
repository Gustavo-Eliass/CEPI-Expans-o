export type Role = "student" | "teacher" | "guardian" | "coordinator";

export type Tab = "feed" | "shorts" | "library" | "community" | "account" | "agenda" | "progress" | "activities";

export type CoordTab = "dashboard" | "feed" | "reports" | "ai-flagged" | "ai-decided";

export type CreateType = "post" | "story" | "library";

export interface AppUser { name: string; role: Role; grade: string; turma: string; guardianOf?: string; }

export interface Activity {
  id: number; title: string; subject: string; teacher: Teacher;
  deadline: string; type: "questoes"|"upload"|"texto";
  status: "pendente"|"concluida"; expReward: number;
  questions?: { q:string; opts:string[]; answer:number }[];
}

export interface ExpEntry { id:number; reason:string; amount:number; time:string; }

export interface Teacher { id: number; name: string; subj: string; ini: string; col: string; photo: string; }

export interface Story { id: number; t: Teacher; viewed: boolean; img: string; caption: string; }

export interface Comment { id: number; user: string; text: string; age: string; }

export interface Post { id: number; t: Teacher; age: string; subj: string; body: string; img: string | null; likes: number; liked: boolean; comments: Comment[]; }

export interface ReportItem {
  id: number; type: "post"|"story"|"message";
  content: string; author: string; turma: string; subject?: string;
  reason: string; date: string; source: "manual"|"ai-flagged";
  resolved: boolean; authorDeleted?: boolean;
  decision?: { action:"approved"|"removed"; note:string; by:string; at:string; };
  confidence?: "baixa confiança"|"ambíguo"|"risco alto";
  aiNote?: string;
}

export interface AIDecidedItem {
  id: number; content: string; author: string; turma: string;
  reason: string; confidence: number; action:"liberado"|"bloqueado";
  date: string; reopened: boolean;
}

export type LibrarySubject = { col:string; bg:string; icon:string; bimesters:{ name:string; topics:{ name:string; files:{ n:string; type:"pdf"|"video" }[] }[] }[] };

export interface SharedFeed {
  posts: Post[]; setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  stories: Story[]; setStories: React.Dispatch<React.SetStateAction<Story[]>>;
  reports: ReportItem[]; setReports: React.Dispatch<React.SetStateAction<ReportItem[]>>;
}

export type BotMode = "chat" | "quiz";

export type BotMsg = { id:number; me:boolean; text:string; source?:string };

export type NotificationKind = "post" | "activity" | "agenda" | "grade" | "level";

export interface AppNotification {
  id: number;
  kind: NotificationKind;
  title: string;
  message: string;
  time: string;
  read: boolean;
  goesTo?: NotificationTarget;
}

export type NotificationTarget = Tab | CoordTab | "grades";

export interface StudentGrades { name: string; b1: number|null; b2: number|null; b3: number|null; b4: number|null; }

export interface ClassGradebook { turma: string; students: StudentGrades[]; }
