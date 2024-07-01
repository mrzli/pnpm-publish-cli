import { Command } from 'commander';
import { lastValueFrom, tap } from 'rxjs';
import { ExecOptions, fromExec } from '@gmjs/exec-observable';
import { readProjectJson } from '../util';

type OptionValue = boolean;
type Options = Readonly<Record<string, OptionValue | undefined>>;

export function addCommandPublish(program: Command): Command {
  program
    .command('pub')
    .alias('p')
    .description('Publish npm package.')
    .requiredOption('-c, --config <config>', 'Config file')
    .option('--dry-run', 'Dry run (fake publish).')
    .action(action);

  return program;
}

interface Config {
  readonly config: string;
  readonly dryRun: boolean;
}

async function action(options: Options, _command: Command): Promise<void> {
  const config: Config = {
    config: (options['config'] as string | undefined)!,
    dryRun: (options['dryRun'] as boolean | undefined) ?? false,
  };

  await publish(config);
}

export async function publish(config: Config): Promise<void> {
  const { config: configPath, dryRun } = config;

  console.log('Publishing...');

  const projectJson = await readProjectJson(configPath);

  const { publishDir } = projectJson.publish;

  const npmArgs: readonly string[] = [
    'publish',
    '--access',
    'public',
    ...(dryRun ? ['--dry-run'] : []),
  ];

  await exec(isWindows() ? 'pnpm.cmd' : 'pnpm', npmArgs, {
    cwd: publishDir,
    shell: true,
  });
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
