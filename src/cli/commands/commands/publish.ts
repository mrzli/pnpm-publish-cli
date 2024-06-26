import { Command } from 'commander';
import { lastValueFrom, tap } from 'rxjs';
import fs from 'fs-extra';
import { ExecOptions, fromExec } from '@gmjs/exec-observable';
import { parseProjectJson } from '../util/parse-project-json';
import { Config } from '../types';

type OptionValue = boolean;
type Options = Readonly<Record<string, OptionValue | undefined>>;

export function addCommandPublish(program: Command): Command {
  program
    .command('pub')
    .alias('p')
    .description('Publish npm package.')
    .option('--dry-run', 'Dry run (fake publish).')
    .action(action);

  return program;
}

async function action(options: Options, _command: Command): Promise<void> {
  const config: Config = {
    dryRun: options['dryRun'] ?? false,
  };

  await publish(config);
}

export async function publish(config: Config): Promise<void> {
  const { dryRun } = config;

  console.log('Publishing...');

  const projectJsonContent = await fs.readFile('project.json', 'utf8');
  const projectJson = parseProjectJson(projectJsonContent);

  const { publishDir } = projectJson.publish;

  const npmArgs: readonly string[] = [
    'publish',
    '--access',
    'public',
    ...(dryRun ? ['--dry-run'] : []),
  ];

  await exec(isWindows() ? 'pnpm.cmd' : 'pnpm', npmArgs, { cwd: publishDir });
}

function isWindows(): boolean {
  return process.platform === 'win32';
}

async function exec(
  cmd: string,
  args?: readonly string[],
  options?: ExecOptions,
): Promise<void> {
  await lastValueFrom(
    fromExec(cmd, args, options).pipe(
      tap((event) => {
        if (event.kind === 'data-stdout') {
          console.log(event.data);
        } else if (event.kind === 'data-stderr') {
          console.error(event.data);
        }
      }),
    ),
  );
}
