# Requirements Document

## Introduction

Transformação da aplicação de fichas de avaliação existente (front-end only) numa arquitectura cliente-servidor com carregamento dinâmico de testes a partir de ficheiros JSON. A aplicação passa a utilizar um servidor Node.js/Express que serve ficheiros estáticos e disponibiliza endpoints API para listar e devolver testes. O frontend apresenta um menu de seleção de teste e carrega as perguntas dinamicamente, mantendo toda a interface, lógica de correção, pontuação parcial, revisão e geração de PDF já existentes.

## Glossary

- **Servidor**: Servidor Node.js/Express que serve ficheiros estáticos e disponibiliza a API REST
- **Frontend**: Aplicação HTML/CSS/JS servida como ficheiro estático pelo Servidor
- **Ficheiro_de_Teste**: Ficheiro JSON na pasta `public/perguntas/` que contém os dados completos de um teste (título, disciplina, ano, período, data e perguntas)
- **Menu_de_Seleção**: Elemento `<select>` no Frontend que permite ao aluno escolher qual teste realizar
- **Pergunta_Single**: Pergunta com tipo "single" onde apenas uma opção é correta, apresentada com radio buttons
- **Pergunta_Multi**: Pergunta com tipo "multi" onde múltiplas opções são corretas, apresentada com checkboxes
- **Pontuação_Parcial**: Sistema de pontuação para Pergunta_Multi onde cada resposta correta selecionada contribui proporcionalmente para a nota, desde que nenhuma opção errada seja selecionada
- **Baralhamento**: Reorganização aleatória da ordem das perguntas e das opções dentro de cada pergunta

## Requirements

### Requirement 1: Servidor Node.js/Express

**User Story:** Como programador, quero ter um servidor Node.js/Express, para que a aplicação seja servida via HTTP e possa carregar testes dinamicamente.

#### Acceptance Criteria

1. THE Servidor SHALL servir todos os ficheiros estáticos da pasta `public/` na raiz do URL
2. THE Servidor SHALL escutar na porta 3000
3. WHEN o comando `npm start` é executado, THE Servidor SHALL iniciar através do script `node server.js`
4. THE Servidor SHALL declarar `express` como dependência no ficheiro `package.json`
5. WHEN o Servidor é iniciado com sucesso, THE Servidor SHALL imprimir uma mensagem no stdout indicando a porta em que está a escutar, independentemente da porta configurada
6. IF o Servidor falha ao iniciar por qualquer razão (porta ocupada, dependências em falta, permissões de ficheiros ou outro erro), THEN THE Servidor SHALL terminar com um código de saída diferente de 0 e imprimir uma mensagem de erro descritiva no stderr

### Requirement 2: Endpoint de listagem de testes

**User Story:** Como aluno, quero ver todos os testes disponíveis num menu, para que possa escolher qual teste realizar.

#### Acceptance Criteria

1. WHEN um pedido GET é feito ao endpoint `/api/testes`, THE Servidor SHALL devolver um código HTTP 200 com um array JSON onde cada elemento é uma string com o nome do ficheiro (ex: "estudo_meio_3ano.json") de todos os ficheiros `.json` presentes na pasta `public/perguntas/`
2. WHEN um novo Ficheiro_de_Teste é adicionado à pasta `public/perguntas/`, THE Servidor SHALL incluí-lo automaticamente na resposta do endpoint `/api/testes` sem necessidade de reiniciar ou alterar código
3. WHEN a pasta `public/perguntas/` está vazia, THE Servidor SHALL devolver um array JSON vazio `[]`
4. IF ocorre um erro ao ler a pasta `public/perguntas/`, THEN THE Servidor SHALL devolver um código HTTP 500 com um objecto JSON contendo um campo `error` que indica a causa do erro

### Requirement 3: Endpoint de obtenção de teste

**User Story:** Como aluno, quero que o teste escolhido seja carregado, para que possa responder às perguntas.

#### Acceptance Criteria

