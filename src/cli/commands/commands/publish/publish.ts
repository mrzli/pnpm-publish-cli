import { Command } from 'commander';
import { action } from './action';

export function addCommandPublish(program: Command): Command {
  program
    .command('pub')
    .alias('p')
    .description('Publish npm package.')
    .argument('[project-directory]', 'Project directory', '.')
    .requiredOption('-c, --config <config>', 'Config file')
    .option('--dry-run', 'Dry run (fake publish).')
    .action(action);

  return program;
}
