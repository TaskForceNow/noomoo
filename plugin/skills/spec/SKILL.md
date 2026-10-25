---
name: spec
description: Describe a new piece of work as requirement, use case, feature and task before building it.
argument-hint: <short title of the work>
allowed-tools:
  - Read
---

You describe one piece of work, `$ARGUMENTS`, as four linked documents: a requirement, a use case, a feature and a task. No title given: ask for one in a few words. You write documents only; you do not change code and do not run a task.

## How this skill works

- Every core command is called as `npx --no-install noomoo <command>` on npm and as `pnpm exec noomoo <command>` on pnpm, `yarn exec -- noomoo <command>` on yarn, `bun x --no-install noomoo <command>` on bun (the `packageManager` field of `package.json` decides, the lock file when the field is absent or names a manager the core does not support); each of them resolves to the `noomoo` package installed in the project. Use the form of the project's manager wherever a command is written below. If the command reports that the package is missing, ask the user to add it with the project's package manager and wait. Never fetch it any other way.
- Names of document sections, header keys and states are the words of the project and its language. Copy them from the output of `scaffold` and from the templates shipped in the package, never from memory, and never translate them.
- A document is never created by hand: `scaffold` gives the file a correct name, a free number and the shape that `validate` accepts.
- Talk to the user in the language the user writes in. The documents are written in the language of the project, which the scaffold output shows.
- Commit messages and pull request text carry no assistant signatures. You do not commit unless the user asks.

## Order

Create the documents in this order: requirement, use case, feature, task. A later document is linked to the earlier ones by ids that you pass to `scaffold` with the keys below; nothing links documents by their titles.

1. **Requirement.** What must be true, one verifiable statement per requirement.
2. **Use case.** Who does what to get that result, with the checkable outcomes.
3. **Feature.** The user-visible capability that realizes the use case.
4. **Task.** One piece of work that realizes the feature and names the requirements it covers.

## Creating one document

For each layer run the scaffold command, with the title in the language of the project:

```bash
npx --no-install noomoo scaffold --layer requirements --title "<title>"
npx --no-install noomoo scaffold --layer use-cases --title "<title>"
npx --no-install noomoo scaffold --layer features --title "<title>"
npx --no-install noomoo scaffold --layer tasks --title "<title>"
```

Keys, added to the command of the layer where the command takes them (a key on another layer is silently ignored, so do not pass it there):

- `--zone <zone>` on a use case, a feature or a task: the area of the work.
- `--parentReq <id>` on a use case or a feature: the id of the requirement, which is the common prefix of the ids of its numbered statements in the requirement file (statements numbered `<id>-1`, `<id>-2`); `scaffold` writes the link to every statement of that requirement.
- `--coverage <ids>` on a use case, a feature or a task: the ids it covers or realizes, spelled out instead of the link of `--parentReq`; on a task these are the numbered requirement statements and the use case ids.
- `--features <ids>` on a task: the feature id it belongs to.
- `--dependsOn <ids>` on a task: the tasks that must be done first.
- `--basis <number>` on a requirement: the approved intake proposal the requirement is written from. A requirement from raw material or a forwarded message is written only from an intake proposal the owner approved; name it here, and when you amend an existing requirement file, add the number to its basis line, separated by a comma.

The command prints one JSON object. `ok: true` carries `docId` and `path`: `path` is the file to fill. `docId` is the file name without its extension, not the id to refer to: the id of a document stands on its first line, and the numbered statements of a requirement carry their own ids inside the requirement file. Read the ids from the files you filled, never from memory and never by guessing a number. `ok: false` carries `reason`: show it to the user and fix the cause (a conflict means the document exists, so open it instead of creating another). A refusal ends with exit code 1; do not retry blindly.

Open the created file and fill it:

- Keep every section name and header key exactly as the scaffold wrote it. Replace only the placeholder text.
- After a use case or a feature is created, check that the line which links it to the requirement statements is not empty. A wrong id is accepted silently and leaves the line empty: then pass the right id again, or write the statement ids into the line by hand.
- Write facts and checkable statements. A placeholder, a "TBD" or an empty section is not a finished document.
- A document that lists the documents under it (the feature lists its tasks) gets those ids once they exist.

## Checking

Run the check after each document you finish:

```bash
npx --no-install noomoo validate --no-write
```

Exit code 0 closes the document. Any other exit code: retell every finding of level `error` to the user in one line with the file and the rule, fix the document and run the command again. Findings of lower levels you mention once and do not block on. Do not edit the validators, the configuration or documents other than these four to make a check pass, and do not skip a check. A value that a finding rejects (a zone, for instance) is listed in the finding itself: take it from there. A link missing between your own documents (a use case that covers no statement, a feature that realizes no requirement) is fixed in the document, with the ids read from the files.

One check cannot pass early: a feature that lists no task fails until the task exists. Create the task right after the feature, write the task id into the feature, and treat the feature and the task as closed together by one run of `validate` that ends with exit code 0. Every other document is closed by its own run before the next one is created.

## Final report

Name the four documents with their ids and paths, say that the last `validate` run ended with exit code 0 and paste its output, and list what is left to the user: reading the documents and deciding whether the task goes to a task run.
