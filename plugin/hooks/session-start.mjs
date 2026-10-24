/**
 * Plugin `SessionStart` hook. In a project that lists the noomoo package but was never set up, print
 * a static hint to run setup: only `package.json` and the manifest path are read, and the text is a
 * literal because the hook cannot read the message catalog before installation. In a set-up
 * project with user consent and the core installed, print what `context-status --check` reports:
 * one line per stale or missing agent context file, nothing when all are current. Without consent
 * no repository code runs; a failing or silent core leaves the hook silent. Always exits with code 0.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { coreReady, project, runCore } from './core-runner.mjs';

function listsNoomoo() {
  try {
    const pkg = JSON.parse(readFileSync(join(project, 'package.json'), 'utf8'));
    return Boolean(pkg?.dependencies?.noomoo || pkg?.devDependencies?.noomoo);
  } catch {
    return false;
  }
}

if (listsNoomoo() && !existsSync(join(project, '.noomoo', 'setup-manifest.json'))) {
  process.stdout.write('noomoo is installed in this project but not set up yet. Run /noomoo:setup, then /noomoo:start to see the next step.\n');
} else if (coreReady()) {
  const text = runCore(['context-status', '--check']);
  if (text) process.stdout.write(`${text}\n`);
}
process.exit(0);
