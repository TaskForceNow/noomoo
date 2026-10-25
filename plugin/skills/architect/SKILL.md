---
name: architect
description: Write a decision record, an architecture slice or a data document with noomoo scaffold.
argument-hint: <decision | slice | entity | contract> <title or slice name>
allowed-tools:
  - Read
---

You write down one design document, `$ARGUMENTS`: a decision record, an architecture slice, or a data layer document. No kind given or the kind is unclear: ask which of the three the user wants. You write documents only; you do not change code.

## How this skill works

- Every core command is called as `npx --no-install noomoo <command>` on npm and as `pnpm exec noomoo <command>` on pnpm, `yarn exec -- noomoo <command>` on yarn, `bun x --no-install noomoo <command>` on bun (the `packageManager` field of `package.json` decides, the lock file when the field is absent or names a manager the core does not support); each of them resolves to the `noomoo` package installed in the project. Use the form of the project's manager wherever a command is written below. If the command reports that the package is missing, ask the user to add it with the project's package manager and wait. Never fetch it any other way.
- Names of document sections, header keys and states are the words of the project and its language. Copy them from the output of `scaffold` and from the templates shipped in the package, never from memory, and never translate them.
- A document is never created by hand: `scaffold` gives the file a correct name, a free number where the layer has numbers, and the shape that `validate` accepts.
- Talk to the user in the language the user writes in. The documents are written in the language of the project, which the scaffold output shows.
- Commit messages and pull request text carry no assistant signatures. You do not commit unless the user asks.

## Which document

- **Decision record** — a choice that outlives one task: its context, the choice, how its execution is confirmed, what it costs.
- **Architecture slice** — one part of the system described once: the slices are a closed list, one file per slice, no number.
- **Data layer document** — an entity of the domain, or the contract of one API resource.

If the user describes several, create them one after another and check each before the next.

## Decision record

```bash
npx --no-install noomoo scaffold --layer decisions --title "<title>"
```

Add `--taskId <TASK-NNN>` when the decision belongs to a task and takes the number of that task; it is accepted only on the decisions and proposals layers, and a malformed id is refused. Without the key the next free number is taken.

The command prints one JSON object: `ok: true` carries `docId` and `path`, `ok: false` carries `reason`, and a refusal ends with exit code 1. Fill the file at `path`: the date and status in the header line, then every section, keeping the section names and the header keys exactly as the scaffold wrote them. The section that confirms the decision must name something checkable (a command, a finding of a gate, a rule, a review step), not a promise to watch. If the project has `docs/decisions/README.md`, read it first: the rules of the layer are there.

## Architecture slice

```bash
npx --no-install noomoo scaffold --layer architecture --slice <slice>
```

No title is given and no number is allocated: the file name comes from the slice. To see the allowed slices run the command with a name that does not exist; the refusal lists them in `reason`. Pick the slice with the user, do not invent one. A conflict (`ok: false`, exit code 1) means the slice file exists: open it and extend it instead.

A new slice fails `validate` on purpose until every section it declares has text. A table in the section of decisions is read as a protocol of decision axes with states, so write the decisions there as prose or a list, not as a plain table. If you do keep an axis table, its state column says who closed the axis: take the value that is true, never one that claims an answer of the owner that was not given. Fill them all with facts of this project; do not leave a section empty and do not write filler to make a check pass.

## Data layer document

An entity is the default kind, a contract needs `--kind contract`:

```bash
npx --no-install noomoo scaffold --layer data --title "<entity name>"
npx --no-install noomoo scaffold --layer data --kind contract --title "<resource>"
```

Fill the file at `path`:

- **Entity.** Every section of the scaffold gets text. The fields go into the table and only there: one row per field, the field name is one word of lowercase Latin letters, digits and underscores that starts with a letter, and equals the column name in the schema (a column named in camel case is written in lowercase in the table, and the difference is stated in the purpose column); the kind column takes the values the scaffold shows; a derived field names in the source column what it is derived from, and only a stored field keeps the dash there. The purpose column says why the field exists: a row never states a type, a length, whether the value is required, a default, an index or a migration, because the form of the data belongs to the schema and a finding forbids it here. Invariants are statements that can be checked.
- **Contract.** One block per endpoint, headed by the method and the path of the endpoint instead of the placeholder path; add a block by copying the shape of the first one. Every key line of a block gets a value. The line that declares the data of an endpoint lists entries separated by commas, each of the form `ENT-NNN.<field> <operation>`: the entity id stands on the first line of the entity file, the field is a field of that entity table, and the operation is the last word of the entry; the allowed operations are listed by the finding that rejects a wrong one, and an entity or a field that does not exist is rejected too, so declare only what the entity documents hold.

Read the rules in `docs/data/TEMPLATES.md` when the project has the file; the scaffold output and the file it wrote stay the authority on names.

## Checking

```bash
npx --no-install noomoo validate --no-write
```

Exit code 0 closes the document. Any other exit code: retell every finding of level `error` to the user in one line with the file and the rule, fix the document and run the command again. Findings of lower levels you mention once and do not block on. Do not edit the validators, the configuration or documents other than the one you are writing to make a check pass, and do not skip a check. A value that a finding rejects is listed in the finding itself: take it from there.

## Final report

Name each document with its `path`, say that the last `validate` run ended with exit code 0 and paste its output, and list what is left to the user: reading the documents and deciding what is built from them.
