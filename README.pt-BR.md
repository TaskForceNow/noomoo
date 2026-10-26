# noomoo

[English](README.md) · [Русский](README.ru.md) · [Deutsch](README.de.md) · [Español](README.es.md) · [Français](README.fr.md) · **Português** · [中文](README.zh-CN.md) · [日本語](README.ja.md)

## Não confie no agente. Confie no sistema.

**noomoo é um harness de engenharia para o desenvolvimento de software com agentes.**

Deixe os agentes de código planejarem, construírem, testarem, revisarem e entregarem software dentro de regras que sua equipe consegue de fato fazer cumprir.

Em vez de acreditar no que um agente diz que fez, o noomoo verifica o que aconteceu no repositório.

Feito para equipes que estão passando da programação assistida por IA para a entrega autônoma de software.

## A IA barateou o código. A verificação é o novo gargalo.

Os agentes de código já implementam funcionalidades, corrigem bugs, executam testes, abrem pull requests e respondem a revisões. A pergunta não é mais: **o agente consegue escrever o código?** As perguntas reais são:

- Ele entendeu o requisito?
- Ficou dentro da tarefa?
- Seguiu a arquitetura?
- Adicionou mesmo os testes?
- Esses testes rodaram de verdade?
- A revisão ainda vale depois da última alteração?
- "Pronto" é um fato ou só algo que o agente disse?

## O agente não consegue convencer o portão com palavras.

| Agente | noomoo |
|---|---|
| "Todos os testes passam." | **Mostre o resultado dos testes desta revisão exata.** |
| "Eu revisei a alteração." | **Mostre um artefato de revisão recente para o código atual.** |
| "Só alterei o que a tarefa pedia." | **Mostre o diff e prove o escopo.** |
| "A tarefa está pronta." | **Prove.** |

Status em linguagem natural não é prova. **O estado do repositório é a prova.**

## Pessoas conduzem. Agentes executam. O noomoo verifica.

1. **Defina o resultado.** Requisitos, casos de uso, funcionalidades e tarefas formam uma cadeia rastreável. A tarefa diz **o que precisa ser verdade**, não como o agente deve programar.
2. **Prove que a tarefa é executável.** Antes de o trabalho começar, o noomoo verifica estrutura, limites, vínculos e ambiguidade. Se a tarefa não puder ser executada sem adivinhação, o trabalho não começa.
3. **Planeje antes de mudar o código.** O plano de implementação vira um artefato versionado que cobre implementação, contratos, testes e decisões.
4. **Deixe o agente trabalhar.** O agente de código implementa, testa, revisa, corrige e prepara a entrega em um branch ou worktree isolado.
5. **Verifique o que realmente aconteceu.** O noomoo verifica Git, arquivos, AST, testes, artefatos de revisão, CI e invariantes específicos do projeto.
6. **Avance só com prova.** Se os fatos exigidos existem, o trabalho avança. Se não, ele para.

## Instruções orientam. O noomoo garante.

`CLAUDE.md`, `AGENTS.md`, prompts e skills são úteis. Mas continuam dependendo de o agente lê-los, lembrá-los, interpretá-los e segui-los. O noomoo os complementa.

A CI diz se o código compila e se os testes passam. **A CI verifica o código. O noomoo verifica o ciclo de vida de desenvolvimento ao redor dele.**

**Deixe os agentes fazerem mais trabalho. Pare de confiar que eles corrijam a própria prova.**

---

## noomoo para Claude Code

O noomoo é a camada de controle de engenharia para agentes de código. Ele verifica o que realmente aconteceu no repositório em vez de confiar no que o agente diz: verificações determinísticas sobre documentos, Git, testes e CI, portões do ciclo de vida vinculados à revisão atual, estado da revisão e status do projeto.

Este plugin leva os fluxos de trabalho do noomoo ao Claude Code como skills. Cada skill chama o pacote do núcleo do noomoo instalado no seu projeto; o núcleo é a fonte da verdade para validação e aceitação. Uma fase de trabalho é encerrada pelo código de saída de um comando do núcleo, não pelo relatório do agente. O plugin não substitui o Git, seus testes, sua CI nem a política do seu repositório.

## Requisitos

O plugin não instala o núcleo: adicione você mesmo o pacote noomoo a cada projeto. Sem ele, as skills pedem que você o instale e param.

- Node.js 20 ou mais recente e Git.
- O pacote do núcleo do noomoo no projeto, adicionado com o gerenciador de pacotes que o projeto já usa:

