---
name: status
description: Show the project status: guard, last check, open work, attention. Read-only.
allowed-tools: Bash
---

You show the project status as the core computes it and write nothing.

```bash
npx --no-install noomoo status
```

Show the output as it is: do not recount anything from the files, do not retell it in other words and do not add advice it does not contain. The plain output groups the items that need attention by rule, with a count and one example each; only when the user asks for every item, run `npx --no-install noomoo status --details` once — the flag takes no argument; for the merge state of the branch against the target branch, run `npx --no-install noomoo context-status`.

If the command answers that the directory is not a noomoo project, say so and offer `/noomoo:setup`. Do not add write flags. If the command reports that the `noomoo` package is missing, stop and ask the user to add it to the project with the project's package manager (`npm install --save-dev noomoo`, `pnpm add -D noomoo`, `yarn add -D noomoo`, `bun add -d noomoo`): do not try to fetch the package any other way.

The project's package manager decides how a core command starts: `npx --no-install noomoo <command>` on npm, `pnpm exec noomoo <command>` on pnpm, `yarn exec -- noomoo <command>` on yarn, `bun x --no-install noomoo <command>` on bun (the `packageManager` field of `package.json` decides, the lock file when the field is absent or names a manager the core does not support). Use the form of the project's manager wherever a command is written above.
