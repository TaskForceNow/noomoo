# noomoo

[English](README.md) · [Русский](README.ru.md) · [Deutsch](README.de.md) · **Español** · [Français](README.fr.md) · [Português](README.pt-BR.md) · [中文](README.zh-CN.md) · [日本語](README.ja.md)

## No confíes en el agente. Confía en el sistema.

**noomoo es un arnés de ingeniería para el desarrollo de software con agentes.**

Deja que los agentes de código planifiquen, construyan, prueben, revisen y entreguen software dentro de reglas que tu equipo realmente puede hacer cumplir.

En lugar de creer lo que un agente dice que hizo, noomoo comprueba lo que pasó en el repositorio.

Pensado para equipos que pasan de la programación asistida por IA a la entrega autónoma de software.

## La IA abarató el código. La verificación es el nuevo cuello de botella.

Los agentes de código ya implementan funcionalidades, corrigen errores, ejecutan pruebas, abren pull requests y responden a las revisiones. La pregunta ya no es: **¿Puede el agente escribir el código?** Las preguntas reales son:

- ¿Entendió el requisito?
- ¿Se mantuvo dentro de la tarea?
- ¿Siguió la arquitectura?
- ¿Añadió de verdad las pruebas?
- ¿Se ejecutaron de verdad esas pruebas?
- ¿Sigue siendo válida la revisión tras el último cambio?
- ¿«Hecho» es un hecho o solo algo que dijo el agente?

## El agente no puede convencer a la puerta de control.

| Agente | noomoo |
|---|---|
| «Todas las pruebas pasan». | **Muestra el resultado de las pruebas para esta revisión exacta.** |
| «Revisé el cambio». | **Muestra un artefacto de revisión reciente para el código actual.** |
| «Solo cambié lo que pedía la tarea». | **Muestra el diff y demuestra el alcance.** |
| «La tarea está hecha». | **Demuéstralo.** |

Un estado en lenguaje natural no es una prueba. **El estado del repositorio es la prueba.**

## Las personas dirigen. Los agentes ejecutan. noomoo verifica.

1. **Define el resultado.** Requisitos, casos de uso, funcionalidades y tareas forman una cadena trazable. La tarea dice **qué debe ser cierto**, no cómo debe programarlo el agente.
2. **Demuestra que la tarea es ejecutable.** Antes de empezar, noomoo comprueba la estructura, los límites, los enlaces y la ambigüedad. Si la tarea no se puede ejecutar sin adivinar, el trabajo no empieza.
3. **Planifica antes de cambiar código.** El plan de implementación se convierte en un artefacto versionado que cubre implementación, contratos, pruebas y decisiones.
4. **Deja trabajar al agente.** El agente de código implementa, prueba, revisa, corrige y prepara la entrega en una rama o worktree aislados.
5. **Verifica lo que pasó realmente.** noomoo comprueba Git, archivos, AST, pruebas, artefactos de revisión, CI e invariantes propios del proyecto.
6. **Avanza solo con pruebas.** Si los hechos necesarios existen, el trabajo avanza. Si no, se detiene.

## Las instrucciones orientan. noomoo hace cumplir.

`CLAUDE.md`, `AGENTS.md`, los prompts y los skills son útiles. Pero siguen dependiendo de que el agente los lea, los recuerde, los interprete y los siga. noomoo los complementa.

La CI te dice si el código compila y si pasan las pruebas. **La CI comprueba el código. noomoo comprueba el ciclo de vida del desarrollo a su alrededor.**

**Deja que los agentes hagan más trabajo. Deja de confiar en que se pongan nota a sí mismos.**

---

## noomoo para Claude Code

noomoo es la capa de control de ingeniería para agentes de código. Comprueba lo que pasó realmente en el repositorio en lugar de confiar en lo que dice un agente: comprobaciones deterministas sobre documentos, Git, pruebas y CI, puertas del ciclo de vida ligadas a la revisión actual, estado de la revisión y estado del proyecto.

Este plugin lleva los flujos de trabajo de noomoo a Claude Code como skills. Cada skill llama al paquete del núcleo de noomoo instalado en tu proyecto; el núcleo es la fuente de verdad para la validación y la aceptación. Una fase de trabajo se cierra con el código de salida de un comando del núcleo, no con el informe del agente. El plugin no sustituye a Git, a tus pruebas, a tu CI ni a la política de tu repositorio.

## Requisitos

El plugin no instala el núcleo: añade tú mismo el paquete noomoo a cada proyecto. Sin él, los skills te piden instalarlo y se detienen.

- Node.js 20 o posterior y Git.
- El paquete del núcleo de noomoo en el proyecto, añadido con el gestor de paquetes que el proyecto ya usa:

