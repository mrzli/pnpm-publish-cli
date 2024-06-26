const { join } = require('node:path');
const { lastValueFrom, tap } = require('rxjs');
const { glob } = require('glob');
const fs = require('fs-extra');
const { fromExec } = require('@gmjs/exec-observable');

async function run() {
  console.log('Publishing...');

  const projectJsonContent = await fs.readFile('project.json', 'utf8');
  const projectJson = JSON.parse(projectJsonContent);

  const { publishDir, include } = projectJson.publish;
  await fs.ensureDir(publishDir);

  const files = await glob([...include]);
  await Promise.all(files.map((file) => fs.copy(file, join(publishDir, file))));

  const npmArgs = ['publish', '--access', 'public'];

  await exec(isWindows() ? 'pnpm.cmd' : 'pnpm', npmArgs, { cwd: publishDir });
}

function isWindows() {
  return process.platform === 'win32';
}

async function exec(cmd, args, options) {
  await lastValueFrom(
    fromExec(cmd, args, options).pipe(
      tap((event) => {
        if (event.kind === 'data-stdout') {
          console.log(event.data);
        } else if (event.kind === 'data-stderr') {
          console.error(event.data);
        }
      }),
    ),
  );
}

run();
