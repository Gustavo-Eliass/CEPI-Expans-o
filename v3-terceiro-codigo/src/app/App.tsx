import { useState } from "react";
import { AppShell } from "@/app/components/AppShell";
import { LoginScreen } from "@/app/components/LoginScreen";
import { CoordinatorShell } from "@/app/components/coordinator/CoordinatorShell";
import { INIT_POSTS, INIT_STORIES } from "@/app/data/feed";
import { COORD_REPORTS_INIT } from "@/app/data/moderation";
import type { AppUser, Post, ReportItem, Story } from "@/app/types";

export default function App() {
  const [user, setUser] = useState<AppUser|null>(null);
  const [posts, setPosts] = useState<Post[]>(INIT_POSTS);
  const [stories, setStories] = useState<Story[]>(INIT_STORIES);
  const [reports, setReports] = useState<ReportItem[]>(COORD_REPORTS_INIT);
  const feed = { posts, setPosts, stories, setStories, reports, setReports };

  if (!user) return <LoginScreen onLogin={setUser} />;
  if (user.role==="coordinator") return <CoordinatorShell user={user} onLogout={() => setUser(null)} feed={feed} />;
  return <AppShell user={user} onLogout={() => setUser(null)} feed={feed} />;
}
