---
name: report
description: Write a report of findings or of a change made to a live system, with its evidence.
argument-hint: <title of the report>
allowed-tools:
  - Read
---

You write one report, `$ARGUMENTS`: facts with the evidence behind each. No title given: ask for one in a few words. You write the report only; you do not change code and you do not write the task journal.

## How this skill works

- Every core command is called as `npx --no-install noomoo <command>` on npm and as `pnpm exec noomoo <command>` on pnpm, `yarn exec -- noomoo <command>` on yarn, `bun x --no-install noomoo <command>` on bun (the `packageManager` field of `package.json` decides, the lock file when the field is absent or names a manager the core does not support); each of them resolves to the `noomoo` package installed in the project. Use the form of the project's manager wherever a command is written below. If the command reports that the package is missing, ask the user to add it with the project's package manager and wait. Never fetch it any other way.
- Names of document sections, header keys and states are the words of the project and its language. Copy them from the output of `scaffold` and from the templates shipped in the package, never from memory, and never translate them.
- A document is never created by hand: `scaffold` gives the file a correct name, a free number where the layer has numbers, and the shape that `validate` accepts.
- Talk to the user in the language the user writes in. The documents are written in the language of the project, which the scaffold output shows.
- Commit messages and pull request text carry no assistant signatures. You do not commit unless the user asks.

## Two kinds of report

The kind of a report is the kind of its task, because the check compares the two. Ask the user for the id of the task first and read the task file in the task directory of the project: its header line of kind says which kind it is.

- **Research report**: the task is of the research kind. The report is what was found by reading and running read-only commands. This is the default of `scaffold`, so no kind key is passed.
- **Report of a change**: any other task. The report is what was changed in a live system, where, with what, how to roll it back and how the result was measured. Its scaffold carries an extra header line and extra sections for that. A task without a header line of kind is of this kind.

Never claim a change in a research report. If the facts do not fit the kind of the task, say so to the user instead of changing the kind word.

## Creating the report

```bash
npx --no-install noomoo scaffold --layer reports --title "<title>"
npx --no-install noomoo scaffold --layer reports --kind <kind> --title "<title>"
```

The first form makes a research report. The second makes the report of a change: `<kind>` is the kind word of the task as the project writes it, and a wrong word is refused with the list in `reason`, so take the word from there. The command prints one JSON object: `ok: true` carries `docId` and `path`, `ok: false` carries `reason`, and a refusal ends with exit code 1. Fill the file at `path`.

## Filling the report

The scaffold puts a hint in every place that wants a fact. A hint left in the report is an error of `validate`, so replace every hint with a fact or with an honest statement that there is nothing:

- Keep every section name and header key exactly as the scaffold wrote it, and keep the kind word it wrote in the line that names the task.
- Replace the placeholder task id in that line with the id of the task the report belongs to. The task must exist in the task directory of the project, or the check refuses the report: never invent an id.
- Name the sources of the facts: the systems, files and commands they were taken from.
- Every conclusion carries an anchor: a path and a line, a command, an id or a link. The check reads an anchor only in one of three forms, so write it as code in backticks, as an id of a document, or as a Markdown link `[text](url)`; a bare address is not read as an anchor. A conclusion without an anchor is not a fact.
- List what you could not establish and why; do not write a guess as a fact.
- List the backlog records the report opened, or state that none were.
- A report of a change also names the entries of the task journal it relies on. Those entries are written by the task skill: name them, do not create them.
- Read `docs/reports/TEMPLATES.md` when the project has the file; the scaffold output and the file it wrote stay the authority on names.

## Checking

```bash
npx --no-install noomoo validate --no-write
```

Exit code 0 closes the report. Any other exit code: retell every finding of level `error` to the user in one line with the file and the rule, fix the report and run the command again. Findings of lower levels you mention once and do not block on. Do not edit the validators, the configuration or documents other than the report to make a check pass, and do not skip a check. A value that a finding rejects is listed in the finding itself: take it from there.

## Final report

Name the report with its `path`, say that the last `validate` run ended with exit code 0 and paste its output, list the facts you could not establish, and list what is left to the user: reading the report and deciding what follows from it.