```bash
npm install -D noomoo
pnpm add -D noomoo
yarn add -D noomoo
bun add -d noomoo
```

- GitHub CLI (`gh`), autenticado, para as etapas de `/noomoo:task` que leem o pull request, suas execuções de CI e a identidade do revisor.

O Superpowers é opcional: quando instalado, `/noomoo:task` delega às skills dele o design, a implementação orientada a testes, a revisão e a verificação; sem ele, a skill executa as mesmas fases sozinha. Os dois caminhos encerram cada fase com os mesmos comandos do núcleo.

## Primeiros passos

1. Instale o pacote do núcleo como mostrado acima.
2. No Claude Code, execute `/noomoo:setup`. Ele mostra o plano de instalação e não muda nada até você confirmar. O mesmo pelo terminal: `npx --no-install noomoo setup` imprime o plano, `npx --no-install noomoo setup --yes` o aplica e o registra em `.noomoo/setup-manifest.json`.
3. Leve a instalação ao seu branch principal com um pull request próprio, a partir de um branch de serviço como `chore/noomoo-setup`.
4. Execute `/noomoo:start` para ver em que ponto o projeto está e o que fazer a seguir.

`/noomoo:rollback` remove a instalação pelo manifesto: mostra o plano primeiro e mantém os arquivos que você alterou depois da instalação.

## Da ideia ao pull request

O noomoo cobre todo o fluxo de entrega, e cada etapa deixa um documento ou um fato que a etapa seguinte verifica:

1. **Intake.** `/noomoo:intake` transforma material bruto em uma proposta para o responsável.
2. **Especificação.** `/noomoo:spec` descreve o trabalho como uma cadeia rastreável: requisito → caso de uso → funcionalidade → tarefa.
3. **Design.** `/noomoo:architect` escreve registros de decisão, recortes de arquitetura e documentos de dados.
4. **Prontidão.** Uma tarefa só entra em execução quando o portão de prontidão a considera executável sem adivinhação.
5. **Plano.** O plano de implementação é um documento versionado, revisado e aprovado antes de mudar o código.
6. **Entrega.** `/noomoo:task` conduz a tarefa pela implementação orientada a testes, revisão e verificação completa até um pull request.
7. **Relatório.** `/noomoo:report` registra achados ou uma alteração em um sistema em produção, com suas evidências.

Os modelos de documentos e as rubricas de revisão vêm com o pacote do núcleo (`node_modules/noomoo/docs/`). Os documentos são criados com `noomoo scaffold`, que imprime o formato exato, para que nomes, seções e links continuem verificáveis.

## Skills

| Skill | O que faz |
|---|---|
| `/noomoo:start` | Mostra em que ponto o projeto está e o próximo passo, a partir de `noomoo next`. |
| `/noomoo:status` | Mostra o status do projeto: proteção, última verificação, trabalho em aberto, itens que pedem atenção. Somente leitura; não dispara uma validação para redesenhar o status. |
| `/noomoo:doctor` | Verifica a instalação do noomoo no repositório. Somente leitura, funciona antes da instalação. |
| `/noomoo:setup` | Instala o noomoo no repositório: mostra o plano e o aplica com o seu sim. |
| `/noomoo:rollback` | Desfaz a instalação pelo manifesto: mostra o plano e o aplica com o seu sim. |
| `/noomoo:validate` | Verifica a documentação do projeto com `noomoo validate`. Não grava nada. |
| `/noomoo:spec` | Descreve um novo trabalho como requisito, caso de uso, funcionalidade e tarefa antes de ser construído. |
| `/noomoo:task <TASK-NNN>` | Conduz uma tarefa do seu documento até um pull request pelos portões do noomoo. O ponto de entrada para entregar uma tarefa. |
| `/noomoo:architect` | Escreve um registro de decisão, um recorte de arquitetura ou um documento de dados. |
| `/noomoo:intake` | Transforma material bruto ou uma mensagem encaminhada em uma proposta de intake para o responsável. |
| `/noomoo:report` | Escreve um relatório de achados ou de uma alteração feita em um sistema em produção, com suas evidências. |

## O que o plugin executa

As skills executam o núcleo com o gerenciador de pacotes do projeto e nunca o baixam: `npx --no-install noomoo`, `pnpm exec noomoo`, `yarn exec -- noomoo` ou `bun x --no-install noomoo`. Se o pacote estiver ausente, a skill pede que você o instale e para.

As skills não aprovam previamente nenhum comando de shell nem nenhuma alteração de arquivo. O Claude Code pergunta antes de cada comando do núcleo e de cada edição; a partir dessa pergunta você pode permitir um comando para o projeto.

