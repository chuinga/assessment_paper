# Implementation Plan: json-test-loader

## Overview

Transformar a aplicação de fichas de avaliação de um site estático front-end-only numa arquitectura cliente-servidor com carregamento dinâmico de testes a partir de ficheiros JSON. A implementação segue uma abordagem incremental: primeiro a infraestrutura do projeto, depois o servidor, a conversão de dados, o frontend refatorizado, e finalmente os testes.

## Tasks

- [ ] 1. Configurar estrutura do projeto e dependências
  - [x] 1.1 Criar `package.json` com script `start` e dependências
    - Criar ficheiro `package.json` na raiz do projeto com `"start": "node server.js"`
    - Declarar `express` como dependência
    - Declarar `vitest`, `fast-check` e `supertest` como devDependencies
    - Adicionar script `"test": "vitest --run"`
    - _Requirements: 1.4, 11.4_

  - [ ] 1.2 Criar pasta `public/` e mover ficheiros estáticos
    - Criar directório `public/`
    - Criar directório `public/perguntas/`
    - Mover `index.html`, `styles.css` e `app.js` para `public/`
    - _Requirements: 11.2, 11.3_

  - [ ] 1.3 Converter `perguntas copy.js` para formato JSON
    - Criar ficheiro `public/perguntas/estudo_meio_3ano.json` com a estrutura: `{ titulo, disciplina, ano, periodo, data, perguntas }`
    - Copiar o array de perguntas existente para o campo `perguntas`
    - Adicionar metadados: `titulo: "Ficha Final - Estudo do Meio"`, `disciplina: "Estudo do Meio"`, `ano: "3.º Ano"`, `periodo: "3.º Período"`, `data: "19/06/2026"`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 11.3_

- [ ] 2. Implementar servidor Node.js/Express
  - [ ] 2.1 Criar `server.js` com middleware estático e arranque
    - Criar ficheiro `server.js` na raiz do projeto
    - Configurar `express.static('public')` na raiz do URL
    - Escutar na porta 3000
    - Imprimir mensagem no stdout ao iniciar com sucesso
    - Criar pasta `public/perguntas/` automaticamente se não existir (com `fs.mkdirSync` recursive)
    - Tratar erro de porta ocupada com `process.exit(1)` e mensagem no stderr
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 1.6, 11.1, 11.7_

  - [ ] 2.2 Implementar endpoint `GET /api/testes`
    - Ler pasta `public/perguntas/` com `fs.readdir`
    - Filtrar apenas ficheiros com extensão `.json`
    - Devolver array JSON com nomes dos ficheiros (HTTP 200)
    - Devolver array vazio se pasta está vazia
    - Devolver HTTP 500 com `{ error }` se ocorrer erro ao ler
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [ ] 2.3 Implementar endpoint `GET /perguntas/:ficheiro`
    - Validar nome do ficheiro: rejeitar se não termina em `.json` ou contém `..`, `/`, `\` (HTTP 400)
    - Ler ficheiro de `public/perguntas/` e devolver conteúdo JSON (HTTP 200)
    - Devolver HTTP 404 se ficheiro não existe
    - Devolver HTTP 500 para outros erros de leitura
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 3. Checkpoint - Verificar servidor
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Refatorizar frontend para carregamento dinâmico
  - [ ] 4.1 Modificar `public/index.html`
    - Adicionar `<select id="seletor-teste">` antes da secção `#cabecalho`
    - Remover `<script src="perguntas.js"></script>`
    - Adicionar atributo `style="display:none"` às secções `#cabecalho` e `.progress-card` e `#pergunta`
    - Adicionar elemento para mensagem de erro (ex: `<p id="erro-msg">`)
    - _Requirements: 4.1, 4.2, 5.1_

  - [ ] 4.2 Refatorizar `public/app.js` - carregamento de testes
    - Remover referência global a `perguntas` (eliminar dependência do array embutido)
    - Adicionar função `carregarListaTestes()` que faz `fetch('/api/testes')` e popula o `<select>` com os nomes dos ficheiros
    - Adicionar opção placeholder "Escolhe um teste..." como primeira opção desativada
    - Chamar `carregarListaTestes()` no `DOMContentLoaded`
    - Tratar erros de rede/API mostrando mensagem visível ao aluno
    - _Requirements: 4.1, 4.5, 5.1_

  - [ ] 4.3 Refatorizar `public/app.js` - seleção e carregamento de teste
    - Adicionar event listener `change` no `<select>` que faz `fetch('/perguntas/{ficheiro}')`
    - Ao carregar teste com sucesso: atualizar título/metadados no header, tornar secções visíveis, aplicar baralhamento, inicializar estado
    - Se aluno seleciona teste diferente: reiniciar estado (respostas, navegação, pontuação)
    - Manter correspondência `c` ↔ `op` após baralhamento das opções
    - _Requirements: 4.3, 4.4, 4.6, 5.2, 5.3_

  - [ ] 4.4 Adaptar funções existentes para aceitar dados dinâmicos
    - Converter variáveis globais (`perguntasTeste`, `respostas`, `valor`) para serem reinicializáveis
    - Adaptar `mostrar()`, `submeter()`, `ver()`, `exportarPDF()` para usar título e metadados do JSON carregado
    - Manter toda a lógica existente de navegação, pontuação parcial, revisão e PDF
    - _Requirements: 7.1-7.7, 8.1-8.9, 9.1-9.6, 10.1-10.6_

