import nodePath from 'node:path';
import { lastValueFrom, tap } from 'rxjs';
import { ExecOptions, fromExec } from '@gmjs/exec-observable';
import { readProjectJson } from '../../util';
import { FinalOptions, PublishConfig } from './types';

export async function getPublishConfig(
  options: FinalOptions,
): Promise<PublishConfig> {
  const { projectDirectory, configPath, dryRun } = options;

  const fullConfigPath = nodePath.join(projectDirectory, configPath);

  const projectJson = await readProjectJson(fullConfigPath);

  const { publishDir } = projectJson.publish;

  const fullPublishDir = nodePath.join(projectDirectory, publishDir);

  return {
    publishDir: fullPublishDir,
    dryRun,
  };
}

export async function executePublishCommand(
  config: PublishConfig,
): Promise<void> {
  const { publishDir, dryRun } = config;

  const commandArgs: readonly string[] = [
    'publish',
    '--access',
    'public',
    ...(dryRun ? ['--dry-run'] : []),
  ];

  await exec(isWindows() ? 'pnpm.cmd' : 'pnpm', commandArgs, {
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
