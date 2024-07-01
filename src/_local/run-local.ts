import { execute } from '../cli';

const args: readonly string[] = [
  ...process.argv,
  'p',
  'C:\\Users\\Mrzli\\Development\\Projects\\private\\projects\\js\\libs\\_tools\\js-project-generator',
  '-c',
  'project.json',
  '--dry-run',
];

execute(args);
