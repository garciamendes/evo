<img src="public/logo.svg" alt="Study Hub" height="48">

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
- **Progresso** (checklists, modo, diário): fica no `localStorage` e, com login, é espelhado em `progresso.json` no repositório privado de dados. Sem login, não sincroniza entre aparelhos.
- **Respostas**: com login, cada exercício tem uma caixa de resposta. Ela salva `respostas/<id>.json` no repositório de dados. A correção é escrita em `correcoes/<id>.md` (primeira linha `<!-- revisao: N -->`) e aparece embaixo da resposta.
- **Deveres de código**: pasta `homework/`, entregues por PR (veja `homework/README.md`).

## Login e repositório de dados

O login usa o GitHub só para confirmar quem é você. Os dados ficam num repositório **privado** separado, acessado por um token restrito a ele. O repositório `evo` é público, então nada pessoal fica nele.

1. **Repositório de dados:** crie o repositório privado `evo-dados` no GitHub, marcando "Add a README".
2. **Token:** em GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens, crie um token com *Repository access: Only select repositories → evo-dados* e *Permissions → Contents: Read and write*.
3. **OAuth App:** em GitHub → Settings → Developer settings → OAuth Apps → New OAuth App, use:
   - Homepage URL: `https://<seu-dominio>.vercel.app`
   - Authorization callback URL: `https://<seu-dominio>.vercel.app/api/auth/callback`

   Depois gere um *client secret*.
4. **Vercel:** em Project → Settings → Environment Variables, cadastre as variáveis de `.env.example` e faça um novo deploy.

Para rodar localmente com login, crie outro OAuth App com callback `http://localhost:3000/api/auth/callback` e coloque as variáveis em `.env.local`.

## Correção automática

Duas GitHub Actions chamam o Claude:

- `garciamendes/evo-dados`, `.github/workflows/corrigir.yml`: quando o site salva uma resposta enviada, corrige as pendentes seguindo `CORRECAO.md` e faz commit em `correcoes/`.
- Este repositório, `.github/workflows/corrigir-dever.yml`: quando um PR mexe em `homework/`, revisa o dever com comentários no PR.

Cada repositório precisa de um secret: `CLAUDE_CODE_OAUTH_TOKEN` (gerado com `claude setup-token`, usa a assinatura Pro/Max) ou `ANTHROPIC_API_KEY` (cobrado por uso). Sem o secret, as Actions só avisam e não fazem nada.

## Rodando localmente

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
```

## Deploy

A Vercel faz o deploy a cada push na `main` e gera um link de preview para cada PR. O GitHub Actions roda lint e build em cada push e PR.
