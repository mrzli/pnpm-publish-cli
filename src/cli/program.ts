import nodePath from 'node:path';
import { Command } from 'commander';
import { readPackageJsonSync } from '@gmjs/package-json';
import {
  addCommandPackage,
  addCommandPublish,
  addCommandUpdateVersion,
} from './commands';

export async function execute(args: readonly string[]): Promise<void> {
  const program = createProgram();
  setupProgram(program);

  await program.parseAsync(args);
}

function createProgram(): Command {
  const program = new Command();
  program
    .name('pnpmpub')
    .description('Package publisher.')
    .version(
      readPackageJsonSync(nodePath.join(__dirname, '../..')).version ?? '',
    );

  return program;
}

function setupProgram(program: Command): void {
  addCommandPackage(program);
  addCommandPublish(program);
  addCommandUpdateVersion(program);
}