1. WHEN um pedido GET é feito ao endpoint `/perguntas/:ficheiro`, THE Servidor SHALL devolver o conteúdo JSON do Ficheiro_de_Teste correspondente com código HTTP 200 e Content-Type `application/json`
2. IF o ficheiro solicitado não existe na pasta `public/perguntas/`, THEN THE Servidor SHALL devolver um código HTTP 404 com um objecto JSON contendo um campo `error`
3. IF o nome de ficheiro solicitado não termina em `.json` ou contém caracteres de navegação de diretório (`..`, `/`, `\`), THEN THE Servidor SHALL devolver um código HTTP 400 com um objecto JSON contendo um campo `error`
4. IF ocorre um erro ao ler o ficheiro solicitado, THEN THE Servidor SHALL devolver um código HTTP 500 com um objecto JSON contendo um campo `error`

### Requirement 4: Menu de seleção de teste no Frontend

**User Story:** Como aluno, quero escolher um teste a partir de um menu, para que possa selecionar a ficha que pretendo realizar.

#### Acceptance Criteria

1. WHEN o Frontend é carregado, THE Frontend SHALL apresentar o Menu_de_Seleção com uma opção inicial de placeholder (ex: "Escolhe um teste...") seguida dos nomes dos testes disponíveis obtidos a partir do endpoint `/api/testes`
2. WHILE nenhum teste está selecionado, THE Frontend SHALL ocultar a secção de identificação do aluno e a secção de perguntas
3. WHEN o aluno seleciona um teste no Menu_de_Seleção, THE Frontend SHALL fazer um pedido ao endpoint `/perguntas/:ficheiro` para obter o conteúdo do teste
4. WHEN o conteúdo do teste é carregado com sucesso, THE Frontend SHALL atualizar o título e os metadados apresentados (disciplina, ano, período) de acordo com o Ficheiro_de_Teste e tornar visíveis a secção de identificação do aluno e a secção de perguntas
5. IF ocorre um erro ao carregar a lista de testes ou o conteúdo de um teste, THEN THE Frontend SHALL apresentar uma mensagem de erro ao aluno e manter ocultas a secção de identificação e a secção de perguntas
6. WHEN o aluno seleciona um teste diferente enquanto outro teste já está carregado, THE Frontend SHALL descartar o estado do teste anterior (respostas e navegação) e carregar o novo teste desde o início

### Requirement 5: Eliminação de perguntas fixas no código

**User Story:** Como programador, quero que o Frontend não contenha perguntas fixas em JavaScript, para que todos os testes sejam carregados dinamicamente a partir de ficheiros JSON.

#### Acceptance Criteria

1. THE Frontend SHALL obter todas as perguntas exclusivamente a partir do endpoint da API, sem conter qualquer array de perguntas embutido no código-fonte nem carregar qualquer ficheiro JavaScript externo que contenha dados de perguntas
2. WHEN um teste é carregado, THE Frontend SHALL aplicar Baralhamento à ordem das perguntas e à ordem das opções dentro de cada pergunta, mantendo sempre a correspondência entre cada opção e o campo `c` (respostas corretas) de modo que a verificação de respostas permaneça válida independentemente de o Baralhamento ter sido aplicado ou não
3. WHEN o Baralhamento é aplicado, THE Frontend SHALL preservar todas as perguntas e todas as opções do Ficheiro_de_Teste original sem duplicar nem omitir elementos

### Requirement 6: Formato do Ficheiro de Teste JSON

**User Story:** Como programador, quero um formato padronizado para os ficheiros JSON, para que novos testes possam ser criados de forma consistente.

#### Acceptance Criteria

1. THE Ficheiro_de_Teste SHALL conter os campos obrigatórios: `titulo` (string), `disciplina` (string), `ano` (string), `periodo` (string), `data` (string) e `perguntas` (array com pelo menos 1 elemento)
2. THE Ficheiro_de_Teste SHALL representar cada pergunta com os campos: `q` (texto da pergunta), `op` (array com pelo menos 2 opções), `c` (array de respostas corretas) e `t` (tipo: "single" ou "multi")
3. WHEN o tipo é "single", THE Ficheiro_de_Teste SHALL conter exatamente um elemento no array `c`
4. WHEN o tipo é "multi", THE Ficheiro_de_Teste SHALL conter dois ou mais elementos no array `c` e menos elementos que o total de opções no array `op`
5. THE Ficheiro_de_Teste SHALL conter no array `c` apenas valores que existam no array `op` da mesma pergunta

### Requirement 7: Lógica de pontuação

**User Story:** Como aluno, quero que a minha pontuação seja calculada de forma justa, para que respostas parcialmente corretas sejam valorizadas.

#### Acceptance Criteria

1. THE Frontend SHALL calcular a pontuação total como 100 pontos distribuídos igualmente por todas as perguntas (100 / número de perguntas por pergunta)
2. WHEN uma Pergunta_Single é respondida corretamente, THE Frontend SHALL atribuir o valor total dessa pergunta
3. WHEN uma Pergunta_Single é respondida incorretamente, THE Frontend SHALL atribuir 0 pontos a essa pergunta
4. WHEN uma Pergunta_Multi é respondida sem selecionar qualquer opção errada, THE Frontend SHALL atribuir pontos proporcionais ao número de respostas corretas selecionadas (valor da pergunta / número total de corretas × número de corretas selecionadas)
5. IF o aluno seleciona qualquer opção errada numa Pergunta_Multi, THEN THE Frontend SHALL atribuir 0 pontos a essa pergunta independentemente do número de opções corretas também selecionadas
6. THE Frontend SHALL arredondar todos os valores de pontuação a 1 casa decimal utilizando arredondamento matemático padrão (half-up)
7. IF o aluno não seleciona nenhuma opção numa pergunta, THEN THE Frontend SHALL atribuir 0 pontos a essa pergunta

### Requirement 8: Fluxo de interação do teste

**User Story:** Como aluno, quero navegar pelas perguntas de forma intuitiva, para que possa responder ao meu ritmo.

#### Acceptance Criteria

1. THE Frontend SHALL apresentar uma única pergunta de cada vez, ocultando todas as outras perguntas do teste
2. THE Frontend SHALL apresentar botões de navegação "Anterior" e "Seguinte", desabilitando o botão "Anterior" quando o aluno está na primeira pergunta
3. WHEN o aluno está na última pergunta, THE Frontend SHALL apresentar o botão "Submeter teste" em vez do botão "Seguinte"
4. WHEN o aluno navega entre perguntas, THE Frontend SHALL preservar todas as respostas previamente selecionadas pelo aluno
5. WHEN o aluno tenta avançar sem selecionar pelo menos uma opção na pergunta atual, THE Frontend SHALL apresentar um alerta visível e impedir a navegação para a pergunta seguinte até que uma opção seja selecionada
6. WHEN o aluno tenta submeter sem preencher o campo Nome, THE Frontend SHALL apresentar um alerta visível específico a solicitar o nome e impedir a submissão
7. WHEN o aluno tenta submeter sem preencher o campo Número, THE Frontend SHALL apresentar um alerta visível específico a solicitar o número e impedir a submissão
8. WHEN ambos os campos Nome e Número estão vazios, THE Frontend SHALL apresentar alertas individuais para cada campo em falta
9. THE Frontend SHALL manter os campos Nome e N.º como obrigatórios

### Requirement 9: Revisão após submissão

**User Story:** Como aluno, quero rever as minhas respostas após submeter, para que possa aprender com os erros.

#### Acceptance Criteria

1. WHEN o teste é submetido, THE Frontend SHALL ocultar a secção de perguntas e apresentar a secção de resultados com a pontuação total (formato "X / 100 pontos", arredondada a 1 casa decimal) e a classificação textual
2. WHILE a secção de revisão está visível, THE Frontend SHALL apresentar um botão numerado por cada exercício do teste, permitindo navegação direta para qualquer exercício
3. WHILE a secção de revisão está visível, THE Frontend SHALL apresentar botões "Exercício anterior" e "Exercício seguinte", desabilitando "Exercício anterior" no primeiro exercício e "Exercício seguinte" no último exercício
4. WHEN um exercício é visualizado na revisão, THE Frontend SHALL mostrar a pergunta, a resposta do aluno, a solução correta, a pontuação obtida para esse exercício e um indicador de resultado (correto, parcialmente correto ou incorreto)
5. WHEN a secção de revisão é apresentada pela primeira vez, THE Frontend SHALL mostrar automaticamente o primeiro exercício
6. THE Frontend SHALL não apresentar as soluções corretas nem a pontuação por exercício antes da submissão do teste

### Requirement 10: Certificado e PDF

**User Story:** Como aluno, quero receber um certificado e um PDF com a correção, para que tenha um registo do meu desempenho.

#### Acceptance Criteria

1. WHEN a pontuação é igual ou superior a 90 pontos, THE Frontend SHALL apresentar na secção de resultados um certificado contendo o título do teste, o nome do aluno, a data e a classificação obtida
2. IF a pontuação é inferior a 90 pontos, THEN THE Frontend SHALL não apresentar o certificado
3. WHEN o teste é submetido, THE Frontend SHALL gerar um ficheiro PDF e iniciar automaticamente o seu download no browser do aluno em no máximo 5 segundos após a submissão
4. THE Frontend SHALL incluir no PDF uma capa com título do teste, dados do aluno (nome, número, data) e classificação numérica (pontuação arredondada a 1 casa decimal seguida de "/100")
5. THE Frontend SHALL incluir no PDF a correção de todos os exercícios, apresentando para cada um: o texto da pergunta, a resposta selecionada pelo aluno, a solução correta e a pontuação obtida nesse exercício
6. IF a geração do PDF falha, THEN THE Frontend SHALL apresentar uma mensagem de erro visível ao aluno indicando que o PDF não pôde ser gerado

### Requirement 11: Estrutura do projeto

**User Story:** Como programador, quero uma estrutura de projeto organizada, para que seja fácil manter e adicionar novos testes.

#### Acceptance Criteria

1. THE Servidor SHALL estar implementado no ficheiro `server.js` na raiz do projeto
2. THE Frontend SHALL estar organizado na pasta `public/` com os ficheiros `index.html`, `styles.css` e `app.js`
3. THE Ficheiro_de_Teste SHALL estar armazenado na pasta `public/perguntas/`
4. THE projeto SHALL conter um ficheiro `package.json` com o script `start` definido como `node server.js` e a dependência `express`
5. WHEN o comando `npm install` é executado com sucesso seguido de `npm start`, THE projeto SHALL responder a pedidos HTTP na porta 3000, servir o ficheiro `public/index.html` ao aceder a `http://localhost:3000`, e devolver um array JSON ao endpoint `/api/testes`
6. THE projeto SHALL requerer a execução bem-sucedida de `npm install` antes de `npm start` para garantir funcionalidade HTTP completa
7. WHEN a pasta `public/perguntas/` não existe, THE Servidor SHALL criá-la automaticamente ao iniciar ou devolver um array vazio no endpoint `/api/testes`
