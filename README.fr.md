# noomoo

[![license: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue)](LICENSE) ![platforms: Windows | macOS | Linux](https://img.shields.io/badge/platforms-Windows%20%7C%20macOS%20%7C%20Linux-blue) ![languages: 8](https://img.shields.io/badge/languages-8-brightgreen) ![Claude Code: plugin](https://img.shields.io/badge/Claude%20Code-plugin-D97757)

[English](README.md) · [Русский](README.ru.md) · [Deutsch](README.de.md) · [Español](README.es.md) · **Français** · [Português](README.pt-BR.md) · [中文](README.zh-CN.md) · [日本語](README.ja.md)

## Ne faites pas confiance à l'agent. Faites confiance au système.

**noomoo est un harnais d'ingénierie pour le développement logiciel par agents.**

Laissez les agents de code planifier, construire, tester, relire et livrer du logiciel dans des règles que votre équipe peut réellement faire respecter.

Au lieu de croire ce qu'un agent dit avoir fait, noomoo vérifie ce qui s'est passé dans le dépôt.

Conçu pour les équipes qui passent du code assisté par IA à la livraison logicielle autonome.

## L'IA a rendu le code bon marché. La vérification est le nouveau goulot d'étranglement.

Les agents de code savent déjà implémenter des fonctionnalités, corriger des bugs, lancer des tests, ouvrir des pull requests et répondre aux revues. La question n'est plus : **l'agent peut-il écrire le code ?** Les vraies questions sont :

- A-t-il compris l'exigence ?
- Est-il resté dans le périmètre de la tâche ?
- A-t-il respecté l'architecture ?
- A-t-il vraiment ajouté les tests ?
- Ces tests ont-ils vraiment été exécutés ?
- La revue est-elle encore valable après la dernière modification ?
- « Terminé » est-il un fait, ou juste ce que l'agent a dit ?

## L'agent ne peut pas contourner la porte avec des mots.

| Agent | noomoo |
|---|---|
| « Tous les tests passent. » | **Montre le résultat des tests pour cette révision précise.** |
| « J'ai relu la modification. » | **Montre un artefact de revue récent pour le code actuel.** |
| « J'ai seulement modifié ce que la tâche demandait. » | **Montre le diff et prouve le périmètre.** |
| « La tâche est terminée. » | **Prouve-le.** |

Un statut en langage naturel n'est pas une preuve. **L'état du dépôt est la preuve.**

## Les humains pilotent. Les agents exécutent. noomoo vérifie.

1. **Définir le résultat.** Exigences, cas d'utilisation, fonctionnalités et tâches forment une chaîne traçable. La tâche dit **ce qui doit être vrai**, pas comment l'agent doit le coder.
2. **Prouver que la tâche est exécutable.** Avant le début du travail, noomoo vérifie la structure, les limites, les liens et l'ambiguïté. Si la tâche ne peut pas être exécutée sans deviner, le travail ne commence pas.
3. **Planifier avant de modifier le code.** Le plan d'implémentation devient un artefact versionné couvrant l'implémentation, les contrats, les tests et les décisions.
4. **Laisser l'agent travailler.** L'agent de code implémente, teste, relit, corrige et prépare la livraison dans une branche ou un worktree isolé.
5. **Vérifier ce qui s'est réellement passé.** noomoo vérifie Git, les fichiers, l'AST, les tests, les artefacts de revue, la CI et les invariants propres au projet.
6. **N'avancer qu'avec une preuve.** Si les faits requis existent, le travail avance. Sinon, il s'arrête.

## Les instructions guident. noomoo fait respecter.

`CLAUDE.md`, `AGENTS.md`, les prompts et les skills sont utiles. Mais ils dépendent toujours de l'agent qui doit les lire, s'en souvenir, les interpréter et les suivre. noomoo les complète.

La CI vous dit si le code compile et si les tests passent. **La CI vérifie le code. noomoo vérifie le cycle de vie du développement autour de lui.**

**Laissez les agents faire plus de travail. Cessez de leur confier la correction de leurs propres copies.**

---

## noomoo pour Claude Code

noomoo est la couche de contrôle d'ingénierie pour les agents de code. Il vérifie ce qui s'est réellement passé dans le dépôt au lieu de faire confiance à ce que dit un agent : vérifications déterministes sur les documents, Git, les tests et la CI, portes de cycle de vie liées à la révision courante, état des revues et statut du projet.

Ce plugin apporte les workflows de noomoo dans Claude Code sous forme de skills. Chaque skill appelle le paquet du noyau noomoo installé dans votre projet ; le noyau est la source de vérité pour la validation et l'acceptation. Une phase de travail est close par le code de sortie d'une commande du noyau, pas par le rapport de l'agent. Le plugin ne remplace ni Git, ni vos tests, ni votre CI, ni la politique de votre dépôt.

## Prérequis

Le plugin n'installe pas le noyau : ajoutez vous-même le paquet noomoo à chaque projet. Sans lui, les skills vous demandent de l'installer et s'arrêtent.

- Node.js 20 ou plus récent et Git.
- Le paquet du noyau noomoo dans le projet, ajouté avec le gestionnaire de paquets que le projet utilise déjà :

```bash
npm install -D noomoo
pnpm add -D noomoo
yarn add -D noomoo
bun add -d noomoo
```

- GitHub CLI (`gh`), connecté, pour les étapes de `/noomoo:task` qui lisent la pull request, ses exécutions de CI et l'identité du relecteur.

Superpowers est facultatif : s'il est installé, `/noomoo:task` délègue à ses skills la conception, l'implémentation pilotée par les tests, la revue et la vérification ; sans lui, le skill mène les mêmes phases lui-même. Les deux chemins closent chaque phase avec les mêmes commandes du noyau.

## Prise en main

1. Installez le paquet du noyau comme indiqué ci-dessus.
2. Dans Claude Code, lancez `/noomoo:setup`. Il affiche le plan d'installation et ne change rien avant votre confirmation. La même chose depuis un terminal : `npx --no-install noomoo setup` affiche le plan, `npx --no-install noomoo setup --yes` l'applique et l'enregistre dans `.noomoo/setup-manifest.json`.
3. Intégrez l'installation dans votre branche principale par sa propre pull request depuis une branche de service comme `chore/noomoo-setup`.
4. Lancez `/noomoo:start` pour voir où en est le projet et quoi faire ensuite.

`/noomoo:rollback` retire l'installation d'après son manifeste : il affiche d'abord le plan et conserve les fichiers que vous avez modifiés après l'installation.

## De l'idée à la pull request

noomoo couvre tout le flux de livraison, et chaque étape laisse un document ou un fait que l'étape suivante vérifie :

1. **Intake.** `/noomoo:intake` transforme une matière brute en proposition pour le responsable.
2. **Spécification.** `/noomoo:spec` décrit le travail comme une chaîne traçable : exigence → cas d'utilisation → fonctionnalité → tâche.
3. **Conception.** `/noomoo:architect` rédige des enregistrements de décision, des coupes d'architecture et des documents de données.
4. **Préparation.** Une tâche n'est prise en charge que lorsque la porte de préparation la juge exécutable sans deviner.
5. **Plan.** Le plan d'implémentation est un document versionné, relu et approuvé avant toute modification du code.
6. **Livraison.** `/noomoo:task` mène la tâche par l'implémentation pilotée par les tests, la revue et la vérification complète jusqu'à une pull request.
7. **Rapport.** `/noomoo:report` consigne des constats ou une modification d'un système en production avec ses preuves.

Les modèles de documents et les grilles de revue sont livrés avec le paquet du noyau (`node_modules/noomoo/docs/`). Les documents sont créés avec `noomoo scaffold`, qui affiche la forme exacte, pour que noms, sections et liens restent vérifiables.

## Skills

| Skill | Ce qu'il fait |
|---|---|
| `/noomoo:start` | Montre où en est le projet et la prochaine étape, d'après `noomoo next`. |
| `/noomoo:status` | Montre le statut du projet : protection, dernière vérification, travail en cours, points à traiter. En lecture seule ; il ne lance pas de validation pour redessiner le statut. |
| `/noomoo:doctor` | Vérifie l'installation de noomoo dans le dépôt. En lecture seule, fonctionne avant l'installation. |
| `/noomoo:setup` | Installe noomoo dans le dépôt : affiche le plan, l'applique sur votre oui. |
| `/noomoo:rollback` | Annule l'installation d'après son manifeste : affiche le plan, l'applique sur votre oui. |
| `/noomoo:validate` | Vérifie la documentation du projet avec `noomoo validate`. N'écrit rien. |
| `/noomoo:spec` | Décrit un nouveau travail comme exigence, cas d'utilisation, fonctionnalité et tâche avant sa réalisation. |
| `/noomoo:task <TASK-NNN>` | Mène une tâche de son document jusqu'à une pull request à travers les portes de noomoo. Le point d'entrée de la livraison d'une tâche. |
| `/noomoo:architect` | Rédige un enregistrement de décision, une coupe d'architecture ou un document de données. |
| `/noomoo:intake` | Transforme une matière brute ou un message transféré en proposition d'intake pour le responsable. |
| `/noomoo:report` | Rédige un rapport de constats ou d'une modification apportée à un système en production, avec ses preuves. |

## Ce que le plugin exécute

Les skills lancent le noyau avec le gestionnaire de paquets du projet et ne le téléchargent jamais : `npx --no-install noomoo`, `pnpm exec noomoo`, `yarn exec -- noomoo` ou `bun x --no-install noomoo`. Si le paquet est absent, le skill vous demande de l'installer et s'arrête.

Les skills n'autorisent à l'avance aucune commande shell ni aucune modification de fichier. Claude Code vous demande avant chaque commande du noyau et chaque modification ; depuis cette demande, vous pouvez autoriser une commande pour le projet.

Le plugin a deux hooks :

- **SessionStart** lit uniquement `package.json` et `.noomoo/setup-manifest.json`. Si le projet déclare noomoo mais n'a jamais été installé, il affiche une ligne suggérant de lancer `/noomoo:setup`. Il ne démarre aucun processus.
- **PostToolUse** sur `Edit` et `Write` ne fait rien tant que trois conditions ne sont pas réunies : le projet a `.noomoo/setup-manifest.json`, vous avez accepté d'exécuter noomoo dans ce dépôt (enregistré par l'installation dans `~/.config/noomoo/trusted-repos.json`), et le noyau est installé localement. Il lance alors `noomoo claude-hook-docs` via le gestionnaire de paquets du projet, lui transmet l'événement de modification, attend au plus 20 secondes et renvoie sa sortie à Claude comme contexte.

