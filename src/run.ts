import { addCommandPackage, addCommandPublish, createProgram } from './cli';
import { addCommandUpdateVersion } from './cli/commands/commands/update-version';

export async function run(): Promise<void> {
  const program = createProgram();
  addCommandPackage(program);
  addCommandPublish(program);
  addCommandUpdateVersion(program);

  await program.parseAsync(process.argv);
}

run();
