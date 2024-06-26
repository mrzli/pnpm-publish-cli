import nodePath from 'node:path';
import { Command } from 'commander';
import { readPackageJsonSync } from '@gmjs/package-json';

export function createProgram(): Command {
  const program = new Command();
  program
    .name('pnpmpub')
    .description('Package publisher.')
    .version(
      readPackageJsonSync(nodePath.join(__dirname, '../..')).version ?? '',
    );

  return program;
}
