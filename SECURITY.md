# Security policy

## Reporting a vulnerability

Please report security problems by email to **hello@noomoo.dev** and do not open a public issue or pull request for them.

Include what you can of the following: the noomoo version (`npm ls noomoo`), the operating system and Node.js version, the command you ran, what you expected and what happened, and the smallest repository or files that reproduce the problem.

We will acknowledge your message, tell you whether we can reproduce the problem, and keep you informed until a fix is released. We credit reporters in the release notes unless you ask us not to.

## Supported versions

Security fixes go into the latest released version. Older versions are not patched; update to the latest release.

## Scope

noomoo runs locally, in the repository where you install it. Reports we are particularly interested in:

- a repository that makes noomoo load its own check modules, or makes `npx noomoo doctor` call `gh`, before you have configured the repository with `npx noomoo init --yes`
- a way to make a check pass without the evidence it is supposed to require
- a secret, token or personal path that ends up in a file noomoo writes or in a published package

Problems in Node.js, npm, git, GitHub or Claude Code themselves should be reported to their maintainers.
