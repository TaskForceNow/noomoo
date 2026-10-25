---
name: task
description: Carry one task from its document to a pull request through noomoo gates.
argument-hint: <TASK-NNN>
allowed-tools:
  - Read
  - Glob
  - Grep
---

You carry exactly one task, `$ARGUMENTS` (an id such as `TASK-042`), from its task document to a pull request. No id given: ask for one. Flags and free text do not replace it.

## How this skill works

- A phase is closed by the exit code of the core command on its `Closing command:` line, never by your own report. Exit code 0 closes the phase. Any other exit code: show the command output, fix the cause and run the command again. Do not move on, do not edit a gate, do not skip a hook with `--no-verify`.
- Every core command is called as `npx --no-install noomoo <command>` on npm and as `pnpm exec noomoo <command>` on pnpm, `yarn exec -- noomoo <command>` on yarn, `bun x --no-install noomoo <command>` on bun (the `packageManager` field of `package.json` decides, the lock file when the field is absent or names a manager the core does not support); each of them resolves to the `noomoo` package installed in the project. Use the form of the project's manager wherever a command is written below. If the command reports that the package is missing, ask the user to add it with the project's package manager (`npm install --save-dev noomoo`, `pnpm add -D noomoo`, `yarn add -D noomoo`, `bun add -d noomoo`) and wait. Never fetch it any other way.
- The task document and the requirements it covers are read-only for you. A contradiction or an impossible requirement in them is a blocker: quote the file and line, and wait for the owner.
- Names of document sections, header keys and states are the words of the project and its language. Copy them from command output and from the templates shipped in the package, never from memory, and never translate them. A new document is created with `npx --no-install noomoo scaffold`, which prints the exact shape.
- Talk to the user in the language the user writes in.
- Stage files by name and never run `git add -A`. Commit messages, pull request text and comments carry no assistant signatures: the `commit-msg` hook and the pull request check reject them.
- Never merge the pull request, never kill other processes and never free a busy port.

## Before Phase 1

1. Find the task document in the task directory of the project (`docs/tasks/task-<NNN>-*.md` unless the project says otherwise). Exactly one match; any other count is a stop, and you say so.
2. Read the tools of the project:

```bash
npx --no-install noomoo contour-config
```

   The JSON names `git.targetBranch`, `git.branchPattern`, `git.commitTemplate`, `git.isolation` and `commands.test`, `commands.lint`, `commands.typecheck`, `commands.gate`, `commands.format`. An empty command means that step is skipped. Use only these commands from now on.
3. Find out who signs the stamps:

```bash
npx --no-install noomoo identity
```

   Exit code 0 prints the confirmed GitHub login and the run kind. Any other exit code is a stop: stamps and review rounds need a confirmed identity.
4. Compare the commands with CI: read `.github/workflows/*.yml` or the equivalent. Whatever CI runs and the contour config does not name, run in Phase 9 as well, and report the gap as a defect of the contour.
5. Work on a branch cut from the target branch by `git.branchPattern`, never on the target branch. If `git.isolation` is `worktree`, create a separate git worktree at `.worktrees/<branch>` under the project root, where `<branch>` is the branch name with every / replaced by -. If you already stand in a linked worktree (the outputs of `git rev-parse --absolute-git-dir` and `git rev-parse --path-format=absolute --git-common-dir` differ), create no second one: you are isolated already, so cut your branch there. Otherwise the project root is the output of `git rev-parse --show-toplevel`. Before creating the worktree, check with `git check-ignore -q .worktrees/` in the project root that git ignores it; a project installed before this rule may not, then add the line `.worktrees/` to the file printed by `git rev-parse --git-path info/exclude` (local to the clone, nothing to commit) and tell the human that running `setup` again puts the line into `.gitignore`. The worktree goes nowhere else: never next to the project folder, never outside the project. If the project's test runner or type checker collects files from the whole tree rather than from named directories, add `.worktrees/` to its ignore list as part of the task, or the copies run twice. Write down its absolute path and start every shell call with `cd "<that path>"` (quoted). Before the first write and before every commit run `pwd` and `git rev-parse --abbrev-ref HEAD` and show both outputs.
6. If the checkout has no dependencies yet, install them (with `node_modules` at the project root they often resolve from there; Plug'n'Play and a branch that changes dependencies need their own install), then run `commands.test` once before any change and note the number of tests: Phase 9 compares against it.

