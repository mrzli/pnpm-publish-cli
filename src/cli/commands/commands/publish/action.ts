import { Command } from 'commander';
import { FinalOptions, Options } from './types';
import { executePublishCommand, getPublishConfig } from './util';

export async function action(
  projectDirectory: string,
  options: Options,
  _command: Command,
): Promise<void> {
  const { config, dryRun } = options;

  const finalOptions: FinalOptions = {
    projectDirectory,
    configPath: config,
    dryRun: dryRun ?? false,
  };

  await publishProject(finalOptions);
}

export async function publishProject(options: FinalOptions): Promise<void> {
  console.log('Publishing...');

  const publishConfig = await getPublishConfig(options);

  await executePublishCommand(publishConfig);
}