- [ ] 5. Checkpoint - Verificar aplicação completa
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implementar testes do servidor
  - [ ] 6.1 Criar `tests/server.test.js` com testes unitários e de integração
    - Testar arranque com sucesso do servidor (porta 3000)
    - Testar `GET /api/testes` com pasta vazia (deve devolver `[]`)
    - Testar `GET /api/testes` com ficheiros JSON presentes
    - Testar `GET /api/testes` filtra ficheiros não-JSON
    - Testar `GET /perguntas/:ficheiro` com ficheiro válido (HTTP 200)
    - Testar `GET /perguntas/:ficheiro` com ficheiro inexistente (HTTP 404)
    - Testar `GET /perguntas/:ficheiro` com path traversal (HTTP 400)
    - Testar `GET /perguntas/:ficheiro` sem extensão .json (HTTP 400)
    - Usar supertest para testar endpoints sem iniciar servidor manualmente
    - _Requirements: 1.1-1.6, 2.1-2.4, 3.1-3.4_

  - [ ]* 6.2 Write property test for listing endpoint (Property 1)
    - **Property 1: Listing endpoint returns only JSON filenames**
    - Gerar arrays arbitrários de nomes de ficheiros com extensões mistas (.json, .txt, .js, .html)
    - Verificar que o endpoint devolve exclusivamente os ficheiros que terminam em `.json`
    - Usar fast-check com mínimo 100 iterações
    - **Validates: Requirements 2.1**

  - [ ]* 6.3 Write property test for filename validation (Property 2)
    - **Property 2: Filename validation rejects unsafe inputs**
    - Gerar strings arbitrárias contendo `..`, `/`, `\` ou sem terminação `.json`
    - Verificar que o endpoint devolve HTTP 400 e nunca tenta ler do disco
    - Usar fast-check com mínimo 100 iterações
    - **Validates: Requirements 3.3**

- [ ] 7. Implementar testes de pontuação e baralhamento
  - [ ]* 7.1 Write property test for shuffle permutation (Property 3)
    - **Property 3: Baralhamento is a valid permutation preserving correctness**
    - Gerar arrays arbitrários de perguntas com opções
    - Verificar que após baralhamento: mesmos elementos sem duplicações/omissões, e valores de `c` continuam presentes em `op`
    - Usar fast-check com mínimo 100 iterações
    - **Validates: Requirements 5.2, 5.3**

  - [ ]* 7.2 Write property test for schema validation (Property 4)
    - **Property 4: Test file schema validation**
    - Gerar objectos JSON arbitrários com/sem campos obrigatórios
    - Verificar que a função de validação aceita apenas objectos com todos os campos corretos
    - Usar fast-check com mínimo 100 iterações
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**

  - [ ]* 7.3 Write property test for single question scoring (Property 5)
    - **Property 5: Single question scoring**
    - Gerar perguntas single com valor `v = 100/n` e respostas corretas/incorretas
    - Verificar que resposta correta dá `v` pontos e incorreta dá `0`
    - Usar fast-check com mínimo 100 iterações
    - **Validates: Requirements 7.2, 7.3**

  - [ ]* 7.4 Write property test for multi question scoring (Property 6)
    - **Property 6: Multi question scoring with partial credit**
    - Gerar perguntas multi com subconjuntos arbitrários de seleções
    - Verificar: se seleção contém errada → 0; senão → `(v / |C|) × |S ∩ C|` arredondado a 1 decimal
    - Usar fast-check com mínimo 100 iterações
    - **Validates: Requirements 7.4, 7.5**

  - [ ]* 7.5 Write property test for total maximum score (Property 7)
    - **Property 7: Total maximum score equals 100**
    - Gerar testes com `n` perguntas (1-50) respondidas perfeitamente
    - Verificar que total = 100 (±0.1 tolerância floating-point)
    - Usar fast-check com mínimo 100 iterações
    - **Validates: Requirements 7.1**

  - [ ]* 7.6 Write property test for score rounding (Property 8)
    - **Property 8: Score rounding invariant**
    - Gerar configurações de teste arbitrárias que produzem frações
    - Verificar que resultado tem no máximo 1 casa decimal (half-up rounding)
    - Usar fast-check com mínimo 100 iterações
    - **Validates: Requirements 7.6**

- [ ] 8. Final checkpoint - Verificar tudo
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- O servidor usa `supertest` nos testes para evitar iniciar processo separado
- As funções de pontuação (`calcularPontosPergunta`, `calcularTotal`) e baralhamento (`baralharArray`) devem ser exportáveis para testes (usar `module.exports` ou separar em módulos)

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3"] },
    { "id": 2, "tasks": ["2.1"] },
    { "id": 3, "tasks": ["2.2", "2.3"] },
    { "id": 4, "tasks": ["4.1"] },
    { "id": 5, "tasks": ["4.2", "4.3"] },
    { "id": 6, "tasks": ["4.4"] },
    { "id": 7, "tasks": ["6.1", "7.1", "7.2"] },
    { "id": 8, "tasks": ["6.2", "6.3", "7.3", "7.4", "7.5", "7.6"] }
  ]
}
```
