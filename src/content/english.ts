import type { EnglishUnit } from "./types";

export const LISTENING_ROUTINE = [
  "Ouça sem ler a transcrição.",
  "Anote as palavras que você reconheceu.",
  "Ouça de novo lendo a transcrição.",
  "Repita cada frase em voz alta.",
  "Revise as palavras difíceis e a pronúncia.",
  "Ouça mais uma vez sem a transcrição.",
];

export const ENGLISH_UNITS: EnglishUnit[] = [
  {
    id: "e01",
    title: "Verbo to be (ser / estar)",
    skill: "Gramática",
    explanation: [
      "Em inglês, \"ser\" e \"estar\" são o mesmo verbo: to be.",
      "I am · you are · he/she/it is · we are · they are.",
      "Use to be com adjetivos (tired), substantivos (a developer) e idade (26 years old).",
      "Não use am antes de outro verbo: \"I am study\" está errado; o certo é \"I study\".",
    ],
    examples: [
      { en: "I am a developer.", pt: "Eu sou desenvolvedor.", pron: "ai ém a di-VÉ-lo-per" },
      { en: "I am tired.", pt: "Eu estou cansado.", pron: "ai ém TÁI-erd" },
      { en: "Python is easy.", pt: "Python é fácil.", pron: "PÁI-ton iz Í-zi" },
      { en: "I am 26 years old.", pt: "Eu tenho 26 anos.", pron: "ai ém TUÊN-ti-siks íers ôuld" },
    ],
    vocabulary: [
      { en: "developer", pt: "desenvolvedor", pron: "di-VÉ-lo-per" },
      { en: "tired", pt: "cansado", pron: "TÁI-erd" },
      { en: "happy", pt: "feliz", pron: "RÉ-pi" },
      { en: "busy", pt: "ocupado", pron: "BÍ-zi" },
      { en: "easy / hard", pt: "fácil / difícil", pron: "Í-zi / rárd" },
    ],
    listening: ["I am a developer.", "I am tired today.", "The code is wrong.", "You are a student.", "She is happy."],
    exercise: {
      instructions: "Escreva 5 frases sobre você usando am ou is.",
      items: ["I am ___.", "My name is ___.", "I am ___ years old.", "I work at ___.", "Today I am ___."],
    },
  },
  {
    id: "e02",
    title: "Pronomes e have / has (ter)",
    skill: "Gramática",
    explanation: [
      "have = ter. Com he / she / it, vira has.",
      "I have · you have · he/she/it has · we have · they have.",
      "Nunca junte am + have: \"I am have\" está errado; o certo é \"I have\".",
      "Use a antes de um substantivo singular: I have a car.",
    ],
    examples: [
      { en: "I have a girlfriend.", pt: "Eu tenho uma namorada.", pron: "ai rév a GUÉRL-frend" },
      { en: "She has two kids.", pt: "Ela tem dois filhos.", pron: "xi réz tchu kidz" },
      { en: "We have a meeting.", pt: "Nós temos uma reunião.", pron: "uí rév a MÍ-tin" },
      { en: "The app has a bug.", pt: "O app tem um bug.", pron: "di ép réz a bâg" },
    ],
    vocabulary: [
      { en: "have / has", pt: "ter / tem", pron: "rév / réz" },
      { en: "meeting", pt: "reunião", pron: "MÍ-tin" },
      { en: "computer", pt: "computador", pron: "com-PIÚ-ter" },
      { en: "children / kids", pt: "filhos / crianças", pron: "TCHÍL-dren / kidz" },
      { en: "car", pt: "carro", pron: "kár" },
    ],
    listening: ["I have a computer.", "She has a meeting today.", "We have two cars.", "He has a dog.", "The app has a bug."],
    exercise: {
      instructions: "Escreva 5 frases: 3 com I have e 2 com he/she has.",
      items: ["I have ___.", "I have ___.", "I have ___.", "My ___ has ___.", "She has ___."],
    },
  },
  {
    id: "e03",
    title: "Simple present: a sua rotina",
    skill: "Gramática + leitura",
    explanation: [
      "O simple present fala de rotina e de fatos: I work, I study.",
      "Com he / she / it, o verbo ganha s: she works, he studies.",
      "Palavras de frequência: always, usually, sometimes, never.",
    ],
    examples: [
      { en: "I work from home.", pt: "Eu trabalho de casa.", pron: "ai uârk from rôum" },
      { en: "I study English every day.", pt: "Eu estudo inglês todo dia.", pron: "ai STÂ-di ÍN-glix É-vri dêi" },
      { en: "She writes tests.", pt: "Ela escreve testes.", pron: "xi ráits tests" },
      { en: "I usually drink coffee.", pt: "Eu geralmente tomo café.", pron: "ai IÚ-jua-li drink CÓ-fi" },
    ],
    vocabulary: [
      { en: "work", pt: "trabalhar", pron: "uârk" },
      { en: "study", pt: "estudar", pron: "STÂ-di" },
      { en: "every day", pt: "todo dia", pron: "É-vri dêi" },
      { en: "usually", pt: "geralmente", pron: "IÚ-jua-li" },
      { en: "write", pt: "escrever", pron: "ráit" },
    ],
    reading: {
      text: "My name is Ana. I am a developer. I work from home. I usually start at nine. I write code and I fix bugs. I study English every day.",
      questions: ["Qual é a profissão da Ana?", "Onde ela trabalha?", "O que ela faz todo dia?"],
    },
    listening: ["I work from home.", "I start at nine.", "She fixes bugs.", "He studies English every day.", "We write tests."],
    exercise: {
      instructions: "Escreva 5 frases sobre a sua rotina. Use pelo menos uma com she ou he.",
      items: ["I ___ every day.", "I usually ___.", "I never ___.", "My girlfriend ___.", "At work, I ___."],
    },
  },
  {
    id: "e04",
    title: "Perguntas e negativas (do / does)",
    skill: "Gramática + conversa",
    explanation: [
      "Pergunta: Do you work? · Does she work? (com does, o verbo perde o s).",
      "Negativa: I don't work. · She doesn't work.",
      "Com to be não se usa do: Are you tired? · I am not tired.",
    ],
    examples: [
      { en: "Do you like coffee?", pt: "Você gosta de café?", pron: "du iú láik CÓ-fi" },
      { en: "I don't understand.", pt: "Eu não entendo.", pron: "ai dônt ân-der-STÉND" },
      { en: "Does it work?", pt: "Isso funciona?", pron: "dâz it uârk" },
      { en: "It doesn't compile.", pt: "Não compila.", pron: "it DÂ-zent com-PÁIL" },
    ],
    vocabulary: [
      { en: "understand", pt: "entender", pron: "ân-der-STÉND" },
      { en: "like", pt: "gostar", pron: "láik" },
      { en: "know", pt: "saber / conhecer", pron: "nôu" },
      { en: "need", pt: "precisar", pron: "níid" },
      { en: "want", pt: "querer", pron: "uânt" },
    ],
    listening: ["Do you work from home?", "I don't know.", "Does the test pass?", "She doesn't like coffee.", "Do you need help?"],
    exercise: {
      instructions: "Responda em inglês, com frases completas.",
      items: ["Do you work from home?", "Do you like coffee?", "Does your girlfriend study?", "Do you know Python?", "Are you tired today?"],
    },
  },
  {
    id: "e05",
    title: "Artigos e números",
    skill: "Gramática",
    explanation: [
      "a antes de som de consoante (a bug), an antes de som de vogal (an error, an hour).",
      "the = o/a, para algo específico: the bug in line 10.",
      "Números e dinheiro: $10.50 = ten dollars and fifty cents.",
    ],
    examples: [
      { en: "I found a bug.", pt: "Encontrei um bug.", pron: "ai fáund a bâg" },
      { en: "There is an error.", pt: "Há um erro.", pron: "dér iz an É-ror" },
      { en: "The test fails.", pt: "O teste falha.", pron: "dâ test fêilz" },
      { en: "It costs twenty dollars.", pt: "Custa vinte dólares.", pron: "it costs TUÊN-ti DÓ-lars" },
    ],
    vocabulary: [
      { en: "error", pt: "erro", pron: "É-ror" },
      { en: "hour", pt: "hora", pron: "áuer" },
      { en: "price", pt: "preço", pron: "práis" },
      { en: "cost", pt: "custar", pron: "cóst" },
      { en: "hundred / thousand", pt: "cem / mil", pron: "RÂN-dred / TÁU-zand" },
    ],
    listening: ["I found a bug.", "There is an error in the code.", "The app is fast.", "It costs ten dollars.", "I study for an hour."],
    exercise: {
      instructions: "Complete com a, an ou the.",
      items: ["I have ___ idea.", "___ code is on GitHub.", "She is ___ engineer.", "I need ___ new computer.", "Open ___ file, please."],
    },
  },
  {
    id: "e06",
    title: "Vocabulário de desenvolvimento",
    skill: "Vocabulário + leitura técnica",
    explanation: [
      "Muitas palavras de programação você já usa em português. Agora é usá-las em frases.",
      "Leia a documentação procurando as palavras conhecidas antes de traduzir tudo.",
    ],
    examples: [
      { en: "I fixed the bug.", pt: "Eu corrigi o bug.", pron: "ai fikst dâ bâg" },
      { en: "Please review my pull request.", pt: "Por favor, revise meu PR.", pron: "plíz ri-VIÚ mái pul ri-KUÉST" },
      { en: "The build failed.", pt: "O build falhou.", pron: "dâ bild fêild" },
      { en: "We deploy on Fridays.", pt: "Fazemos deploy às sextas.", pron: "uí di-PLÓI on FRÁI-dêiz" },
    ],
    vocabulary: [
      { en: "fix", pt: "corrigir", pron: "fiks" },
      { en: "review", pt: "revisar", pron: "ri-VIÚ" },
      { en: "branch / merge", pt: "ramo / juntar", pron: "brentch / mârdj" },
      { en: "feature", pt: "funcionalidade", pron: "FÍ-tcher" },
      { en: "request / response", pt: "requisição / resposta", pron: "ri-KUÉST / ris-PÓNS" },
    ],
    reading: {
      text: "To create a new branch, run git checkout -b followed by the branch name. Make your changes, commit them, and push the branch. Then open a pull request so your team can review the code.",
      questions: ["Qual comando cria uma branch?", "O que fazer depois de commitar?", "Para que serve o pull request?"],
    },
    listening: ["I fixed the bug.", "Please review my code.", "The build failed.", "Create a new branch.", "The request returns an error."],
    exercise: {
      instructions: "Escreva uma frase com cada palavra.",
      items: ["fix", "review", "branch", "feature", "deploy"],
    },
  },
];
