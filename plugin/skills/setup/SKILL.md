---
name: setup
description: Install noomoo into this repository; shows the plan, applies on a yes.
---

You install noomoo into the current repository and show the plan first.

## Consent

Do not apply without an explicit "yes" from the user in the conversation. The order is this: first show the plan, which changes nothing:

```bash
npx --no-install noomoo setup
```

Retell the plan in the user's language: what will be created, which scripts and git keys will change, and what happens to a foreign `core.hooksPath`. Only after an explicit "yes" apply it:

```bash
npx --no-install noomoo setup --yes
```

A foreign `core.hooksPath` stays by default; it can be replaced only at the user's separate request, with the `--hooks=replace` flag. After applying, name the manifest `.noomoo/setup-manifest.json`. If the command reports that the `noomoo` package is missing, stop and ask the user to add it to the project with the project's package manager (`npm install --save-dev noomoo`, `pnpm add -D noomoo`, `yarn add -D noomoo`, `bun add -d noomoo`): do not try to fetch the package any other way.

The project's package manager decides how a core command starts: `npx --no-install noomoo <command>` on npm, `pnpm exec noomoo <command>` on pnpm, `yarn exec -- noomoo <command>` on yarn, `bun x --no-install noomoo <command>` on bun (the `packageManager` field of `package.json` decides, the lock file when the field is absent or names a manager the core does not support). Use the form of the project's manager wherever a command is written above.