## Two branches, one command set

The skill has one set of commands and two ways of doing the thinking. The plugin is present when the list of the `Skill` tool names entries `superpowers:*`.

**With the superpowers plugin.** Delegate the thinking, follow the delegated skill, and keep the closing commands of this skill:

- Design and forks (Phase 2): `Skill(skill: "superpowers:brainstorming")`.
- Test-first implementation (Phases 5 and 6): `Skill(skill: "superpowers:test-driven-development")`.
- Review (Phases 7 and 8): `Skill(skill: "superpowers:requesting-code-review")` produces the review and `Skill(skill: "superpowers:receiving-code-review")` handles it.
- Verification (Phase 9): `Skill(skill: "superpowers:verification-before-completion")`.

**Without the superpowers plugin.** Do the same phases yourself by the same rules:

- Design and forks: read the task, the requirements and the code first, then list the decision axes and settle each one by an anchor or a question.
- Test-first implementation: write the failing test, run it, see it fail for the right reason, then write the least code that makes it pass.
- Review: read your own diff as a stranger would, against each covered requirement, and write down every doubt as a finding.
- Verification: run every command and paste its fresh output; claim nothing that output does not show.

Both branches call the same closing commands in the same order. The branch changes who does the thinking, not what closes a phase.

## When to stop and ask

Stop before writing any code when a decision axis has two or more options, each resting on a file and a line, and the choice does not follow from the task document, the covered requirements or the code. Ask the owner, one question per axis, with four elements:

- **Axis** - which decision axis the fork belongs to; the decision protocol of the plan template lists the seven axes by name.
- **Options** - two or more, each with evidence as `file:line`.
- **Recommendation** - the option you would pick and why, from facts of the project and not from taste.
- **Cost of the alternative** - what gets rewritten if the owner picks another option.

Rules for questions:

- Do not ask what the task document or the covered requirements already state. Re-read both in full before every question: an answer that is already written is not a question.
- Do not ask what the code can answer. Search the code first and close that axis with an anchor `file:line`. An anchor into `node_modules`, outside the project or on the first line of a file closes nothing.
- Only an axis that is expensive to change becomes a question. Names, argument order and message wording are yours. A new external dependency and a new top-level directory are always asked.
- The owner may answer "decide yourself". Record it as that.
- Five questions per task at most. A sixth means the task is too large or underspecified: report it as a blocker.
- Zero questions is a normal outcome when every axis is closed by an anchor.
- The answers of the owner stand through every later phase. To depart from one, ask again.

## Phases

### Phase 1 — Readiness gate

Read the task document in full, the requirements it covers and the code it touches before running the gate.

Closing command: `npx --no-install noomoo task-ready <TASK-NNN>` — exit code 0.

The project sets the gate's strictness with `readiness.strict` in `config/pipeline.json`; it is strict by default, so a fork-level finding fails the gate as well. This skill passes no strictness of its own: every driver judges a task alike. A red gate means the task is not taken: show the findings to the owner and do not edit the task document yourself. After the owner fixes it, run the gate again, because closing one fork can open another. Exit codes 3 (round budget spent), 4 (unfinished predecessors), 5 (judge timeout) and 6 (judge failed to start) are blockers: report them as they are.

### Phase 2 — Owner question

For each of the seven axes of the decision protocol decide: a fork, or closed by an anchor. Ask the questions in one batch (up to four per message) in the form of the section above, and wait for the answers. Write each answer into the decision protocol of the plan, creating the plan file from the template if it does not exist yet, and stamp it.

Closing command: `npx --no-install noomoo stamp <TASK-NNN> --axis "<axis>" --state "<state>"` — exit code 0.

