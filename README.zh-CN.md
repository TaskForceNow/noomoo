# noomoo

[![license: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue)](LICENSE) ![platforms: Windows | macOS | Linux](https://img.shields.io/badge/platforms-Windows%20%7C%20macOS%20%7C%20Linux-blue) ![languages: 8](https://img.shields.io/badge/languages-8-brightgreen) ![Claude Code: plugin](https://img.shields.io/badge/Claude%20Code-plugin-D97757)

[English](README.md) · [Русский](README.ru.md) · [Deutsch](README.de.md) · [Español](README.es.md) · [Français](README.fr.md) · [Português](README.pt-BR.md) · **中文** · [日本語](README.ja.md)

## 不要信任智能体，要信任系统。

**noomoo 是面向智能体软件开发的工程约束框架。**

让编码智能体在团队真正能够强制执行的规则之内完成规划、构建、测试、评审和交付。

noomoo 不相信智能体自称做了什么，而是检查仓库里实际发生了什么。

专为从 AI 辅助编程迈向自主软件交付的团队打造。

## AI 让代码变得廉价，验证成了新的瓶颈。

编码智能体已经能够实现功能、修复缺陷、运行测试、创建 pull request 并回应评审。问题不再是：**智能体能写出代码吗？** 真正的问题是：

- 它理解需求了吗？
- 它是否停留在任务范围之内？
- 它遵循架构了吗？
- 它真的添加了测试吗？
- 这些测试真的运行过吗？
- 最近一次修改之后，评审是否仍然有效？
- “完成”是事实，还是只是智能体的一句话？

## 智能体无法靠说辞绕过关卡。

| 智能体 | noomoo |
|---|---|
| “所有测试都通过了。” | **出示这个确切修订版本的测试结果。** |
| “我评审过这次修改。” | **出示针对当前代码的最新评审记录。** |
| “我只改了任务要求的内容。” | **出示 diff，证明改动范围。** |
| “任务完成了。” | **请证明。** |

自然语言描述的状态不是证据。**仓库状态才是证据。**

## 人类掌舵，智能体执行，noomoo 验证。

1. **定义结果。** 需求、用例、功能和任务构成一条可追溯的链。任务说明**什么必须成立**，而不是智能体该如何编码。
2. **证明任务可执行。** 在工作开始之前，noomoo 检查结构、边界、链接和歧义。如果任务必须靠猜测才能执行，工作就不会开始。
3. **先计划，再改代码。** 实现计划成为一个有版本的产物，涵盖实现、契约、测试和决策。
4. **让智能体工作。** 编码智能体在隔离的分支或 worktree 中实现、测试、评审、修复并准备交付。
5. **验证实际发生了什么。** noomoo 检查 Git、文件、AST、测试、评审记录、CI 以及项目特定的不变量。
6. **只有拿出证据才能前进。** 所需事实存在，工作就继续推进；不存在，工作就停止。

## 指令只是引导，noomoo 负责强制执行。

`CLAUDE.md`、`AGENTS.md`、提示词和技能都很有用。但它们仍然依赖智能体去阅读、记住、理解并遵循。noomoo 是对它们的补充。

CI 告诉你代码能否构建、测试是否通过。**CI 检查代码，noomoo 检查围绕代码的开发生命周期。**

**让智能体承担更多工作，但别再让它们给自己的作业打分。**

---

## 用于 Claude Code 的 noomoo

noomoo 是编码智能体的工程控制层。它检查仓库里实际发生了什么，而不是相信智能体的说法：对文档、Git、测试和 CI 的确定性检查，绑定到当前修订版本的生命周期关卡，评审状态以及项目状态。

本插件以技能的形式把 noomoo 的工作流带入 Claude Code。每个技能都会调用安装在你项目中的 noomoo 核心包；核心是验证与验收的唯一依据。一个工作阶段由核心命令的退出码来结束，而不是由智能体的报告来结束。插件不会取代 Git、你的测试、你的 CI 或你的仓库策略。

## 环境要求

插件不会安装核心：请自行把 noomoo 包添加到每个项目中。没有它，技能会提示你安装并停止。

- Node.js 20 或更高版本，以及 Git。
- 项目中的 noomoo 核心包，使用项目已在用的包管理器添加：

```bash
npm install -D noomoo
pnpm add -D noomoo
yarn add -D noomoo
bun add -d noomoo
```

- 已登录的 GitHub CLI（`gh`），用于 `/noomoo:task` 中读取 pull request、其 CI 运行和评审者身份的步骤。

Superpowers 是可选的：安装后，`/noomoo:task` 会把设计、测试驱动的实现、评审和验证委托给它的技能；没有它，该技能会自行完成同样的阶段。两条路径都用同样的核心命令结束每个阶段。

## 快速开始

1. 按上文所示安装核心包。
2. 在 Claude Code 中运行 `/noomoo:setup`。它会展示安装计划，在你确认之前不做任何更改。在终端中也一样：`npx --no-install noomoo setup` 打印计划，`npx --no-install noomoo setup --yes` 应用计划并记录到 `.noomoo/setup-manifest.json`。
3. 从 `chore/noomoo-setup` 之类的服务分支，用单独的 pull request 把安装合入主分支。
4. 运行 `/noomoo:start`，查看项目当前所处的位置以及下一步该做什么。

`/noomoo:rollback` 按清单移除安装：它会先展示计划，并保留你在安装之后修改过的文件。

## 从想法到 pull request

noomoo 覆盖整个交付流程，每一步都会留下一个文档或事实，供下一步检查：

1. **Intake。** `/noomoo:intake` 把原始材料整理成提交给负责人的提案。
2. **规格说明。** `/noomoo:spec` 把工作描述为一条可追溯的链：需求 → 用例 → 功能 → 任务。
3. **设计。** `/noomoo:architect` 编写决策记录、架构切面和数据文档。
4. **就绪。** 只有当就绪关卡认定任务无需猜测即可执行时，任务才会进入开发。
5. **计划。** 实现计划是一份有版本的文档，在修改代码之前完成评审和批准。
6. **交付。** `/noomoo:task` 带着任务经过测试驱动的实现、评审和完整验证，直到 pull request。
7. **报告。** `/noomoo:report` 记录发现的问题或对线上系统的变更，并附上证据。

文档模板和评审细则随核心包一起提供（`node_modules/noomoo/docs/`）。文档通过 `noomoo scaffold` 创建，它会打印出确切的结构，使名称、章节和链接始终可检查。

## 技能

| 技能 | 作用 |
|---|---|
| `/noomoo:start` | 根据 `noomoo next` 显示项目当前所处位置和下一步。 |
| `/noomoo:status` | 显示项目状态：防护、最近一次检查、未完成的工作、需要关注的事项。只读；不会为了刷新状态而运行验证。 |
| `/noomoo:doctor` | 检查仓库中的 noomoo 安装情况。只读，在安装之前也可使用。 |
| `/noomoo:setup` | 把 noomoo 安装到仓库：展示计划，经你同意后应用。 |
| `/noomoo:rollback` | 按清单回滚安装：展示计划，经你同意后应用。 |
| `/noomoo:validate` | 用 `noomoo validate` 检查项目文档。不写入任何内容。 |
| `/noomoo:spec` | 在动手之前，把新工作描述为需求、用例、功能和任务。 |
| `/noomoo:task <TASK-NNN>` | 带着一个任务从文档出发，经过 noomoo 关卡，直到 pull request。任务交付的入口。 |
| `/noomoo:architect` | 编写决策记录、架构切面或数据文档。 |
| `/noomoo:intake` | 把原始材料或转发的消息整理成提交给负责人的 intake 提案。 |
| `/noomoo:report` | 编写关于发现的问题或对线上系统所做变更的报告，并附上证据。 |

## 插件会运行什么

技能使用项目自己的包管理器运行核心，从不下载核心：`npx --no-install noomoo`、`pnpm exec noomoo`、`yarn exec -- noomoo` 或 `bun x --no-install noomoo`。如果缺少该包，技能会提示你安装并停止。

技能不会预先批准任何 shell 命令或文件修改。Claude Code 会在每条核心命令和每次编辑之前询问你；你可以在该提示中为项目允许某条命令。

插件有两个钩子：

- **SessionStart** 只读取 `package.json` 和 `.noomoo/setup-manifest.json`。如果项目列出了 noomoo 但从未安装，它会打印一行提示，建议运行 `/noomoo:setup`。它不会启动任何进程。
- **PostToolUse**（作用于 `Edit` 和 `Write`）在满足三个条件之前什么也不做：项目中有 `.noomoo/setup-manifest.json`；你同意在此仓库中运行 noomoo（由安装记录在 `~/.config/noomoo/trusted-repos.json` 中）；核心已在本地安装。满足后，它通过项目的包管理器运行 `noomoo claude-hook-docs`，传入编辑事件，最多等待 20 秒，并把输出作为上下文返回给 Claude。

两个钩子都不会安装包、建立网络连接或记录信任。安装、信任和仓库策略始终是 noomoo 的显式操作。对于经过明确批准的自动化，也可以通过 `NOOMOO_TRUST_PROJECT=1` 提供项目信任；noomoo 自己从不设置这个变量。

插件本身不会向 Git 或 GitHub 安装任何东西。当你确认安装时，核心可能会在 `.githooks/` 中添加 Git 钩子（`pre-commit` 和 `pre-push` 运行文档检查，`commit-msg` 拒绝 AI 署名）。当 noomoo 管理项目钩子时，安装可能会把 `core.hooksPath` 配置为由 noomoo 管理的钩子目录。用户自行管理的现有钩子配置会按照安装的归属规则保留。安装还会添加 GitHub Actions 工作流 `.github/workflows/noomoo.yml`。它不会更改 GitHub 上的分支保护、webhook 或密钥。`/noomoo:rollback` 会移除以上全部内容。

`/noomoo:task` 在单独的分支上工作；如果项目要求，则在 `.worktrees/` 下的 Git worktree 中工作。只有在你明确同意之后，它才会推送分支并创建 pull request，而且从不合并。

## 数据与网络访问

- 插件不包含网络代码，也不包含遥测。公开的 noomoo 核心包不包含遥测发送程序。
- 核心在你的仓库内写入：文档、配置、Git 钩子、一个 CI 工作流，以及被 git 忽略的本地命令日志 `docs/validation/events.jsonl`。安装在写入之前会列出它将创建的每个文件。
- 读取 pull request、CI 运行或评审者身份的命令，会使用你的令牌或你的 `gh` 登录调用 GitHub API。
- 基于模型的评审（`task-ready`、`plan-ready --judge`、`estimate`）会以只读工具启动你机器上安装的 Claude CLI，并把被评审文档的文本传给它。这些文本会在你自己的账户和条款下发送给 Claude 提供方。
- Git、`gh` 和 Claude Code 在各自的身份验证和策略下与各自的服务通信。

## 安装插件

在 Claude Code 中从本仓库的 marketplace 安装插件：

```bash
/plugin install noomoo --marketplace TaskForceNow/noomoo
```

如果 Claude Code 版本低于 2.1.275，请先添加 marketplace：

```bash
/plugin marketplace add TaskForceNow/noomoo
/plugin install noomoo@noomoo
```

Claude 插件目录上线后，将成为第二个安装渠道。

作为备选方案，可以为单次会话加载发布包。从同一个 noomoo [发布版本](https://github.com/TaskForceNow/noomoo/releases)下载 `noomoo-plugin-<version>.zip` 和 `SHA256SUMS`，校验压缩包，然后用它启动 Claude Code：

```bash
shasum -a 256 -c SHA256SUMS --ignore-missing
claude --plugin-dir noomoo-plugin-<version>.zip
```

请使用与项目中安装的核心包同一发布版本的插件压缩包。

## 使用 noomoo 2.x 的项目

noomoo 3.0.0 是新安装的当前版本线。现有的 noomoo 2.x 项目应继续固定在当前版本，直到受支持的 2.x → 3.x 迁移路径可用。

## 文档

公开文档：https://noomoo.dev

## 许可证

Apache-2.0。

noomoo 围绕一条简单的规则设计：

> 不要信任智能体，要信任系统。
