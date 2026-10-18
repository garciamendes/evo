import type { Homework } from "./types";

// Status is updated here after each review: aberto -> entregue (PR open) -> corrigido (PR reviewed).
export const HOMEWORK: Homework[] = [
  {
    id: "h01",
    number: 1,
    title: "Sessão 01: modelo, to be e prompt",
    status: "corrigido",
    track: "programacao",
    folder: "Entregue pelo chat",
    branch: "-",
    summary: "Raciocínio sobre o modelo Transaction, 5 frases com to be e reescrita de um prompt.",
    requirements: ["Responder as 4 perguntas do desafio c01", "5 frases com am/is", "Prompt com os 5 elementos"],
    acceptance: ["Todas as respostas entregues e revisadas"],
    challengeId: "c01",
    feedback:
      "Bom raciocínio sobre categoria e tipo explícito. Pontos para revisar: confirmar o escopo antes de modelar, DecimalField para dinheiro, ForeignKey em vez de M2M, am vs have.",
  },
  {
    id: "h02",
    number: 2,
    title: "Modelos Category e Transaction",
    status: "aberto",
    track: "programacao",
    folder: "homework/financas/backend",
    branch: "dever/02-modelos",
    summary: "Criar o projeto Django do app de finanças e implementar os dois modelos com testes.",
    requirements: [
      "Projeto Django em homework/financas/backend com o app transactions",
      "Modelos conforme o desafio c02",
      "Registrar os modelos no admin",
      "Testes em transactions/tests.py",
      "requirements.txt com as dependências",
    ],
    acceptance: [
      "python manage.py migrate roda sem erro",
      "python manage.py test passa",
      "Explicação curta no corpo do PR: o on_delete escolhido e por quê",
    ],
    challengeId: "c02",
  },
];
