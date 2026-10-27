import type { LibrarySubject } from "@/app/types";

export const LIBRARY: Record<string, LibrarySubject> = {
  "Matemática": { col:"#0a6b38", bg:"#e6f4ec", icon:"📐", bimesters:[
    { name:"1º Bimestre", topics:[{ name:"Números naturais", files:[{n:"Apostila Cap.1.pdf",type:"pdf"},{n:"Videoaula: Numerais",type:"video"}] },{ name:"Adição e subtração", files:[{n:"Explicação passo a passo.pdf",type:"pdf"},{n:"Videoaula: Conta armada",type:"video"}] }]},
    { name:"2º Bimestre", topics:[{ name:"Frações equivalentes", files:[{n:"Frações - Parte 1.pdf",type:"pdf"},{n:"Videoaula: Frações",type:"video"},{n:"Exercícios.pdf",type:"pdf"}] },{ name:"MMC e MDC", files:[{n:"Método da decomposição.pdf",type:"pdf"},{n:"Videoaula: MMC fácil",type:"video"}] },{ name:"Decimais e porcentagem", files:[{n:"Porcentagem no dia a dia.pdf",type:"pdf"},{n:"Videoaula: Decimais",type:"video"}] }]},
    { name:"3º Bimestre", topics:[{ name:"Geometria plana", files:[{n:"Figuras geométricas.pdf",type:"pdf"},{n:"Videoaula: Polígonos",type:"video"}] },{ name:"Perímetro e área", files:[{n:"Fórmulas de área.pdf",type:"pdf"},{n:"Lista de exercícios.pdf",type:"pdf"}] }]},
    { name:"4º Bimestre", topics:[{ name:"Estatística básica", files:[{n:"Tabelas e gráficos.pdf",type:"pdf"},{n:"Videoaula: Média",type:"video"}] },{ name:"Revisão geral", files:[{n:"Simulado 4º bimestre.pdf",type:"pdf"},{n:"Gabarito simulado.pdf",type:"pdf"}] }]},
  ]},
  "Português": { col:"#003087", bg:"#e8eef8", icon:"📝", bimesters:[
    { name:"1º Bimestre", topics:[{ name:"Ortografia e acentuação", files:[{n:"Regras ortográficas.pdf",type:"pdf"},{n:"Videoaula: Acentuação",type:"video"}] }]},
    { name:"2º Bimestre", topics:[{ name:"Substantivos e artigos", files:[{n:"Classes de palavras.pdf",type:"pdf"},{n:"Videoaula: Substantivos",type:"video"}] },{ name:"Adjetivos e pronomes", files:[{n:"Adjetivos.pdf",type:"pdf"}] }]},
    { name:"3º Bimestre", topics:[{ name:"Verbos e conjugações", files:[{n:"Tabela de verbos.pdf",type:"pdf"},{n:"Videoaula: Conjugação",type:"video"}] },{ name:"Concordância verbal", files:[{n:"Regras de concordância.pdf",type:"pdf"},{n:"Exercícios.pdf",type:"pdf"}] }]},
    { name:"4º Bimestre", topics:[{ name:"Redação dissertativa", files:[{n:"Guia de redação.pdf",type:"pdf"},{n:"Videoaula: Como escrever",type:"video"},{n:"Redações modelo.pdf",type:"pdf"}] },{ name:"Interpretação de texto", files:[{n:"Estratégias de leitura.pdf",type:"pdf"}] }]},
  ]},
  "Ciências": { col:"#3a9d5c", bg:"#edf7f1", icon:"🔬", bimesters:[
    { name:"1º Bimestre", topics:[{ name:"Seres vivos e classificação", files:[{n:"Reinos dos seres vivos.pdf",type:"pdf"},{n:"Videoaula: Taxonomia",type:"video"}] },{ name:"A célula", files:[{n:"Estrutura celular.pdf",type:"pdf"}] }]},
    { name:"2º Bimestre", topics:[{ name:"Fotossíntese e respiração", files:[{n:"Fotossíntese - Slides.pdf",type:"pdf"},{n:"Videoaula: Fotossíntese",type:"video"},{n:"Caderno de experimentos.pdf",type:"pdf"}] }]},
    { name:"3º Bimestre", topics:[{ name:"Sistema solar", files:[{n:"Planetas do sistema solar.pdf",type:"pdf"},{n:"Videoaula: Astronomia",type:"video"}] },{ name:"Clima e tempo", files:[{n:"Fenômenos climáticos.pdf",type:"pdf"}] }]},
    { name:"4º Bimestre", topics:[{ name:"Física básica", files:[{n:"Força e movimento.pdf",type:"pdf"},{n:"Videoaula: Física iniciantes",type:"video"}] },{ name:"Química básica", files:[{n:"Elementos e misturas.pdf",type:"pdf"}] }]},
  ]},
  "História": { col:"#c0392b", bg:"#faeae9", icon:"🏛️", bimesters:[
    { name:"1º Bimestre", topics:[{ name:"Pré-história e civilizações antigas", files:[{n:"Pré-história.pdf",type:"pdf"},{n:"Videoaula: Egito antigo",type:"video"}] }]},
    { name:"2º Bimestre", topics:[{ name:"Grécia e Roma antigas", files:[{n:"Grécia antiga.pdf",type:"pdf"},{n:"Videoaula: Democracia",type:"video"}] },{ name:"Idade Média", files:[{n:"Feudalismo.pdf",type:"pdf"}] }]},
    { name:"3º Bimestre", topics:[{ name:"Grandes navegações", files:[{n:"Os descobrimentos.pdf",type:"pdf"},{n:"Videoaula: Brasil 1500",type:"video"},{n:"Linha do tempo.pdf",type:"pdf"}] }]},
    { name:"4º Bimestre", topics:[{ name:"Revolução Industrial", files:[{n:"Revolução Industrial.pdf",type:"pdf"},{n:"Videoaula: Impactos",type:"video"}] },{ name:"Brasil imperial e República", files:[{n:"Período imperial.pdf",type:"pdf"}] }]},
  ]},
  "Geografia": { col:"#1a5276", bg:"#e8f0f6", icon:"🌍", bimesters:[
    { name:"1º Bimestre", topics:[{ name:"Orientação e mapas", files:[{n:"Rosa dos ventos.pdf",type:"pdf"},{n:"Videoaula: Cartografia",type:"video"}] },{ name:"Brasil físico", files:[{n:"Relevo brasileiro.pdf",type:"pdf"}] }]},
    { name:"2º Bimestre", topics:[{ name:"Biomas brasileiros", files:[{n:"Os 6 biomas.pdf",type:"pdf"},{n:"Videoaula: Amazônia",type:"video"},{n:"Mapa dos biomas.pdf",type:"pdf"}] }]},
    { name:"3º Bimestre", topics:[{ name:"Regiões brasileiras", files:[{n:"As 5 regiões.pdf",type:"pdf"},{n:"Videoaula: Norte e Nordeste",type:"video"}] }]},
    { name:"4º Bimestre", topics:[{ name:"Globalização e meio ambiente", files:[{n:"Globalização.pdf",type:"pdf"},{n:"Videoaula: Sustentabilidade",type:"video"}] }]},
  ]},
};