Aucun hook n'installe de paquets, n'ouvre de connexion réseau ni n'enregistre de confiance. L'installation, la confiance et la politique du dépôt restent des opérations explicites de noomoo. Pour une automatisation explicitement approuvée, la confiance dans le projet peut aussi être fournie via `NOOMOO_TRUST_PROJECT=1` ; noomoo ne définit jamais cette variable lui-même.

Le plugin lui-même n'installe rien dans Git ni dans GitHub. Lorsque vous confirmez l'installation, le noyau peut ajouter des hooks Git dans `.githooks/` (`pre-commit` et `pre-push` lancent les vérifications de documentation, `commit-msg` rejette les signatures d'IA). Lorsque noomoo gère les hooks du projet, l'installation peut configurer `core.hooksPath` vers le répertoire de hooks géré par noomoo. Une configuration de hooks existante gérée par l'utilisateur est préservée selon les règles de propriété de l'installation. L'installation ajoute aussi le workflow GitHub Actions `.github/workflows/noomoo.yml`. Elle ne modifie ni la protection des branches, ni les webhooks, ni les secrets sur GitHub. `/noomoo:rollback` retire le tout.

`/noomoo:task` travaille sur une branche séparée, dans un worktree Git sous `.worktrees/` quand le projet le demande. Il pousse la branche et ouvre une pull request uniquement après votre accord explicite, et ne fusionne jamais.

## Données et accès réseau

- Le plugin ne contient aucun code réseau ni aucune télémétrie. Le paquet public du noyau noomoo ne contient aucun émetteur de télémétrie.
- Le noyau écrit dans votre dépôt : documents, configuration, hooks Git, un workflow de CI et un journal local de commandes ignoré par git, `docs/validation/events.jsonl`. L'installation affiche chaque fichier qu'elle va créer avant d'écrire.
- Les commandes qui lisent une pull request, des exécutions de CI ou l'identité du relecteur appellent l'API GitHub avec votre jeton ou votre connexion `gh`.
- La revue par modèle (`task-ready`, `plan-ready --judge`, `estimate`) lance la CLI Claude installée sur votre machine avec des outils en lecture seule et lui transmet le texte du document relu. Ce texte part chez le fournisseur de Claude sous votre propre compte et vos propres conditions.
- Git, `gh` et Claude Code communiquent avec leurs propres services, sous leur propre authentification et leurs propres politiques.

## Installer le plugin

Installez le plugin dans Claude Code depuis le marketplace de ce dépôt :

```bash
/plugin marketplace add TaskForceNow/noomoo
/plugin install noomoo@noomoo
```

À partir de Claude Code 2.1.275, la même chose en une seule commande :

```bash
/plugin install noomoo --marketplace TaskForceNow/noomoo
```

L'annuaire des plugins Claude deviendra le second canal dès qu'il sera disponible.

En solution de repli, chargez l'archive de la version pour une session. Téléchargez `noomoo-plugin-<version>.zip` et `SHA256SUMS` depuis la même [version](https://github.com/TaskForceNow/noomoo/releases) de noomoo, vérifiez l'archive, puis lancez Claude Code avec :

```bash
shasum -a 256 -c SHA256SUMS --ignore-missing
claude --plugin-dir noomoo-plugin-<version>.zip
```

Utilisez l'archive du plugin de la même version que le paquet du noyau installé dans votre projet.

## Projets sur noomoo 2.x

noomoo 3.0.0 est la ligne actuelle pour les nouvelles installations. Les projets existants sur noomoo 2.x devraient rester sur leur version actuelle jusqu'à ce que le chemin de migration 2.x → 3.x pris en charge soit disponible.

## Documentation

Documentation publique : https://noomoo.dev

## Licence

Apache-2.0.

noomoo repose sur une règle simple :

> Ne faites pas confiance à l'agent. Faites confiance au système.
