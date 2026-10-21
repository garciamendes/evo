import type { AiStage } from "./types";

export const AI_STAGES: AiStage[] = [
  {
    id: "ai-1",
    stage: 1,
    title: "Fundamentos",
    goal: "Entender o que um LLM é, o que ele não é, e por que toda resposta precisa ser verificada.",
    lessons: [
      {
        title: "IA, machine learning e LLMs",
        points: [
          "Machine learning: o sistema aprende padrões a partir de exemplos, em vez de regras escritas à mão.",
          "Um LLM (large language model) foi treinado em muito texto para prever a próxima palavra.",
          "Ele não consulta um banco de verdades: gera o texto mais provável para o contexto.",
          "Modelo ≠ aplicação: o ChatGPT é uma aplicação; o GPT é o modelo dentro dela.",
        ],
      },
      {
        title: "Tokens e janela de contexto",
        points: [
          "O modelo lê pedaços de texto chamados tokens (mais ou menos ¾ de uma palavra em inglês).",
          "A janela de contexto é o limite de tokens que ele enxerga de uma vez: prompt, histórico e resposta.",
          "Em conversas longas, as informações antigas podem sair da janela ou perder peso.",
          "Mais contexto relevante = respostas melhores; contexto irrelevante atrapalha.",
        ],
      },
      {
        title: "Alucinação e verificação",
        points: [
          "Alucinação: uma resposta confiante e errada (uma função que não existe, uma lei inventada).",
          "Verifique com documentação oficial, rodando o código e escrevendo testes.",
          "Sinais de alerta: muita certeza, nenhum caminho para conferir, APIs que você nunca viu.",
        ],
      },
    ],
    exercise: {
      title: "Explique com suas palavras",
      task: "No diário, responda em até 5 linhas: o que é um token, o que é a janela de contexto e por que uma resposta da IA pode estar errada mesmo soando certa.",
      criteria: ["Sem copiar definições", "Um exemplo do seu trabalho", "Uma forma concreta de verificar"],
    },
  },
  {
    id: "ai-2",
    stage: 2,
    title: "Fundamentos de prompt",
    goal: "Escrever prompts com objetivo, contexto, restrições, formato e critério de qualidade.",
    lessons: [
      {
        title: "Os 5 elementos",
        points: [
          "Objetivo: o que você quer, numa frase.",
          "Contexto: o projeto, a stack, o seu nível, o que já tentou.",
          "Restrições: o que a IA não deve fazer (ex.: \"não me dê o código completo\").",
          "Formato: como a resposta deve vir (lista, tabela, passos, perguntas).",
          "Critério: como você vai julgar se a resposta é boa; precisa ser verificável.",
        ],
      },
      {
        title: "Fraco vs forte",
        points: [
          "Fraco: \"faz um model de transação em django\".",
          "Forte: objetivo + contexto do app de finanças + \"use DecimalField, não mostre código\" + \"tabela campo/tipo/justificativa\" + \"aponte 1 caso de borda\".",
          "\"Perfeito\" ou \"de alta qualidade\" não são critérios: diga o que torna a resposta boa.",
          "Peça o que a IA consegue fazer: ela não monitora leis nem sabe do seu código se você não mostrar.",
        ],
      },
      {
        title: "Exemplos e decomposição",
        points: [
          "Um exemplo do formato esperado vale mais que um parágrafo explicando.",
          "Contraexemplo: mostre o que você não quer.",
          "Tarefas grandes: peça primeiro um plano, depois execute um passo de cada vez.",
        ],
      },
    ],
    exercise: {
      title: "Reescreva o prompt",
      task: "Reescreva \"me ajuda com a API de transações\" usando os 5 elementos, para que a IA te dê dicas e não a solução.",
      criteria: ["Os 5 elementos presentes", "O escopo é o app de finanças (registro, não banco)", "Critério verificável"],
    },
  },
  {
    id: "ai-3",
    stage: 3,
    title: "Prompt avançado",
    goal: "Usar prompts estruturados para planejar, revisar, debugar, testar e refatorar.",
    lessons: [
      {
        title: "Prompts por tipo de tarefa",
        points: [
          "Debug: erro completo, passos para reproduzir, o que esperava, o que já testou.",
          "Revisão: o diff + os critérios (correção, legibilidade, segurança, testes).",
          "Testes: peça casos de borda antes do código dos testes.",
          "Refatoração: \"mantenha o comportamento; os testes atuais devem continuar passando\".",
          "Código desconhecido: \"explique o fluxo desta função antes de sugerir mudanças\".",
        ],
      },
      {
        title: "Avaliar a resposta",
        points: [
          "Pergunte: isso resolve o problema que eu descrevi, ou outro parecido?",
          "Confira os imports, as versões e se as APIs citadas existem.",
          "Rode o código e os testes antes de aceitar.",
          "Desconfie de soluções muito maiores que o problema.",
        ],
      },
    ],
    exercise: {
      title: "Seu template pessoal",
      task: "Crie um template de prompt de debug que você vai reutilizar e teste-o num bug real.",
      criteria: ["Campos para erro, reprodução, esperado e tentado", "Pede hipóteses antes da correção", "Usado em um caso real"],
    },
  },
  {
    id: "ai-4",
    stage: 4,
    title: "Engenharia de software com IA",
    goal: "Usar a IA para acelerar sem perder a capacidade de entender e manter o código.",
    lessons: [
      {
        title: "Fluxo profissional",
        points: [
          "Analise o código existente antes de pedir mudanças.",
          "Planeje a feature e quebre em mudanças pequenas e revisáveis.",
          "Revise todo diff gerado como se fosse de um colega júnior.",
          "Rode os testes e procure regressões antes do commit.",
        ],
      },
      {
        title: "Segurança e dados",
        points: [
          "Nunca cole chaves de API, senhas ou dados pessoais de clientes.",
          "Troque dados reais por exemplos fictícios.",
          "Confira as políticas da empresa sobre o uso de IA com código interno.",
        ],
      },
    ],
    exercise: {
      title: "Revisar um diff de IA",
      task: "Peça a uma IA uma pequena mudança no app de finanças e revise o diff com a lista de critérios antes de aceitar.",
      criteria: ["Pelo menos 1 problema encontrado ou justificativa de por que está correto", "Testes rodados", "Anotação no diário"],
    },
  },
  {
    id: "ai-5",
    stage: 5,
    title: "Fundamentos de IA na prática",
    goal: "Entender embeddings, busca semântica, RAG, tool calling e agentes.",
    lessons: [
      {
        title: "Embeddings e busca semântica",
        points: [
          "Embedding: um vetor de números que representa o significado de um texto.",
          "Textos com significado parecido têm vetores próximos.",
          "Busca semântica: encontrar \"supermercado\" quando você procura \"compras de comida\".",
        ],
      },
      {
        title: "RAG, ferramentas e agentes",
        points: [
          "RAG: buscar documentos relevantes e colocá-los no prompt antes de gerar a resposta.",
          "Tool calling: o modelo pede para chamar uma função sua (ex.: buscar_transacoes).",
          "Agente: um modelo em loop, decidindo quais ferramentas usar; poderoso, mas pode errar em cadeia.",
          "Saída estruturada: pedir JSON com um schema para o código consumir com segurança.",
        ],
      },
    ],
    exercise: {
      title: "RAG no app de finanças",
      task: "Descreva como um assistente responderia \"quanto gastei com mercado em setembro?\" usando tool calling ou RAG.",
      criteria: ["Qual dado é buscado", "Qual ferramenta ou função é chamada", "Como verificar se a resposta está certa"],
    },
  },
  {
    id: "ai-6",
    stage: 6,
    title: "Integrando IA em aplicações",
    goal: "Integrar uma API de IA no Django com segurança, testes e tratamento de erros.",
    lessons: [
      {
        title: "Pré-requisitos",
        points: [
          "HTTP: métodos, status codes, headers e body JSON.",
          "Autenticação com chave de API em variável de ambiente, nunca no frontend nem no git.",
          "Timeouts, retries e rate limits.",
          "Testes com mock: sucesso, entrada inválida, erro da API e timeout.",
        ],
      },
      {
        title: "Primeira feature",
        points: [
          "Sugerir a categoria de uma transação a partir da descrição.",
          "O backend Django chama a API; o React só chama o seu backend.",
          "O usuário confirma a sugestão: a IA ajuda, não decide sozinha.",
        ],
      },
    ],
    exercise: {
      title: "Desenhar a integração",
      task: "Escreva o plano da feature de sugestão de categoria: endpoint, entrada, saída, erros e testes.",
      criteria: ["A chave fica só no backend", "Lista de casos de teste com mocks", "Comportamento definido quando a API falha"],
    },
  },
];
