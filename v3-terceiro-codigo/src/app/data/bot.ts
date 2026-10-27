export const BOT_QUICK = ["Explica MMC e MDC","O que é fotossíntese?","Dicas para redação","Resumo da Revolução Industrial","Onde acho materiais de Ciências?"];

export const BOT_ANSWERS: Record<string, { text:string; source:string }> = {
  "Explica MMC e MDC":             { text:"📐 MMC é o menor número divisível por dois ou mais números.\nEx: MMC(4,6) = 12\n\nMDC é o maior divisor comum.\nEx: MDC(12,8) = 4\n\nAcesse Biblioteca > Matemática > 2º Bimestre!", source:"Matemática › 2º Bimestre › MMC e MDC" },
  "O que é fotossíntese?":         { text:"🌱 Fotossíntese é o processo pelo qual plantas produzem alimento:\n• Luz solar + Água + CO₂ → glicose + O₂\n\nVeja a videoaula em Biblioteca > Ciências > 2º Bimestre!", source:"Ciências › 2º Bimestre › Fotossíntese e respiração" },
  "Dicas para redação":            { text:"✏️ 5 dicas para redação:\n1. Leia o tema com atenção\n2. Faça um rascunho\n3. Introdução, desenvolvimento e conclusão\n4. Use conectivos (porém, contudo, além disso)\n5. Revise a ortografia!\n\nMateriais: Biblioteca > Português > 4º Bimestre", source:"Português › 4º Bimestre › Redação dissertativa" },
  "Resumo da Revolução Industrial": { text:"🏭 Revolução Industrial (séc. XVIII, Inglaterra):\n• Máquinas substituem o trabalho manual\n• Surgimento das fábricas\n• Carvão como energia principal\n• Crescimento das cidades\n\nVeja em Biblioteca > História > 4º Bimestre!", source:"História › 4º Bimestre › Revolução Industrial" },
  "Onde acho materiais de Ciências?": { text:"🔬 Materiais de Ciências:\n📁 1º Bim: Seres vivos, Célula\n📁 2º Bim: Fotossíntese, Nutrição\n📁 3º Bim: Sistema solar, Clima\n📁 4º Bim: Física e Química\n\nClique em Biblioteca no menu!", source:"Ciências › Todos os Bimestres" },
};

export const BOT_DEFAULT = { text:"Boa pergunta! Recomendo verificar na **Biblioteca** os materiais da matéria correspondente. Se precisar de mais ajuda, fale com seu professor pelo feed. 📚", source:"Biblioteca › Pesquisa geral" };

export const QUIZ_QUESTIONS = [
  { id:1, subject:"Matemática", bimester:"2º Bimestre", topic:"Frações equivalentes",
    q:"Qual é o resultado de ³⁄₄ + ¹⁄₆?", opts:["11/12","4/10","5/8","7/12"], answer:0,
    explanation:"Para somar frações com denominadores diferentes, encontramos o MMC(4,6) = 12. Convertemos: ³⁄₄ = ⁹⁄₁₂ e ¹⁄₆ = ²⁄₁₂. Logo: ⁹⁄₁₂ + ²⁄₁₂ = ¹¹⁄₁₂." },
  { id:2, subject:"Ciências", bimester:"2º Bimestre", topic:"Fotossíntese",
    q:"O que as plantas produzem durante a fotossíntese?", opts:["CO₂ e água","Glicose e O₂","Nitrogênio e glicose","Proteínas e O₂"], answer:1,
    explanation:"Na fotossíntese, as plantas usam luz solar, água e CO₂ para produzir glicose (açúcar) e liberar oxigênio (O₂) como subproduto." },
  { id:3, subject:"Português", bimester:"3º Bimestre", topic:"Concordância verbal",
    q:"Qual sentença está com a concordância verbal correta?",
    opts:["Fazem dois anos que não vejo você.","Faz dois anos que não vejo você.","Fazem dois anos que não vi você.","Faz dois anos que não vi vocês."], answer:1,
    explanation:"O verbo 'fazer' indicando tempo decorrido é impessoal — fica na 3ª pessoa do singular: 'Faz dois anos' está correto." },
];
