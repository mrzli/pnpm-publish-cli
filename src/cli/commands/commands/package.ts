import nodePath from 'node:path';
import { Command } from 'commander';
import { glob } from 'glob';
import fs from 'fs-extra';
import { parseProjectJson } from '../util/parse-project-json';

type OptionValue = never;
type Options = Readonly<Record<string, OptionValue | undefined>>;

export function addCommandPackage(program: Command): Command {
  program
    .command('pack')
    .alias('a')
    .description('Package project.')
    .action(action);

  return program;
}

async function action(_options: Options, _command: Command): Promise<void> {
  await packageProject();
}

export async function packageProject(): Promise<void> {
  console.log('Packaging...');

  const projectJsonContent = await fs.readFile('project.json', 'utf8');
  const projectJson = parseProjectJson(projectJsonContent);

  const { publishDir, include } = projectJson.publish;
  await fs.ensureDir(publishDir);

  const files: readonly string[] = await glob([...include]);
  await Promise.all(
    files.map((file) => fs.copy(file, nodePath.join(publishDir, file))),
  );
}