Axis names and states are the words of the project: copy them from the plan template. A state the command does not know ends with exit code 2 and the list of valid states. The command refuses to sign an owner's answer when it runs as an agent, so an axis the owner answered is stamped by the owner: show the exact `stamp` command with the owner-answer state and ask the owner to run it in their own terminal. If the owner declines, stamp the state the command accepts from you, keep the owner's words and the date of the answer on the protocol line, and in Phase 11 do not list that axis among the decisions made without an owner answer.

Without a fork: when no axis needs an answer there is nothing to stamp and the phase has no command of its own. Close every axis with an anchor in the plan; the `plan-ready` run that closes Phase 3 judges the protocol as well and fails on an axis with neither answer nor anchor, so Phases 2 and 3 close together on that run.

### Phase 3 — Plan

Write the plan from the answers, not the answers from the plan. Put it in `docs/tasks/implementations/task-<NNN>-plan.md` and take its shape from the implementation plan template in `node_modules/noomoo/docs/tasks/TEMPLATES.md`; copy the headings from the template verbatim. The plan states the contracts word for word (names, signatures, message texts, exit codes), lists the tests first, each with its expected result, lists the implementation steps with concrete file paths, and closes every criterion of the task document with at least one test or step, marked the way the template shows. The decision protocol closes every axis by an answer or by an anchor.

Closing command: `npx --no-install noomoo plan-ready <TASK-NNN>` — exit code 0.

This run applies deterministic rules only. A red plan is fixed by you and is not shown to the owner.

### Phase 4 — Plan gate and approval stamp

