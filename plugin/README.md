# noomoo for Claude Code

noomoo is the engineering control layer for coding agents. It checks what actually happened in the repository instead of trusting what an agent says it did: deterministic checks over documents, Git, tests and CI, lifecycle gates bound to the current revision, review state and project status.

This plugin brings noomoo workflows into Claude Code as skills. Every skill calls the noomoo core package installed in your project; the core is the source of truth for validation and acceptance. A phase of work is closed by the exit code of a core command, not by the agent's report. The plugin does not replace Git, your tests, your CI or your repository policy.

## Requirements

The plugin does not install the core: add the noomoo package to each project yourself. Without it, the skills ask you to install it and stop.

- Node.js 20 or newer and Git.
- The noomoo core package in the project, added with the package manager the project already uses:

```bash
npm install -D noomoo
pnpm add -D noomoo
yarn add -D noomoo
bun add -d noomoo
```

- GitHub CLI (`gh`), signed in, for the steps of `/noomoo:task` that read the pull request, its CI runs and the reviewer identity.

Superpowers is optional: when it is installed, `/noomoo:task` delegates design, test-first implementation, review and verification to its skills; without it, the skill does the same phases itself. Both paths close each phase with the same core commands.

## Get started

1. Install the core package as shown above.
2. In Claude Code, run `/noomoo:setup`. It shows the installation plan and changes nothing until you confirm. The same from a terminal: `npx --no-install noomoo setup` prints the plan, `npx --no-install noomoo setup --yes` applies it and records it in `.noomoo/setup-manifest.json`.
3. Land the installation on your main branch with its own pull request from a service branch such as `chore/noomoo-setup`.
4. Run `/noomoo:start` to see where the project stands and what to do next.

`/noomoo:rollback` removes the installation by its manifest: it shows the plan first and keeps files you changed after setup.

## From idea to pull request

noomoo covers the whole delivery flow, and each step leaves a document or a fact that the next step checks:

1. **Intake.** `/noomoo:intake` turns raw material into a proposal for the owner.
2. **Specification.** `/noomoo:spec` describes the work as a traceable chain: requirement → use case → feature → task.
3. **Design.** `/noomoo:architect` writes decision records, architecture slices and data documents.
4. **Readiness.** A task is taken into work only when the readiness gate finds it executable without guessing.
5. **Plan.** The implementation plan is a versioned document, reviewed and approved before code changes.
6. **Delivery.** `/noomoo:task` carries the task through test-first implementation, review and full verification to a pull request.
7. **Report.** `/noomoo:report` records findings or a change to a live system with its evidence.

Document templates and the review rubrics ship with the core package (`node_modules/noomoo/docs/`). Documents are created with `noomoo scaffold`, which prints the exact shape, so names, sections and links stay checkable.

## Skills

| Skill | What it does |
|---|---|
| `/noomoo:start` | Shows where the project stands and the next step, from `noomoo next`. |
| `/noomoo:status` | Shows the project status: guard, last check, open work, items that need attention. Read-only; it does not run a validation to redraw the status. |
| `/noomoo:doctor` | Checks the noomoo installation in the repository. Read-only, works before setup. |
| `/noomoo:setup` | Installs noomoo into the repository: shows the plan, applies it on a yes. |
| `/noomoo:rollback` | Rolls the installation back by its manifest: shows the plan, applies it on a yes. |
| `/noomoo:validate` | Checks the project documentation with `noomoo validate`. Writes nothing. |
| `/noomoo:spec` | Describes a new piece of work as requirement, use case, feature and task before it is built. |
| `/noomoo:task <TASK-NNN>` | Carries one task from its document to a pull request through noomoo gates. The task delivery entry point. |
| `/noomoo:architect` | Writes a decision record, an architecture slice or a data document. |
| `/noomoo:intake` | Turns raw material or a forwarded message into an intake proposal for the owner. |
| `/noomoo:report` | Writes a report of findings or of a change made to a live system, with its evidence. |

## What the plugin runs

The skills run the core with the project's own package manager and never download it: `npx --no-install noomoo`, `pnpm exec noomoo`, `yarn exec -- noomoo` or `bun x --no-install noomoo`. If the package is missing, the skill asks you to install it and stops.

The plugin has two hooks:

- **SessionStart** reads only `package.json` and `.noomoo/setup-manifest.json`. If the project lists noomoo but was never set up, it prints a one-line hint to run `/noomoo:setup`. It starts no process.
- **PostToolUse** on `Edit` and `Write` does nothing until three conditions hold: the project has `.noomoo/setup-manifest.json`, you agreed to run noomoo in this repository (recorded by setup in `~/.config/noomoo/trusted-repos.json`), and the core is installed locally. Then it runs `noomoo claude-hook-docs` through the project's package manager, passes it the edit event, waits at most 20 seconds and returns its output to Claude as context.

Neither hook installs packages, opens a network connection or records trust. Setup, trust and repository policy stay explicit noomoo operations. For explicitly approved automation, project trust can also be supplied through `NOOMOO_TRUST_PROJECT=1`; noomoo never sets this variable itself.

The plugin itself installs nothing into Git or GitHub. When you confirm setup, the core can add Git hooks in `.githooks/` (`pre-commit` and `pre-push` run the documentation checks, `commit-msg` rejects AI signatures). When noomoo manages project hooks, setup may configure `core.hooksPath` for the noomoo-managed hook directory. Existing user-managed hook configuration is preserved according to setup ownership rules. Setup also adds the GitHub Actions workflow `.github/workflows/noomoo.yml`. It does not change branch protection, webhooks or secrets on GitHub. `/noomoo:rollback` removes all of it.

`/noomoo:task` works on a separate branch, in a Git worktree under `.worktrees/` when the project asks for it. It pushes the branch and opens a pull request only after you give an explicit go-ahead, and it never merges.

## Data and network access

- The plugin contains no network code and no telemetry. The public noomoo core package contains no telemetry sender.
- The core writes inside your repository: documents, configuration, Git hooks, a CI workflow, and a local git-ignored command log `docs/validation/events.jsonl`. Setup shows every file it will create before it writes.
- Commands that read a pull request, CI runs or the reviewer identity call the GitHub API with your token or your `gh` login.
- Model-based review (`task-ready`, `plan-ready --judge`, `estimate`) starts the Claude CLI installed on your machine with read-only tools and passes it the text of the document under review. That text goes to the Claude provider under your own account and terms.
- Git, `gh` and Claude Code talk to their own services under their own authentication and policies.

## Install the plugin

The primary channel is the Claude plugin directory, once the listing is available.

For a pre-release or as a fallback, load the release archive for one session. Download `noomoo-plugin-<version>.zip` and `SHA256SUMS` from the same noomoo release, check the archive, then start Claude Code with it:

```bash
shasum -a 256 -c SHA256SUMS --ignore-missing
claude --plugin-dir noomoo-plugin-<version>.zip
```

Use the plugin archive of the same release as the core package installed in your project.

## Documentation

Public documentation: https://noomoo.dev

## License

Apache-2.0.

noomoo is designed around a simple rule:

> Don't trust the agent. Trust the system.
