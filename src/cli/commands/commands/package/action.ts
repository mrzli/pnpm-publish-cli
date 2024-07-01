import nodePath from 'node:path';
import { Command } from 'commander';
import { glob } from 'glob';
import fs from 'fs-extra';
import { FinalOptions, Options } from './types';
import { getPackageConfig } from './util';

export async function action(
  projectDirectory: string,
  options: Options,
  _command: Command,
): Promise<void> {
  const { config } = options;

  const finalOptions: FinalOptions = {
    projectDirectory,
    configPath: config,
  };

  await packageProject(finalOptions);
}

export async function packageProject(options: FinalOptions): Promise<void> {
  console.log('Packaging...');

  const packageConfig = await getPackageConfig(options);
  const { publishDir, include } = packageConfig;

  await fs.ensureDir(publishDir);

  const files: readonly string[] = await glob([...include]);
  await Promise.all(
    files.map((file) => fs.copy(file, nodePath.join(publishDir, file))),
  );
}