Where a mistake is expensive (a new module boundary, someone else's contract, an irreversible migration), ask for a judge round with `npx --no-install noomoo plan-ready <TASK-NNN> --judge`; three rounds at most. Exit code 3 means the round budget is spent: take the collected findings to the owner instead of starting a fourth round, and record the owner's decision with `npx --no-install noomoo stamp <TASK-NNN> --gate plan --reason "<reason>"`.

Then show the green plan to the owner and wait for an explicit approval. On approval the stamp is set with `npx --no-install noomoo stamp <TASK-NNN> --plan` by whoever GitHub verifies the commit for: if the project's stamp rule is on (`stamps.since` in `contour-config`) and your commits are not signed as the owner, show the owner that exact command and ask them to run it in their own terminal; otherwise run it yourself. Never write the approval line by hand: the command takes the login and the run kind from the GitHub identity, and a hand-written line fails the gate. Commit the plan before asking for approval. The command commits the approval line itself, in a commit of its own with a subject built from `git.commitTemplate`, signed by the git of whoever runs it while the stamp rule is on; do not commit the approval line yourself: the commit that adds a stamp must be signed by the stamp's login. If the command refuses because the commit failed, show the reason and the command to the owner and ask them to run it in their own terminal. The closing command reads the plan from the commits of the branch, not from the working tree.

Closing command: `npx --no-install noomoo phase-check <TASK-NNN> --phase 3` — exit code 0.

If the check names a missing plan review, the project requires a judge round for this task number: run `npx --no-install noomoo plan-ready <TASK-NNN> --judge` and the check again.

### Phase 5 — Test-first implementation

Write the tests listed in the red section of the plan first. Run them and show that each fails for the right reason. Commit the tests alone, with a message built from `git.commitTemplate`, then write the code that makes them pass, in small commits. Mock only the external boundary (network, file system, clock): a test that is green for any implementation is not a test. Existing tests belong to others. Do not delete, rename or weaken them; if one contradicts the new contract, adapt it keeping its subject and explain the change in the report.

Closing command: `npx --no-install noomoo phase-check <TASK-NNN> --phase 4` — exit code 0.

### Phase 6 — Targeted tests

Run the test command named by `contour-config` on the files you touched, then the lint and typecheck commands if they are set. All of them must finish with exit code 0, and you show their output.

Closing command: `npx --no-install noomoo contour-config` — exit code 0.

Core has no test runner: the core cannot run the tests of the project, so the phase closes by the exit code of the test, lint and typecheck commands that `contour-config` names.

### Phase 7 — Code review round

Open a review round, then review the diff against the covered requirements: every claim implemented and covered by a test. The command creates the round scaffold in the review artifact of the task. Write each finding as the scaffold shows, with the reviewer, the date and the branch head as the command recorded them. Use the login printed by `identity`; add `--kind agent --model <model>` when the review is yours.

Closing command: `npx --no-install noomoo code-review <TASK-NNN> --who <login>` — exit code 0.

Round opened only: exit code 0 means the round exists, not that the review passed. What the review found is judged in Phase 8.

### Phase 8 — Review fixes

Give every finding a decision line in the form the scaffold shows: fixed by a commit (name its hash), or rejected with evidence (command output, or a code quote with path and line). Disagreeing is allowed, agreeing without checking is not. After the last code change on the branch open a new round with the same command: a round older than the branch head is stale. If a finding changes a decision of the owner, name the axis you missed and suggest a backlog note about a convention that would close it by an anchor next time.

Closing command: `npx --no-install noomoo phase-check <TASK-NNN> --phase 5` — exit code 0.

### Phase 9 — Full project check

Run the complete test command and show the summary line of every runner, then the lint, typecheck and format commands if they are set, then the commands from the CI comparison that the contour config lacks. Count the added test cases from the diff against the target branch (`git diff <target>...HEAD -- <test directories>`, lines starting with `+` that open a test case); the count must match the growth of the test total since the start, and deleted cases must be zero.

Closing command: `npx --no-install noomoo validate --profile full` — exit code 0.

### Phase 10 — Acceptance of all phases

Run the cumulative acceptance levels 1 to 6 of `phase-check` (its levels, not the phases of this skill) and paste its raw output together with its exit code. A report without that output is not accepted. Fix what a red check names; do not argue with it.

Closing command: `npx --no-install noomoo phase-check <TASK-NNN> --phase 6` — exit code 0.

### Phase 11 — Pull request

1. Close the axis of the task on the branch with `npx --no-install noomoo close-axis <TASK-NNN> --in-branch --apply` and commit the change.
2. Write the journal entry that the acceptance check asks for; its message names the expected file and the heading form.
3. Show the owner the diff and the proposed pull request title, with the task key, and wait for an explicit go-ahead.
4. Push the branch and open the pull request against `git.targetBranch`. The body carries a block for decisions made without an owner answer: for each axis stamped as accepted by the executor whose protocol line carries no dated owner answer, the axis, the decision and why nobody could be asked. No such axis: say so in one line.
5. Wait for CI and the automatic review, and handle every comment by a fix on the same branch or a reasoned rejection. Do not merge.

Closing command: `npx --no-install noomoo phase-check <TASK-NNN> --phase all` — exit code 0.

The pull request number alone is not enough: the check needs the pull request to be open and based on the target branch. Run it after CI on the pull request head has finished: the `ci-green` check judges the CI runs of that exact revision and stays red with "CI not verified" while they are still running.

## Refresh the agent context

Before the final report, and before ending any session, refresh the context the next session starts from. Run `npx --no-install noomoo context-status --write`: it rebuilds `.agent/context/status.md` and `.agent/context/current-state.md` from the repository. Then rewrite `.agent/context/handoff.md` below its header in these sections only: "Done in this session", "Current work", "Open owner decisions", "Blocking questions" and "Next action" with one action. When the work is finished, the next action is "None: no work in progress." Stamp it with `npx --no-install noomoo context-status --handoff <active|completed|blocked>`: `completed` when nothing is in progress, `blocked` when you stop on a blocker, `active` otherwise. These files are a convenience view, not evidence: never cite them in place of a command's output.

## Final report

There are two valid endings. Either all eleven phases are closed and the raw output of the closing commands is pasted with their exit codes, or you report a blocker: where you stopped, the evidence (command output, or a quote with file and line) and what you need from the human. Words like "ready" or "waiting" without that output are not a report. A blocker is a normal successful ending. Quietly bending the task to fit your implementation is the only real failure.

The report names the branch, the pull request, which branch of the skill you used, the decisions made without an owner answer, and what is left to the human: the merge, and after it, only if you created a worktree in preparation step 5, its removal with `git worktree remove .worktrees/<branch>`, run from the project root; a worktree you found already standing is not yours to name for removal.
