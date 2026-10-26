# noomoo

[![license: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue)](LICENSE) ![platforms: Windows | macOS | Linux](https://img.shields.io/badge/platforms-Windows%20%7C%20macOS%20%7C%20Linux-blue) ![languages: 8](https://img.shields.io/badge/languages-8-brightgreen) ![Claude Code: plugin](https://img.shields.io/badge/Claude%20Code-plugin-D97757)

[English](README.md) · [Русский](README.ru.md) · **Deutsch** · [Español](README.es.md) · [Français](README.fr.md) · [Português](README.pt-BR.md) · [中文](README.zh-CN.md) · [日本語](README.ja.md)

## Vertraue nicht dem Agenten. Vertraue dem System.

**noomoo ist ein Engineering-Harness für agentische Softwareentwicklung.**

Coding-Agenten planen, bauen, testen, reviewen und liefern Software aus – innerhalb von Regeln, die Ihr Team tatsächlich durchsetzen kann.

Statt dem zu glauben, was ein Agent über seine Arbeit sagt, prüft noomoo, was im Repository tatsächlich passiert ist.

Gebaut für Teams auf dem Weg von KI-gestütztem Programmieren zu autonomer Softwareauslieferung.

## KI hat Code billig gemacht. Der neue Engpass ist die Verifikation.

Coding-Agenten können bereits Features umsetzen, Fehler beheben, Tests ausführen, Pull Requests öffnen und auf Reviews reagieren. Die Frage lautet nicht mehr: **Kann der Agent den Code schreiben?** Die eigentlichen Fragen sind:

- Hat er die Anforderung verstanden?
- Ist er innerhalb der Aufgabe geblieben?
- Hat er die Architektur eingehalten?
- Hat er die Tests wirklich hinzugefügt?
- Sind diese Tests wirklich gelaufen?
- Ist das Review nach der letzten Änderung noch gültig?
- Ist „fertig“ eine Tatsache – oder nur eine Aussage des Agenten?

## Der Agent kann sich nicht am Gate vorbeireden.

| Agent | noomoo |
|---|---|
| „Alle Tests sind grün.“ | **Zeig das Testergebnis für genau diese Revision.** |
| „Ich habe die Änderung reviewt.“ | **Zeig ein frisches Review-Artefakt für den aktuellen Code.** |
| „Ich habe nur geändert, was die Aufgabe verlangt.“ | **Zeig den Diff und beweise den Umfang.** |
| „Die Aufgabe ist erledigt.“ | **Beweise es.** |

Ein Status in natürlicher Sprache ist kein Beweis. **Der Zustand des Repositorys ist der Beweis.**

## Menschen steuern. Agenten führen aus. noomoo verifiziert.

1. **Ergebnis definieren.** Anforderungen, Use Cases, Features und Aufgaben bilden eine nachverfolgbare Kette. Die Aufgabe sagt, **was wahr sein muss**, nicht wie der Agent es programmieren soll.
2. **Ausführbarkeit der Aufgabe beweisen.** Bevor die Arbeit beginnt, prüft noomoo Struktur, Grenzen, Verknüpfungen und Mehrdeutigkeit. Lässt sich die Aufgabe nicht ohne Raten ausführen, beginnt die Arbeit nicht.
3. **Planen, bevor Code geändert wird.** Der Implementierungsplan wird zu einem versionierten Artefakt mit Implementierung, Verträgen, Tests und Entscheidungen.
4. **Den Agenten arbeiten lassen.** Der Coding-Agent implementiert, testet, reviewt, korrigiert und bereitet die Auslieferung in einem isolierten Branch oder Worktree vor.
5. **Prüfen, was tatsächlich passiert ist.** noomoo prüft Git, Dateien, AST, Tests, Review-Artefakte, CI und projektspezifische Invarianten.
6. **Nur mit Beweis weitergehen.** Liegen die nötigen Fakten vor, geht die Arbeit weiter. Wenn nicht, stoppt sie.

## Anweisungen leiten an. noomoo setzt durch.

`CLAUDE.md`, `AGENTS.md`, Prompts und Skills sind nützlich. Aber sie hängen weiterhin davon ab, dass der Agent sie liest, behält, auslegt und befolgt. noomoo ergänzt sie.

CI sagt Ihnen, ob der Code baut und die Tests bestehen. **CI prüft den Code. noomoo prüft den Entwicklungslebenszyklus drumherum.**

**Lassen Sie Agenten mehr Arbeit machen. Aber lassen Sie sie nicht ihre eigenen Hausaufgaben benoten.**

---

## noomoo für Claude Code

noomoo ist die Engineering-Kontrollschicht für Coding-Agenten. Es prüft, was im Repository tatsächlich passiert ist, statt dem Bericht eines Agenten zu vertrauen: deterministische Prüfungen von Dokumenten, Git, Tests und CI, an die aktuelle Revision gebundene Lebenszyklus-Gates, Review-Zustand und Projektstatus.

Dieses Plugin bringt noomoo-Workflows als Skills in Claude Code. Jeder Skill ruft das im Projekt installierte noomoo-Kernpaket auf; der Kern ist die maßgebliche Quelle für Validierung und Abnahme. Eine Arbeitsphase wird durch den Exit-Code eines Kernbefehls abgeschlossen, nicht durch den Bericht des Agenten. Das Plugin ersetzt weder Git noch Ihre Tests, Ihre CI oder Ihre Repository-Richtlinien.

## Voraussetzungen

Das Plugin installiert den Kern nicht: Fügen Sie das noomoo-Paket jedem Projekt selbst hinzu. Ohne das Paket fordern die Skills Sie zur Installation auf und brechen ab.

- Node.js 20 oder neuer und Git.
- Das noomoo-Kernpaket im Projekt, hinzugefügt mit dem Paketmanager, den das Projekt bereits verwendet:

```bash
npm install -D noomoo
pnpm add -D noomoo
yarn add -D noomoo
bun add -d noomoo
```

- GitHub CLI (`gh`), angemeldet, für die Schritte von `/noomoo:task`, die den Pull Request, seine CI-Läufe und die Identität des Reviewers lesen.

Superpowers ist optional: Ist es installiert, delegiert `/noomoo:task` Entwurf, testgetriebene Implementierung, Review und Verifikation an dessen Skills; ohne Superpowers durchläuft der Skill dieselben Phasen selbst. Beide Wege schließen jede Phase mit denselben Kernbefehlen ab.

## Erste Schritte

1. Installieren Sie das Kernpaket wie oben gezeigt.
2. Führen Sie in Claude Code `/noomoo:setup` aus. Es zeigt den Installationsplan und ändert nichts, bis Sie bestätigen. Dasselbe im Terminal: `npx --no-install noomoo setup` gibt den Plan aus, `npx --no-install noomoo setup --yes` wendet ihn an und hält ihn in `.noomoo/setup-manifest.json` fest.
3. Bringen Sie die Installation mit einem eigenen Pull Request aus einem Service-Branch wie `chore/noomoo-setup` in Ihren Hauptbranch.
4. Führen Sie `/noomoo:start` aus, um zu sehen, wo das Projekt steht und was als Nächstes zu tun ist.

`/noomoo:rollback` entfernt die Installation anhand ihres Manifests: Es zeigt zuerst den Plan und behält Dateien, die Sie nach dem Setup geändert haben.

## Von der Idee zum Pull Request

noomoo deckt den gesamten Auslieferungsablauf ab, und jeder Schritt hinterlässt ein Dokument oder einen Fakt, den der nächste Schritt prüft:

1. **Intake.** `/noomoo:intake` macht aus Rohmaterial einen Vorschlag für den Owner.
2. **Spezifikation.** `/noomoo:spec` beschreibt die Arbeit als nachverfolgbare Kette: Anforderung → Use Case → Feature → Aufgabe.
3. **Entwurf.** `/noomoo:architect` schreibt Entscheidungsdokumente, Architekturschnitte und Datendokumente.
4. **Bereitschaft.** Eine Aufgabe wird erst in Arbeit genommen, wenn das Readiness-Gate sie als ohne Raten ausführbar einstuft.
5. **Plan.** Der Implementierungsplan ist ein versioniertes Dokument, das vor jeder Codeänderung reviewt und freigegeben wird.
6. **Auslieferung.** `/noomoo:task` führt die Aufgabe durch testgetriebene Implementierung, Review und vollständige Verifikation bis zum Pull Request.
7. **Bericht.** `/noomoo:report` hält Befunde oder eine Änderung an einem Live-System mit ihren Belegen fest.

Dokumentvorlagen und Review-Rubriken werden mit dem Kernpaket ausgeliefert (`node_modules/noomoo/docs/`). Dokumente entstehen mit `noomoo scaffold`, das die genaue Form ausgibt, sodass Namen, Abschnitte und Verweise prüfbar bleiben.

## Skills

| Skill | Was er tut |
|---|---|
| `/noomoo:start` | Zeigt, wo das Projekt steht, und den nächsten Schritt aus `noomoo next`. |
| `/noomoo:status` | Zeigt den Projektstatus: Schutz, letzte Prüfung, offene Arbeit, Punkte, die Aufmerksamkeit brauchen. Nur lesend; er startet keine Validierung, um den Status neu zu zeichnen. |
| `/noomoo:doctor` | Prüft die noomoo-Installation im Repository. Nur lesend, funktioniert schon vor dem Setup. |
| `/noomoo:setup` | Installiert noomoo im Repository: zeigt den Plan, wendet ihn nach Ihrem Ja an. |
| `/noomoo:rollback` | Setzt die Installation anhand ihres Manifests zurück: zeigt den Plan, wendet ihn nach Ihrem Ja an. |
| `/noomoo:validate` | Prüft die Projektdokumentation mit `noomoo validate`. Schreibt nichts. |
| `/noomoo:spec` | Beschreibt neue Arbeit als Anforderung, Use Case, Feature und Aufgabe, bevor sie gebaut wird. |
| `/noomoo:task <TASK-NNN>` | Führt eine Aufgabe von ihrem Dokument durch die noomoo-Gates bis zum Pull Request. Der Einstiegspunkt für die Auslieferung einer Aufgabe. |
| `/noomoo:architect` | Schreibt ein Entscheidungsdokument, einen Architekturschnitt oder ein Datendokument. |
| `/noomoo:intake` | Macht aus Rohmaterial oder einer weitergeleiteten Nachricht einen Intake-Vorschlag für den Owner. |
| `/noomoo:report` | Schreibt einen Bericht über Befunde oder über eine Änderung an einem Live-System, mit Belegen. |

## Was das Plugin ausführt

Die Skills starten den Kern mit dem Paketmanager des Projekts und laden ihn nie herunter: `npx --no-install noomoo`, `pnpm exec noomoo`, `yarn exec -- noomoo` oder `bun x --no-install noomoo`. Fehlt das Paket, fordert der Skill Sie zur Installation auf und bricht ab.

Die Skills genehmigen vorab keinen Shell-Befehl und keine Dateiänderung. Claude Code fragt Sie vor jedem Kernbefehl und jeder Bearbeitung; über diese Abfrage können Sie einen Befehl für das Projekt erlauben.

Das Plugin hat zwei Hooks:

- **SessionStart** liest nur `package.json` und `.noomoo/setup-manifest.json`. Listet das Projekt noomoo, wurde aber nie eingerichtet, gibt er einen einzeiligen Hinweis aus, `/noomoo:setup` auszuführen. Er startet keinen Prozess.
- **PostToolUse** auf `Edit` und `Write` tut nichts, bis drei Bedingungen erfüllt sind: Das Projekt hat `.noomoo/setup-manifest.json`, Sie haben zugestimmt, noomoo in diesem Repository auszuführen (vom Setup in `~/.config/noomoo/trusted-repos.json` festgehalten), und der Kern ist lokal installiert. Dann führt er `noomoo claude-hook-docs` über den Paketmanager des Projekts aus, übergibt das Bearbeitungsereignis, wartet höchstens 20 Sekunden und gibt die Ausgabe als Kontext an Claude zurück.

Keiner der Hooks installiert Pakete, öffnet Netzwerkverbindungen oder hält Vertrauen fest. Setup, Vertrauen und Repository-Richtlinien bleiben explizite noomoo-Operationen. Für ausdrücklich genehmigte Automatisierung kann Projektvertrauen auch über `NOOMOO_TRUST_PROJECT=1` übergeben werden; noomoo setzt diese Variable nie selbst.

Das Plugin selbst installiert nichts in Git oder GitHub. Wenn Sie das Setup bestätigen, kann der Kern Git-Hooks in `.githooks/` hinzufügen (`pre-commit` und `pre-push` führen die Dokumentationsprüfungen aus, `commit-msg` weist KI-Signaturen zurück). Verwaltet noomoo die Projekt-Hooks, kann das Setup `core.hooksPath` auf das von noomoo verwaltete Hook-Verzeichnis setzen. Eine bestehende, vom Benutzer verwaltete Hook-Konfiguration bleibt nach den Eigentumsregeln des Setups erhalten. Das Setup fügt außerdem den GitHub-Actions-Workflow `.github/workflows/noomoo.yml` hinzu. Branch-Schutz, Webhooks und Secrets auf GitHub ändert es nicht. `/noomoo:rollback` entfernt all das.

`/noomoo:task` arbeitet in einem separaten Branch, in einem Git-Worktree unter `.worktrees/`, wenn das Projekt es verlangt. Es pusht den Branch und öffnet einen Pull Request erst nach Ihrer ausdrücklichen Freigabe und merged nie.

## Daten und Netzwerkzugriff

- Das Plugin enthält keinen Netzwerkcode und keine Telemetrie. Das öffentliche noomoo-Kernpaket enthält keinen Telemetrie-Sender.
- Der Kern schreibt innerhalb Ihres Repositorys: Dokumente, Konfiguration, Git-Hooks, einen CI-Workflow und ein lokales, von Git ignoriertes Befehlsprotokoll `docs/validation/events.jsonl`. Das Setup zeigt jede Datei, die es anlegen wird, bevor es schreibt.
- Befehle, die einen Pull Request, CI-Läufe oder die Identität des Reviewers lesen, rufen die GitHub-API mit Ihrem Token oder Ihrer `gh`-Anmeldung auf.
- Das modellbasierte Review (`task-ready`, `plan-ready --judge`, `estimate`) startet die auf Ihrem Rechner installierte Claude CLI mit rein lesenden Werkzeugen und übergibt ihr den Text des geprüften Dokuments. Dieser Text geht unter Ihrem eigenen Konto und Ihren Bedingungen an den Claude-Anbieter.
- Git, `gh` und Claude Code kommunizieren mit ihren eigenen Diensten unter ihrer eigenen Authentifizierung und ihren eigenen Richtlinien.

## Plugin installieren

Installieren Sie das Plugin in Claude Code aus dem Marketplace in diesem Repository:

```bash
/plugin marketplace add TaskForceNow/noomoo
/plugin install noomoo@noomoo
```

Ab Claude Code 2.1.275 geht dasselbe mit einem Befehl:

```bash
/plugin install noomoo --marketplace TaskForceNow/noomoo
```

Das Claude-Pluginverzeichnis wird der zweite Kanal, sobald es verfügbar ist.

Als Ausweichweg laden Sie das Release-Archiv für eine Sitzung. Laden Sie `noomoo-plugin-<version>.zip` und `SHA256SUMS` aus demselben noomoo-[Release](https://github.com/TaskForceNow/noomoo/releases) herunter, prüfen Sie das Archiv und starten Sie Claude Code damit:

```bash
shasum -a 256 -c SHA256SUMS --ignore-missing
claude --plugin-dir noomoo-plugin-<version>.zip
```

Verwenden Sie das Plugin-Archiv desselben Releases wie das in Ihrem Projekt installierte Kernpaket.

## Projekte auf noomoo 2.x

noomoo 3.0.0 ist die aktuelle Linie für neue Installationen. Bestehende Projekte auf noomoo 2.x sollten auf ihrer aktuellen Version bleiben, bis der unterstützte Migrationspfad 2.x → 3.x verfügbar ist.

## Dokumentation

Öffentliche Dokumentation: https://noomoo.dev

## Lizenz

Apache-2.0.

noomoo folgt einer einfachen Regel:

> Vertraue nicht dem Agenten. Vertraue dem System.
