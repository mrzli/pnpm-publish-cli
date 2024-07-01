import nodePath from 'node:path';
import { Command } from 'commander';
import { glob } from 'glob';
import fs from 'fs-extra';
import { readProjectJson } from '../util';

type OptionValue = never;
type Options = Readonly<Record<string, OptionValue | undefined>>;

export function addCommandPackage(program: Command): Command {
  program
    .command('pack')
    .alias('a')
    .description('Package project.')
    .requiredOption('-c, --config <config>', 'Config file')
    .action(action);

  return program;
}

interface Config {
  readonly config: string;
}

async function action(options: Options, _command: Command): Promise<void> {
  const config: Config = {
    config: (options['config'] as string | undefined)!,
  };

  await packageProject(config);
}

export async function packageProject(config: Config): Promise<void> {
  const { config: configPath } = config;

  console.log('Packaging...');

  const projectJson = await readProjectJson(configPath);

  const { publishDir, include } = projectJson.publish;
  await fs.ensureDir(publishDir);

  const files: readonly string[] = await glob([...include]);
  await Promise.all(
    files.map((file) => fs.copy(file, nodePath.join(publishDir, file))),
  );
}
