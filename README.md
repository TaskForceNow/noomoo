# noomoo

noomoo checks what happened in your repository instead of trusting what a coding agent says it did. It reads the documents, the git history and the CI runs of the project, and it closes each step of a task by the exit code of a deterministic check, not by an agent's report.

This repository distributes the noomoo Claude Code plugin. The core is the npm package [`noomoo`](https://www.npmjs.com/package/noomoo); every skill of the plugin runs the core installed in your project.

## Install

1. Add the core to the project with the package manager the project already uses. It needs Node.js 20 or newer and git.

```
npm install -D noomoo
pnpm add -D noomoo
yarn add -D noomoo
bun add -d noomoo
```

2. Install the plugin in Claude Code:

```
/plugin install noomoo --marketplace TaskForceNow/noomoo
```

On Claude Code older than 2.1.275, add the marketplace first:

```
/plugin marketplace add TaskForceNow/noomoo
/plugin install noomoo@noomoo
```

3. Run `/noomoo:setup` to see the installation plan; nothing changes until you confirm. Then `/noomoo:start` shows where the project stands and the next step.

Each [release](https://github.com/TaskForceNow/noomoo/releases) also publishes the plugin zip, the core tarball, `SHA256SUMS` and `release-manifest.json`. To load the zip for one session, check it with `shasum -a 256 -c SHA256SUMS --ignore-missing` and start Claude Code with `claude --plugin-dir noomoo-plugin-<version>.zip`. Use the plugin of the same release as the core package in your project.

## Projects on noomoo 2.x

noomoo 3.0.0 is the current line for new installations. Existing projects on noomoo 2.x should remain pinned to their current version until the supported 2.x → 3.x migration path is available.

## What is here

- `plugin/` — the plugin as shipped in the release zip: manifest, README, hooks and skills. See [plugin/README.md](plugin/README.md) for the skills, hooks and data access.
- `.claude-plugin/marketplace.json` — the marketplace that points Claude Code to `plugin/`.

The core source is not in this repository yet.

## Documentation

- [Install](https://noomoo.dev/install/)
- [Documentation](https://noomoo.dev/docs/)
- [Privacy](https://noomoo.dev/privacy/)
- [Security](SECURITY.md)
- [Support](https://noomoo.dev/support/)

## License

Apache-2.0. See `LICENSE` and `NOTICE`.
