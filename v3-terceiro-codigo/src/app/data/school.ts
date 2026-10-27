import { TEACHERS } from "@/app/data/feed";
import type { Activity } from "@/app/types";

export const GRADES_DATA = [
  { subj:"Matemática", col:"#0a6b38", b1:8.5, b2:7.8, b3:null, b4:null },
  { subj:"Português",  col:"#003087", b1:9.0, b2:8.5, b3:null, b4:null },
  { subj:"Ciências",   col:"#3a9d5c", b1:7.5, b2:8.0, b3:null, b4:null },
  { subj:"História",   col:"#c0392b", b1:8.0, b2:7.5, b3:null, b4:null },
  { subj:"Geografia",  col:"#1a5276", b1:9.5, b2:9.0, b3:null, b4:null },
  { subj:"Artes",      col:"#7d5a00", b1:10,  b2:9.5, b3:null, b4:null },
  { subj:"Ed. Física", col:"#0891b2", b1:9.0, b2:10,  b3:null, b4:null },
  { subj:"Inglês",     col:"#65a30d", b1:7.0, b2:7.5, b3:null, b4:null },
];

export const AGENDA_DATA = {
  days: ["Segunda","Terça","Quarta","Quinta","Sexta"],
  schedule: [
    { time:"07:30–08:20", classes:["Matemática","Português","Ciências","Matemática","Ed. Física"] },
    { time:"08:20–09:10", classes:["Português","Ciências","Matemática","História","Artes"] },
    { time:"09:10–09:30", classes:["Intervalo","Intervalo","Intervalo","Intervalo","Intervalo"] },
    { time:"09:30–10:20", classes:["Ciências","História","Português","Geografia","Matemática"] },
    { time:"10:20–11:10", classes:["História","Geografia","Inglês","Português","Ciências"] },
    { time:"11:10–12:00", classes:["Geografia","Inglês","Ed. Física","Inglês","História"] },
  ],
  events: [
    { date:"20/09", name:"Prova de Matemática",    col:"#0a6b38", type:"Prova" },
    { date:"23/09", name:"Entrega de Redação",     col:"#003087", type:"Entrega" },
    { date:"27/09", name:"Experimento — Ciências", col:"#3a9d5c", type:"Atividade" },
    { date:"30/09", name:"Simulado Geral",          col:"#c0392b", type:"Simulado" },
    { date:"05/10", name:"Início do 3º Bimestre",  col:"#1a5276", type:"Marco" },
  ],
};

export const CHAT_INIT = [
  { id:1, user:"Ana Clara", me:false, text:"Alguém fez o dever de matemática?",            h:"10:23", ini:"AC", col:"#003087" },
  { id:2, user:"Pedro H.",  me:false, text:"Sim! Mas a questão 5 tá complicada 😅",         h:"10:25", ini:"PH", col:"#3a9d5c" },
  { id:3, user:"Você",      me:true,  text:"Que parte vocês acharam mais difícil?",          h:"10:26", ini:"VC", col:"#0a6b38" },
  { id:4, user:"Maria F.",  me:false, text:"A de frações com denominadores diferentes! 😩", h:"10:28", ini:"MF", col:"#c0392b" },
  { id:5, user:"João V.",   me:false, text:"O prof Carlos mandou vídeo no Shorts! 🎬",      h:"10:30", ini:"JV", col:"#1a5276" },
  { id:6, user:"Larissa",   me:false, text:"Já vi! Recomendo muito 👏",                      h:"10:31", ini:"LP", col:"#7d5a00" },
];

export const CLASS_RANKING_DEMO = [
  { name:"Ana Clara",  exp:342, level:4 },
  { name:"João V.",    exp:289, level:3 },
  { name:"Larissa P.", exp:241, level:3 },
  { name:"Pedro H.",   exp:136, level:2 },
  { name:"Gabriel M.", exp:84,  level:1 },
];

export const ACTIVITIES_DATA: Activity[] = [
  { id:1, title:"Frações equivalentes — Exercícios", subject:"Matemática", teacher:TEACHERS[0], deadline:"22/09", type:"questoes", status:"pendente", expReward:20,
    questions:[
      { q:"Qual fração é equivalente a 1/2?", opts:["2/3","3/6","4/5","1/3"], answer:1 },
      { q:"Qual é o resultado de 2/3 + 1/6?", opts:["3/9","5/6","1/2","7/12"], answer:1 },
    ] },
  { id:2, title:"Redação: A tecnologia na educação", subject:"Português", teacher:TEACHERS[1], deadline:"23/09", type:"texto", status:"pendente", expReward:20 },
  { id:3, title:"Relatório do experimento com plantas", subject:"Ciências", teacher:TEACHERS[2], deadline:"20/09", type:"upload", status:"concluida", expReward:20 },
];
