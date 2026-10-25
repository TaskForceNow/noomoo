---
name: validate
description: Check the project documentation with noomoo validate. Writes nothing.
---

You run the documentation check of the project and fix nothing yourself. The run writes nothing into the project: it neither changes the documents and the configuration nor leaves snapshots behind.

```bash
npx --no-install noomoo validate --no-write
```

Afterwards look for traces. A package that does not know the mode ignores the flag silently and writes its snapshots, so the traces are the only way to tell.

```bash
git status --porcelain -- docs/validation
```

If the second command prints files, the installed package does not know the mode: name those files to the user, say that the package is too old, and do not run the check again.

Retell the verdict and the main findings in the user's language, and name which of them are fixed by editing the documents. If the command reports that the `noomoo` package is missing, stop and ask the user to add it to the project with the project's package manager (`npm install --save-dev noomoo`, `pnpm add -D noomoo`, `yarn add -D noomoo`, `bun add -d noomoo`): do not try to fetch the package any other way.

The project's package manager decides how a core command starts: `npx --no-install noomoo <command>` on npm, `pnpm exec noomoo <command>` on pnpm, `yarn exec -- noomoo <command>` on yarn, `bun x --no-install noomoo <command>` on bun (the `packageManager` field of `package.json` decides, the lock file when the field is absent or names a manager the core does not support). Use the form of the project's manager wherever a command is written above.
