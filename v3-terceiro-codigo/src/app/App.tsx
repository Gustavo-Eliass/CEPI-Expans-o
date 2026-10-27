import { useState } from "react";
import { AppShell } from "@/app/components/AppShell";
import { LoginScreen } from "@/app/components/LoginScreen";
import { CoordinatorShell } from "@/app/components/coordinator/CoordinatorShell";
import type { AppUser } from "@/app/types";

export default function App() {
  const [user, setUser] = useState<AppUser|null>(null);
  if (!user) return <LoginScreen onLogin={setUser} />;
  if (user.role==="coordinator") return <CoordinatorShell user={user} onLogout={() => setUser(null)} />;
  return <AppShell user={user} onLogout={() => setUser(null)} />;
}
