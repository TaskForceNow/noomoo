/**
 * Plugin `PostToolUse` hook for `Edit|Write`. Until the project has `.noomoo/setup-manifest.json`
 * and user consent for this repository, exit without reading the event, touching the project, or
 * starting processes. Installing the plugin does not authorize repository execution. Once
 * authorized, forward the event to the core subcommand and return its output to the agent's
 * context: ordinary `PostToolUse` stdout is not delivered to the agent, but `additionalContext` is.
 * Always exit with code 0.
 */
import { coreReady, runCore } from './core-runner.mjs';

if (coreReady()) {
  let input = '';
  process.stdin.setEncoding('utf8');
  for await (const chunk of process.stdin) input += chunk;
  const text = runCore(['claude-hook-docs'], input);
  if (text) {
    process.stdout.write(`${JSON.stringify({ hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: text } })}\n`);
  }
}
process.exit(0);