```bash
npm install -D noomoo
pnpm add -D noomoo
yarn add -D noomoo
bun add -d noomoo
```

- GitHub CLI (`gh`) con sesión iniciada, para los pasos de `/noomoo:task` que leen el pull request, sus ejecuciones de CI y la identidad del revisor.

Superpowers es opcional: si está instalado, `/noomoo:task` delega en sus skills el diseño, la implementación guiada por pruebas, la revisión y la verificación; sin él, el skill recorre las mismas fases por sí mismo. Ambos caminos cierran cada fase con los mismos comandos del núcleo.

## Primeros pasos

1. Instala el paquete del núcleo como se muestra arriba.
2. En Claude Code, ejecuta `/noomoo:setup`. Muestra el plan de instalación y no cambia nada hasta que confirmes. Lo mismo desde una terminal: `npx --no-install noomoo setup` imprime el plan, `npx --no-install noomoo setup --yes` lo aplica y lo registra en `.noomoo/setup-manifest.json`.
3. Lleva la instalación a tu rama principal con su propio pull request desde una rama de servicio como `chore/noomoo-setup`.
4. Ejecuta `/noomoo:start` para ver en qué punto está el proyecto y qué hacer a continuación.

`/noomoo:rollback` elimina la instalación según su manifiesto: primero muestra el plan y conserva los archivos que cambiaste después de la instalación.

## De la idea al pull request

noomoo cubre todo el flujo de entrega, y cada paso deja un documento o un hecho que comprueba el paso siguiente:

1. **Intake.** `/noomoo:intake` convierte material en bruto en una propuesta para el responsable.
2. **Especificación.** `/noomoo:spec` describe el trabajo como una cadena trazable: requisito → caso de uso → funcionalidad → tarea.
3. **Diseño.** `/noomoo:architect` escribe registros de decisiones, cortes de arquitectura y documentos de datos.
4. **Preparación.** Una tarea entra en trabajo solo cuando la puerta de preparación la considera ejecutable sin adivinar.
5. **Plan.** El plan de implementación es un documento versionado, revisado y aprobado antes de cambiar código.
6. **Entrega.** `/noomoo:task` lleva la tarea por la implementación guiada por pruebas, la revisión y la verificación completa hasta un pull request.
7. **Informe.** `/noomoo:report` registra hallazgos o un cambio en un sistema en producción con sus evidencias.

Las plantillas de documentos y las rúbricas de revisión vienen con el paquete del núcleo (`node_modules/noomoo/docs/`). Los documentos se crean con `noomoo scaffold`, que imprime la forma exacta, para que nombres, secciones y enlaces sigan siendo comprobables.

## Skills

| Skill | Qué hace |
|---|---|
| `/noomoo:start` | Muestra en qué punto está el proyecto y el siguiente paso, desde `noomoo next`. |
| `/noomoo:status` | Muestra el estado del proyecto: protección, última comprobación, trabajo abierto, elementos que requieren atención. Solo lectura; no lanza una validación para redibujar el estado. |
| `/noomoo:doctor` | Comprueba la instalación de noomoo en el repositorio. Solo lectura, funciona antes de la instalación. |
| `/noomoo:setup` | Instala noomoo en el repositorio: muestra el plan y lo aplica con tu sí. |
| `/noomoo:rollback` | Revierte la instalación según su manifiesto: muestra el plan y lo aplica con tu sí. |
| `/noomoo:validate` | Comprueba la documentación del proyecto con `noomoo validate`. No escribe nada. |
| `/noomoo:spec` | Describe un nuevo trabajo como requisito, caso de uso, funcionalidad y tarea antes de construirlo. |
| `/noomoo:task <TASK-NNN>` | Lleva una tarea desde su documento hasta un pull request a través de las puertas de noomoo. El punto de entrada para entregar una tarea. |
| `/noomoo:architect` | Escribe un registro de decisión, un corte de arquitectura o un documento de datos. |
| `/noomoo:intake` | Convierte material en bruto o un mensaje reenviado en una propuesta de intake para el responsable. |
| `/noomoo:report` | Escribe un informe de hallazgos o de un cambio hecho en un sistema en producción, con sus evidencias. |

## Qué ejecuta el plugin

Los skills ejecutan el núcleo con el gestor de paquetes del proyecto y nunca lo descargan: `npx --no-install noomoo`, `pnpm exec noomoo`, `yarn exec -- noomoo` o `bun x --no-install noomoo`. Si falta el paquete, el skill te pide instalarlo y se detiene.

