/**
 * What both plugin hooks need to run the core of a project: user consent for the repository, the
 * installed core and the project's package manager. The hooks live outside the package and cannot
 * import the core before it is found, so this file stays standalone. Only the disk is read until
 * consent is given.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';

export const project = process.env.CLAUDE_PROJECT_DIR || process.cwd();

/**
 * The manifest is in the repository and could have been placed there by the repository itself, so
 * its presence alone is insufficient. Also require user consent for this repository, written only
 * by `setup`/`init` in the user's settings directory (the same file and key used by
 * `src/core/trust.mjs`).
 */
export function consented() {
  if (process.env.NOOMOO_TRUST_PROJECT === '1') return true;
  try {
    const dir = process.env.NOOMOO_CONFIG_DIR || join(homedir(), '.config', 'noomoo');
    const repos = JSON.parse(readFileSync(join(dir, 'trusted-repos.json'), 'utf8')).repos;
    return Array.isArray(repos) && repos.includes(realpathSync(project));
  } catch {
    return false;
  }
}

/**
 * How the project's package manager runs a binary of its own dependencies, without fetching
 * anything from the registry. The hook lives outside the package and cannot import the core
 * module before the package is found, so the table repeats `runnerCommand` of the core; the
 * manager comes from the `packageManager` field, then from the lock file, then npm.
 */
export const RUNNERS = {
  pnpm: ['pnpm', ['exec', 'noomoo']],
  yarn: ['yarn', ['exec', '--', 'noomoo']],
  bun: ['bun', ['x', '--no-install', 'noomoo']],
  npm: ['npx', ['--no-install', 'noomoo']],
};
const LOCKS = [['pnpm', 'pnpm-lock.yaml'], ['yarn', 'yarn.lock'], ['bun', 'bun.lockb'], ['bun', 'bun.lock'], ['npm', 'package-lock.json']];

export function managerOf() {
  try {
    const declared = String(JSON.parse(readFileSync(join(project, 'package.json'), 'utf8')).packageManager ?? '').split('@')[0].trim();
    if (Object.hasOwn(RUNNERS, declared)) return declared;
  } catch {
    // no manifest or unparsable: fall through to the lock file
  }
  return LOCKS.find(([, lock]) => existsSync(join(project, lock)))?.[0] ?? 'npm';
}

/**
 * Whether the command needs YARN_SILENT. The first line of yarn prints a banner to stdout, and the
 * hook's stdout is read as the answer, so it runs with YARN_SILENT. Berry reads every YARN_* variable as a
 * setting and fails on this one, so only the first line gets it: by the major of a declared yarn
 * version, else by a yarn.lock without the berry `__metadata:` block.
 */
export function quiet() {
  if (managerOf() !== 'yarn') return false;
  let classic = true;
  try {
    const declared = String(JSON.parse(readFileSync(join(project, 'package.json'), 'utf8')).packageManager ?? '');
    if (declared.startsWith('yarn@')) classic = declared.slice(5).split('.')[0] === '1';
    else classic = !/^__metadata:/m.test(readFileSync(join(project, 'yarn.lock'), 'utf8'));
  } catch {
    // no manifest or lock file: the first line, as in the core
  }
  return classic;
}

/**
 * Whether the core is installed for the project, read from the disk only: the same sign the git
 * hooks check. Without it `npx` would go to the registry for an unrelated `noomoo`. Like `npx`, look
 * up the tree: a worktree under `.worktrees/` uses the package of the main checkout.
 */
export function coreInstalled() {
  for (let dir = project; ; dir = dirname(dir)) {
    if (['noomoo', 'noomoo.exe', 'noomoo.bunx'].some((b) => existsSync(join(dir, 'node_modules', '.bin', b)))) return true;
    // The hook does not know which name the core was published under, scoped or not.
    for (const file of ['.pnp.cjs', '.pnp.data.json']) {
      try {
        if (/"(@[^"/]+\/)?noomoo"/.test(readFileSync(join(dir, file), 'utf8'))) return true;
      } catch {
        // no such file at this level
      }
    }
    if (dirname(dir) === dir) return false;
  }
}

/** Set up, consented and with the core installed: the only state in which a hook runs project code. */
export function coreReady() {
  return existsSync(join(project, '.noomoo', 'setup-manifest.json')) && consented() && coreInstalled();
}

/**
 * Run a core subcommand the manager's way; nothing is downloaded from the registry. Returns the
 * trimmed stdout of a zero exit, otherwise an empty string.
 * @param {string[]} args
 * @param {string} [input]
 * @returns {string}
 */
export function runCore(args, input = '') {
  const [bin, prefix] = RUNNERS[managerOf()];
  // The child inherits the environment of the hook; only the one variable is added to it.
  if (quiet()) process.env.YARN_SILENT = '1';
  const res = spawnSync(bin, [...prefix, ...args], {
    cwd: project, input, encoding: 'utf8', timeout: 20_000, shell: process.platform === 'win32',
  });
  return res.status === 0 ? (res.stdout ?? '').trim() : '';
}