O plugin tem dois hooks:

- **SessionStart** lê apenas `package.json` e `.noomoo/setup-manifest.json`. Se o projeto lista o noomoo mas nunca foi instalado, imprime uma linha sugerindo executar `/noomoo:setup`. Não inicia nenhum processo.
- **PostToolUse** em `Edit` e `Write` não faz nada até que três condições sejam atendidas: o projeto tem `.noomoo/setup-manifest.json`, você concordou em executar o noomoo neste repositório (registrado pela instalação em `~/.config/noomoo/trusted-repos.json`) e o núcleo está instalado localmente. Então executa `noomoo claude-hook-docs` pelo gerenciador de pacotes do projeto, repassa o evento de edição, espera no máximo 20 segundos e devolve a saída ao Claude como contexto.

Nenhum hook instala pacotes, abre conexões de rede ou registra confiança. Instalação, confiança e política do repositório continuam sendo operações explícitas do noomoo. Para automações aprovadas explicitamente, a confiança no projeto também pode ser fornecida por `NOOMOO_TRUST_PROJECT=1`; o noomoo nunca define essa variável sozinho.

O plugin em si não instala nada no Git nem no GitHub. Quando você confirma a instalação, o núcleo pode adicionar hooks do Git em `.githooks/` (`pre-commit` e `pre-push` executam as verificações de documentação, `commit-msg` rejeita assinaturas de IA). Quando o noomoo gerencia os hooks do projeto, a instalação pode configurar `core.hooksPath` para o diretório de hooks gerenciado pelo noomoo. A configuração de hooks existente gerenciada pelo usuário é preservada conforme as regras de propriedade da instalação. A instalação também adiciona o workflow do GitHub Actions `.github/workflows/noomoo.yml`. Ela não altera proteção de branches, webhooks nem segredos no GitHub. `/noomoo:rollback` remove tudo isso.

`/noomoo:task` trabalha em um branch separado, em um worktree do Git sob `.worktrees/` quando o projeto pede. Ele faz push do branch e abre um pull request somente depois da sua autorização explícita, e nunca faz merge.

## Dados e acesso à rede

- O plugin não contém código de rede nem telemetria. O pacote público do núcleo do noomoo não contém nenhum emissor de telemetria.
- O núcleo grava dentro do seu repositório: documentos, configuração, hooks do Git, um workflow de CI e um log local de comandos ignorado pelo git, `docs/validation/events.jsonl`. A instalação mostra cada arquivo que vai criar antes de gravar.
- Comandos que leem um pull request, execuções de CI ou a identidade do revisor chamam a API do GitHub com o seu token ou o seu login no `gh`.
- A revisão por modelo (`task-ready`, `plan-ready --judge`, `estimate`) inicia a CLI do Claude instalada na sua máquina com ferramentas somente leitura e lhe passa o texto do documento revisado. Esse texto vai para o provedor do Claude sob a sua própria conta e os seus próprios termos.
- Git, `gh` e Claude Code se comunicam com os próprios serviços, sob a própria autenticação e as próprias políticas.

## Instalar o plugin

Instale o plugin no Claude Code a partir do marketplace deste repositório:

```bash
/plugin install noomoo --marketplace TaskForceNow/noomoo
```

No Claude Code anterior à 2.1.275, adicione primeiro o marketplace:

```bash
/plugin marketplace add TaskForceNow/noomoo
/plugin install noomoo@noomoo
```

O diretório de plugins do Claude será o segundo canal assim que estiver disponível.

Como alternativa, carregue o arquivo da versão para uma sessão. Baixe `noomoo-plugin-<version>.zip` e `SHA256SUMS` da mesma [versão](https://github.com/TaskForceNow/noomoo/releases) do noomoo, verifique o arquivo e inicie o Claude Code com ele:

```bash
shasum -a 256 -c SHA256SUMS --ignore-missing
claude --plugin-dir noomoo-plugin-<version>.zip
```

Use o arquivo do plugin da mesma versão do pacote do núcleo instalado no seu projeto.

## Projetos no noomoo 2.x

O noomoo 3.0.0 é a linha atual para novas instalações. Projetos existentes no noomoo 2.x devem permanecer fixados na versão atual até que o caminho de migração 2.x → 3.x suportado esteja disponível.

## Documentação

Documentação pública: https://noomoo.dev

## Licença

Apache-2.0.

O noomoo é construído em torno de uma regra simples:

> Não confie no agente. Confie no sistema.