Los skills no aprueban de antemano ningún comando de shell ni ningún cambio de archivo. Claude Code te pregunta antes de cada comando del núcleo y de cada edición; desde esa pregunta puedes permitir un comando para el proyecto.

El plugin tiene dos hooks:

- **SessionStart** lee solo `package.json` y `.noomoo/setup-manifest.json`. Si el proyecto incluye noomoo pero nunca se instaló, imprime una línea que sugiere ejecutar `/noomoo:setup`. No inicia ningún proceso.
- **PostToolUse** sobre `Edit` y `Write` no hace nada hasta que se cumplen tres condiciones: el proyecto tiene `.noomoo/setup-manifest.json`, aceptaste ejecutar noomoo en este repositorio (la instalación lo registra en `~/.config/noomoo/trusted-repos.json`) y el núcleo está instalado localmente. Entonces ejecuta `noomoo claude-hook-docs` con el gestor de paquetes del proyecto, le pasa el evento de edición, espera como máximo 20 segundos y devuelve su salida a Claude como contexto.

Ningún hook instala paquetes, abre conexiones de red ni registra confianza. La instalación, la confianza y la política del repositorio siguen siendo operaciones explícitas de noomoo. Para automatizaciones aprobadas explícitamente, la confianza en el proyecto también puede indicarse con `NOOMOO_TRUST_PROJECT=1`; noomoo nunca define esta variable por sí mismo.

El plugin no instala nada en Git ni en GitHub. Cuando confirmas la instalación, el núcleo puede añadir hooks de Git en `.githooks/` (`pre-commit` y `pre-push` ejecutan las comprobaciones de documentación, `commit-msg` rechaza firmas de IA). Cuando noomoo gestiona los hooks del proyecto, la instalación puede configurar `core.hooksPath` hacia el directorio de hooks gestionado por noomoo. La configuración de hooks existente gestionada por el usuario se conserva según las reglas de propiedad de la instalación. La instalación también añade el flujo de GitHub Actions `.github/workflows/noomoo.yml`. No cambia la protección de ramas, los webhooks ni los secretos en GitHub. `/noomoo:rollback` lo elimina todo.

`/noomoo:task` trabaja en una rama separada, en un worktree de Git bajo `.worktrees/` cuando el proyecto lo pide. Hace push de la rama y abre un pull request solo después de tu autorización explícita, y nunca hace merge.

## Datos y acceso a la red

- El plugin no contiene código de red ni telemetría. El paquete público del núcleo de noomoo no contiene ningún emisor de telemetría.
- El núcleo escribe dentro de tu repositorio: documentos, configuración, hooks de Git, un flujo de CI y un registro local de comandos ignorado por git, `docs/validation/events.jsonl`. La instalación muestra cada archivo que va a crear antes de escribir.
- Los comandos que leen un pull request, ejecuciones de CI o la identidad del revisor llaman a la API de GitHub con tu token o tu sesión de `gh`.
- La revisión basada en modelo (`task-ready`, `plan-ready --judge`, `estimate`) inicia la CLI de Claude instalada en tu máquina con herramientas de solo lectura y le pasa el texto del documento revisado. Ese texto va al proveedor de Claude bajo tu propia cuenta y tus condiciones.
- Git, `gh` y Claude Code se comunican con sus propios servicios bajo su propia autenticación y sus propias políticas.

## Instalar el plugin

Instala el plugin en Claude Code desde el marketplace de este repositorio:

```bash
/plugin install noomoo --marketplace TaskForceNow/noomoo
```

En versiones de Claude Code anteriores a 2.1.275, añade primero el marketplace:

```bash
/plugin marketplace add TaskForceNow/noomoo
/plugin install noomoo@noomoo
```

El directorio de plugins de Claude será el segundo canal cuando esté disponible.

Como alternativa, carga el archivo de la versión para una sesión. Descarga `noomoo-plugin-<version>.zip` y `SHA256SUMS` de la misma [versión](https://github.com/TaskForceNow/noomoo/releases) de noomoo, comprueba el archivo y luego inicia Claude Code con él:

```bash
shasum -a 256 -c SHA256SUMS --ignore-missing
claude --plugin-dir noomoo-plugin-<version>.zip
```

Usa el archivo del plugin de la misma versión que el paquete del núcleo instalado en tu proyecto.

## Proyectos en noomoo 2.x

noomoo 3.0.0 es la línea actual para nuevas instalaciones. Los proyectos existentes en noomoo 2.x deberían mantenerse fijados en su versión actual hasta que exista la ruta de migración 2.x → 3.x soportada.

## Documentación

Documentación pública: https://noomoo.dev

## Licencia

Apache-2.0.

noomoo se basa en una regla sencilla:

> No confíes en el agente. Confía en el sistema.
