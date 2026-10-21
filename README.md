# Study Hub

Sistema pessoal de estudos de programação, inglês e IA, feito em Next.js (App Router), React, TypeScript e Tailwind.

## Seções

| Rota | Conteúdo |
|---|---|
| `/` | Atividades do dia, com modo normal (60–120 min) ou mínimo (10–20 min) |
| `/roadmap` | Roteiro de 30 dias (6 semanas de 5 dias) |
| `/programacao` | Desafios com requisitos, critérios de aceite e dicas progressivas |
| `/ingles` | Unidades A1 com vocabulário, leitura, escuta (voz do navegador) e exercícios |
| `/ia` | Trilha de IA em 6 etapas |
| `/deveres` | Deveres de casa entregues por Pull Request |
| `/diario` | Anotações, dificuldades e perguntas |
| `/progresso` | Marcos, contadores e exportar/importar dados |

## Onde ficam os dados

- **Conteúdo** (roteiro, lições, desafios, deveres): `src/content/*.ts`, atualizado a cada sessão.
- **Progresso** (checklists, modo, diário): `localStorage` do navegador. **Não sincroniza entre aparelhos.** Use exportar/importar em `/progresso` para mover os dados.
- **Deveres**: pasta `homework/`, entregues por PR (veja `homework/README.md`).

## Rodando localmente

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
```

## Deploy

A Vercel faz o deploy a cada push na `main` e gera um link de preview para cada PR. O GitHub Actions roda lint e build em cada push e PR.
