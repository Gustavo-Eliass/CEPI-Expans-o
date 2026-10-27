import { useState } from "react";
import { BookOpen, X, Send, FileText, Bot, RefreshCw, Info, HelpCircle } from "lucide-react";
import { BOT_QUICK, BOT_ANSWERS, BOT_DEFAULT, QUIZ_QUESTIONS } from "@/app/data/bot";
import type { AppUser, BotMode, BotMsg } from "@/app/types";

export function CePiBotPanel({ onClose, user }: { onClose:()=>void; user:AppUser }) {
  const [mode, setMode] = useState<BotMode>("chat");
  const [msgs, setMsgs] = useState<BotMsg[]>([{ id:0, me:false, text:"Olá! Sou o CePiBot 🤖 Posso ajudar com dúvidas, encontrar conteúdos e gerar simulados. Como posso ajudar?" }]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [offline, setOffline] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [chosen, setChosen] = useState<number|null>(null);
  const [showExp, setShowExp] = useState(false);
  const currentQ = QUIZ_QUESTIONS[quizIdx];

  const send = (text: string) => {
    if (!text.trim() || thinking || offline) return;
    setMsgs(m => [...m, { id:Date.now(), me:true, text }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      const found = BOT_ANSWERS[text];
      const res = found ?? BOT_DEFAULT;
      setMsgs(m => [...m, { id:Date.now()+1, me:false, text:res.text, source:res.source }]);
    }, 1200);
  };

  const startQuiz = () => { setMode("quiz"); setQuizIdx(0); setChosen(null); setShowExp(false); };
  const nextQ = () => { setChosen(null); setShowExp(false); setQuizIdx(i => Math.min(QUIZ_QUESTIONS.length-1, i+1)); };

  return (
    <div className="fixed bottom-24 right-6 z-50 w-80 bg-card border border-border rounded-3xl shadow-2xl flex flex-col overflow-hidden" style={{ height:490 }}>
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-primary flex-shrink-0">
        <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center"><Bot className="w-5 h-5 text-white" /></div>
        <div className="flex-1">
          <p className="text-white font-bold text-sm">CePiBot</p>
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${offline ? "bg-red-400" : thinking ? "bg-yellow-400 animate-pulse" : "bg-green-400"}`} />
            <p className="text-green-200 text-xs">{offline ? "Indisponível" : thinking ? "Pensando..." : "Online"}</p>
          </div>
        </div>
        <button onClick={() => setOffline(o=>!o)} className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center" title="Simular status offline">
          <Info className="w-4 h-4 text-white/50" />
        </button>
        <button onClick={onClose}><X className="w-5 h-5 text-white/70" /></button>
      </div>

      <div className="flex border-b border-border flex-shrink-0">
        <button onClick={() => setMode("chat")} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold transition-colors ${mode==="chat" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}>
          <HelpCircle className="w-3.5 h-3.5" /> Tirar dúvida
        </button>
        <button onClick={startQuiz} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold transition-colors ${mode==="quiz" ? "text-accent border-b-2 border-accent" : "text-muted-foreground hover:text-foreground"}`}>
          <FileText className="w-3.5 h-3.5" /> Gerar simulado
        </button>
      </div>

      {offline && (
        <div className="mx-3 mt-3 flex-shrink-0 bg-red-50 border border-red-200 rounded-xl p-3 space-y-2">
          <p className="text-xs text-red-800 font-semibold">CePiBot está temporariamente indisponível.</p>
          <p className="text-xs text-red-700">Enquanto isso, consulte a Biblioteca ou fale com seu professor no Feed.</p>
          <button onClick={() => setOffline(false)} className="flex items-center gap-1.5 text-xs font-bold text-red-700 hover:text-red-900 transition-colors"><RefreshCw className="w-3.5 h-3.5" /> Tentar novamente</button>
        </div>
      )}

      {!offline && mode==="chat" && (
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {msgs.map(m => (
            <div key={m.id} className={`flex ${m.me ? "justify-end" : "justify-start"}`}>
              <div className="max-w-[85%] space-y-1">
                <div className={`px-3 py-2 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${m.me ? "bg-primary text-white rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm"}`}>{m.text}</div>
                {!m.me && m.source && (
                  <div className="flex items-center gap-1 px-1"><BookOpen className="w-3 h-3 text-muted-foreground" /><span className="text-xs text-muted-foreground">📚 {m.source}</span></div>
                )}
              </div>
            </div>
          ))}
          {thinking && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">CePiBot está pensando</span>
                {[0,1,2].map(i => <div key={i} className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay:`${i*150}ms` }} />)}
              </div>
            </div>
          )}
          {msgs.length===1 && !thinking && (
            <div className="space-y-1 mt-1">
              {BOT_QUICK.map(q => <button key={q} onClick={() => send(q)} className="w-full text-left text-xs bg-secondary text-secondary-foreground rounded-xl px-3 py-2 hover:bg-primary hover:text-white transition-colors">{q}</button>)}
            </div>
          )}
        </div>
      )}

      {!offline && mode==="quiz" && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="flex items-center justify-between"><span className="text-xs font-bold text-muted-foreground">{currentQ.subject} · {currentQ.bimester}</span><span className="text-xs font-bold text-muted-foreground">{quizIdx+1}/{QUIZ_QUESTIONS.length}</span></div>
          <p className="text-sm font-bold text-foreground leading-snug">{currentQ.q}</p>
          <div className="space-y-2">
            {currentQ.opts.map((opt, i) => {
              const isChosen = chosen===i;
              const isCorrect = i===currentQ.answer;
              const showResult = chosen!==null;
              let cls = "border-border hover:border-primary/40";
              if (showResult && isCorrect) cls = "border-green-500 bg-green-50";
              else if (showResult && isChosen && !isCorrect) cls = "border-red-400 bg-red-50";
              return (
                <button key={i} onClick={() => chosen===null && setChosen(i)} disabled={chosen!==null}
                  className={`w-full flex items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-left text-xs font-semibold transition-all ${cls}`}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-xs font-black ${showResult && isCorrect ? "border-green-500 bg-green-500 text-white" : showResult && isChosen ? "border-red-400 bg-red-400 text-white" : isChosen ? "border-primary bg-primary text-white" : "border-border"}`}>
                    {String.fromCharCode(65+i)}
                  </div>
                  {opt}
                </button>
              );
            })}
          </div>
          {chosen!==null && !showExp && <button onClick={() => setShowExp(true)} className="w-full text-xs font-bold text-primary bg-secondary rounded-xl py-2.5 hover:bg-primary hover:text-white transition-colors">Ver gabarito e explicação</button>}
          {showExp && (
            <div className="bg-muted/50 border border-border rounded-xl p-3 space-y-2">
              <p className="text-xs font-black text-foreground">{chosen===currentQ.answer ? "✅ Correto!" : `❌ Incorreto — resposta: ${String.fromCharCode(65+currentQ.answer)}`}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{currentQ.explanation}</p>
              <p className="text-xs text-primary font-semibold">📚 {currentQ.topic}</p>
              {quizIdx<QUIZ_QUESTIONS.length-1 ? <button onClick={nextQ} className="w-full text-xs font-bold bg-primary text-white rounded-xl py-2 hover:bg-[#085a30] transition-colors">Próxima questão →</button> : <p className="text-xs font-bold text-green-700 text-center">🎉 Simulado concluído!</p>}
            </div>
          )}
        </div>
      )}

      {mode==="chat" && (
        <div className="flex items-center gap-2 px-3 py-3 border-t border-border flex-shrink-0">
          <input className="flex-1 bg-muted rounded-2xl px-3 py-2 text-xs outline-none disabled:opacity-50"
            placeholder={offline ? "CePiBot indisponível..." : "Pergunte algo..."}
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key==="Enter" && send(input)}
            disabled={offline||thinking} />
          <button onClick={() => send(input)} disabled={!input.trim()||offline||thinking} className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-40"><Send className="w-3.5 h-3.5 text-white" /></button>
        </div>
      )}
    </div>
  );
}
