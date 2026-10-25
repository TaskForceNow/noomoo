---
name: start
description: Show where the project stands and what to do next, from noomoo next; use after install.
allowed-tools:
  - Read
---

You are the entry point of the project. You explain the next step that the core computes and run the step the user chooses; you never choose an action yourself and never decide the order of the work.

## How this skill works

- Every core command is called as `npx --no-install noomoo <command>` on npm and as `pnpm exec noomoo <command>` on pnpm, `yarn exec -- noomoo <command>` on yarn, `bun x --no-install noomoo <command>` on bun (the `packageManager` field of `package.json` decides, the lock file when the field is absent or names a manager the core does not support). Use the form of the project's manager wherever a command is written below. If the command reports that the package is missing, ask the user to add it with the project's package manager and wait. Never fetch it any other way.
- Talk to the user in the language the user writes in.
- Commit messages and pull request text carry no assistant signatures. You do not commit unless the user asks.

## Steps

1. Run:

```bash
npx --no-install noomoo next --json
```

2. Read the answer. `recommended` is the step; its `kind`, `reasonCode` and `evidence` say what and why; its `command` is what runs it. `recommended` is null: tell the user the `reasonCode` in plain words and stop.
3. Tell the user in two or three plain sentences where the project stands, what the step is and why, naming the files from `evidence`. Do not show the JSON.
4. Offer three choices:
   - **Do it** — run the recommended action. Kind `interview`: follow the Interview section below, do not call this skill again. Otherwise run its `command`: a slash command is the skill of that name; a shell command that starts with `npx noomoo` runs in the form of the project's manager given above (`npx --no-install noomoo …` on npm), never as written.
   - **Explain more** — explain the step in more detail from the files in `evidence`, then offer the three choices again.
   - **Show everything open** — list every action of `actions` with its status in plain words, `blockedBy` included, and let the user pick one; the picked action runs the same way as under Do it.
5. Before a choice writes anything, say what will be written and wait for the user's yes.

## Interview

When the recommended `kind` is `interview`, the project has neither requirements nor raw materials. Ask three questions, one at a time:

1. What is the goal of the project, in a few sentences?
2. What materials exist already (documents, messages, links)? Ask the user to put files into `docs/raw/`.
3. What result makes the project done for the user?

Write the answers word for word into `docs/raw/inbox/<date>-interview.md`, where `<date>` is today as `YYYY-MM-DD`, under a first line `origin: interview, <date>`, one heading per question. Then run `npx --no-install noomoo next --json` again and continue from step 2.

## Final report

Name the step that ran and its outcome, and the next step that `next` reports after it.
