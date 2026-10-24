---
name: doctor
description: Check the noomoo installation in this repository. Read-only, works before setup.
allowed-tools: Bash
---

You show the state of the noomoo installation in the current repository and write nothing.

```bash
npx --no-install noomoo doctor
```

Retell the result in the user's language: what is in order, what is not, and what `setup` fixes. If the command reports that the `noomoo` package is missing, stop and ask the user to add it to the project with the project's package manager (`npm install --save-dev noomoo`, `pnpm add -D noomoo`, `yarn add -D noomoo`, `bun add -d noomoo`): do not try to fetch the package any other way.

The project's package manager decides how a core command starts: `npx --no-install noomoo <command>` on npm, `pnpm exec noomoo <command>` on pnpm, `yarn exec -- noomoo <command>` on yarn, `bun x --no-install noomoo <command>` on bun (the `packageManager` field of `package.json` decides, the lock file when the field is absent or names a manager the core does not support). Use the form of the project's manager wherever a command is written above.
