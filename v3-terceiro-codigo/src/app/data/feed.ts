import type { Teacher, Story, Post } from "@/app/types";

export const unsplash = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format`;

export const TEACHERS: Teacher[] = [
  { id:1, name:"Carlos Silva",   subj:"Matemática", ini:"CS", col:"#0a6b38", photo:"1601655781320-205e34c94eb1" },
  { id:2, name:"Ana Lima",       subj:"Português",  ini:"AL", col:"#003087", photo:"1590650213165-c1fef80648c4" },
  { id:3, name:"Marcos Reis",    subj:"Ciências",   ini:"MR", col:"#3a9d5c", photo:"1574281570877-bd815ebb50a4" },
  { id:4, name:"Julia Santos",   subj:"História",   ini:"JS", col:"#c0392b", photo:"1573496799652-408c2ac9fe98" },
  { id:5, name:"Fernanda Costa", subj:"Geografia",  ini:"FC", col:"#1a5276", photo:"1590649880765-91b1956b8276" },
];

export const GUARDIANS = [
  { name:"Ana",   children:[{ name:"Arthur", grade:"5º Ano", turma:"B" },{ name:"João", grade:"4º Ano", turma:"A" }] },
  { name:"Pedro", children:[{ name:"Maria",  grade:"6º Ano", turma:"C" }] },
  { name:"Igor",  children:[{ name:"Renato", grade:"7º Ano", turma:"A" },{ name:"Kalebe", grade:"5º Ano", turma:"B" },{ name:"Yana", grade:"3º Ano", turma:"D" }] },
];

export const INIT_STORIES: Story[] = [
  { id:1, t:TEACHERS[0], viewed:false, img:"1635372722656-389f87a941b7", caption:"Resolução de equações no quadro hoje! 📐 Guardem esse método." },
  { id:2, t:TEACHERS[1], viewed:false, img:"1676302447092-14a103558511",  caption:"Exercício de redação — tema: tecnologia na escola ✏️" },
  { id:3, t:TEACHERS[2], viewed:true,  img:"1466611653911-95081537e5b7",  caption:"Resultado incrível do experimento com plantas! 🌱" },
  { id:4, t:TEACHERS[3], viewed:false, img:"1461360370896-922624d12aa1",  caption:"Visitamos o museu virtual da Revolução Industrial hoje 🏭" },
  { id:5, t:TEACHERS[4], viewed:false, img:"1655157639280-a8e4594d98ac",  caption:"Mapa dos biomas que desenhamos juntos na aula 🌍" },
];

export const INIT_POSTS: Post[] = [
  { id:1, t:TEACHERS[0], age:"há 2h", subj:"Matemática",
    body:"Exercícios de frações para o 5º Ano B! Para somar frações com denominadores diferentes, precisamos encontrar o MMC. Revisão amanhã — tragam as dúvidas! 📚",
    img:"1635372722656-389f87a941b7", likes:24, liked:false,
    comments:[{ id:1, user:"Ana Clara", text:"Entendi, prof! Muito obrigada! 😊", age:"1h" },{ id:2, user:"Pedro H.", text:"Posso tirar dúvida amanhã antes da aula?", age:"45min" }] },
  { id:2, t:TEACHERS[1], age:"há 4h", subj:"Português",
    body:"📖 Redação desta semana: 'O impacto das redes sociais na educação'. Mínimo 20 linhas. Entrega: sexta-feira!",
    img:"1514369118554-e20d93546b30", likes:18, liked:true,
    comments:[{ id:1, user:"Maria F.", text:"Já comecei! Que tema atual e interessante 📝", age:"3h" }] },
  { id:3, t:TEACHERS[2], age:"há 1 dia", subj:"Ciências",
    body:"🔬 Experimento da semana: observe uma planta por 3 dias, anote as mudanças e tire fotos a cada dia! Traga o registro na próxima aula.",
    img:"1416879595882-3373a0480b5b", likes:31, liked:false, comments:[] },
  { id:4, t:TEACHERS[3], age:"há 2 dias", subj:"História",
    body:"🏛️ Iniciamos hoje o módulo sobre a Revolução Industrial. Assistam o documentário indicado no link da biblioteca antes da próxima aula!",
    img:"1510531704581-5b2870972060", likes:15, liked:false, comments:[] },
];

export const SHORTS_DATA = [
  { id:1, t:TEACHERS[0], title:"Como calcular o MMC rapidinho! Método fácil para o 5º ano", views:"1.2k", likes:89, dur:"1:30", img:"1636466497217-26a8cbeaf0aa" },
  { id:2, t:TEACHERS[2], title:"Fotossíntese explicada em menos de 1 minuto! 🌱", views:"980", likes:67, dur:"0:58", img:"1466611653911-95081537e5b7" },
  { id:3, t:TEACHERS[1], title:"Dica rápida: uso correto da vírgula em 3 regras", views:"756", likes:54, dur:"1:12", img:"1676302447092-14a103558511" },
  { id:4, t:TEACHERS[3], title:"Linha do tempo da Revolução Industrial — resumo visual", views:"612", likes:48, dur:"2:05", img:"1461360370896-922624d12aa1" },
  { id:5, t:TEACHERS[4], title:"Os 6 biomas do Brasil em 90 segundos! 🌍", views:"891", likes:73, dur:"1:28", img:"1655157639280-a8e4594d98ac" },
];
