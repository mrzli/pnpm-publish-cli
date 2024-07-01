import { Command } from 'commander';
import { action } from './action';

export function addCommandPackage(program: Command): Command {
  program
    .command('pack')
    .alias('a')
    .description('Package project.')
    .argument('[project-directory]', 'Project directory', '.')
    .requiredOption('-c, --config <config>', 'Config file')
    .action(action);

  return program;
}
