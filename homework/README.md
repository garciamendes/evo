# Deveres de casa

Cada dever é entregue por **Pull Request** neste repositório. A correção acontece no próprio PR, com comentários linha a linha. Ela começa sozinha quando o PR é aberto ou recebe um push (Action `corrigir-dever`).

## Estrutura

- `financas/backend/`: app de finanças pessoais em Django (cresce dever a dever).
- `financas/frontend/`: interface em React (a partir da semana 3).
- `entregas/`: exercícios avulsos (desafios de entrevista, textos em inglês, prompts).

## Como entregar

```bash
git checkout main && git pull
git checkout -b dever/NN-nome
# faça o dever na pasta indicada no site (página Deveres de casa)
git add .
git commit -m "dever NN: descrição curta"
git push -u origin dever/NN-nome
```

Abra o PR com o título `Dever NN: título` e explique no corpo:

1. O que você fez.
2. O que foi difícil.
3. O que você gostaria que eu olhasse com mais atenção.

Nunca faça commit de senhas, chaves de API ou arquivos `.env`.

Esta pasta não entra no lint nem no build do site.
