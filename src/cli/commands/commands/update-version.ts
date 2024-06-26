import nodePath from 'node:path';
import { readPackageJsonAsync } from '@gmjs/package-json';
import { writeTextAsync } from '@gmjs/fs-async';
import { Command } from 'commander';

type OptionValue = boolean;
type Options = Readonly<Record<string, OptionValue | undefined>>;

export function addCommandUpdateVersion(program: Command): Command {
  program
    .command('update-version')
    .alias('u')
    .description('Update version.')
    .option('-m, --major', 'Update major version.')
    .option('-n, --minor', 'Update minor version.')
    .option('-p, --patch', 'Update patch version.')
    .action(action);

  return program;
}

type VersionChange = 'major' | 'minor' | 'patch';

interface Config {
  readonly versionChange: VersionChange;
}

function optionsToVersionChange(options: Options): VersionChange {
  if (options['major']) {
    return 'major';
  }

  if (options['minor']) {
    return 'minor';
  }

  if (options['patch']) {
    return 'patch';
  }

  throw new Error('No version option provided.');
}

async function action(options: Options, _command: Command): Promise<void> {
  const config: Config = {
    versionChange: optionsToVersionChange(options),
  };

  await updateVersion(config);
}

async function updateVersion(config: Config): Promise<void> {
  const { versionChange } = config;

  console.log(`Updating ${versionChange} version.`);

  const cwd = process.cwd();

  const packageJson = await readPackageJsonAsync(cwd);

  const version = parseToVersionObjectOrThrow(packageJson.version);
  const newVersion = changeVersionObject(version, versionChange);
  const newVersionStr = `${newVersion.major}.${newVersion.minor}.${newVersion.patch}`;

  console.log(`New version: ${newVersionStr}`);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (packageJson as any).version = newVersionStr;

  const newPackageJsonStr = JSON.stringify(packageJson, undefined, 2) + '\n';
  await writeTextAsync(nodePath.join(cwd, 'package.json'), newPackageJsonStr);
}

interface Version {
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
}

function parseToVersionObjectOrThrow(version: string | undefined): Version {
  if (!version) {
    throw new Error('No version string provided.');
  }

  const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) {
    throw new Error(`Invalid current version string: '${version};.`);
  }

  const majorStr = match[1] ?? '0';
  const minorStr = match[2] ?? '0';
  const patchStr = match[3] ?? '0';

  const major = Number.parseInt(majorStr, 10);
  const minor = Number.parseInt(minorStr, 10);
  const patch = Number.parseInt(patchStr, 10);

  return {
    major,
    minor,
    patch,
  };
}

function changeVersionObject(
  version: Version,
  versionChange: VersionChange,
): Version {
  switch (versionChange) {
    case 'major': {
      return {
        major: version.major + 1,
        minor: 0,
        patch: 0,
      };
    }
    case 'minor': {
      return {
        major: version.major,
        minor: version.minor + 1,
        patch: 0,
      };
    }
    case 'patch': {
      return {
        major: version.major,
        minor: version.minor,
        patch: version.patch + 1,
      };
    }
  }
}
