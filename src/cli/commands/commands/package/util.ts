import nodePath from 'node:path';
import { readProjectJson } from '../../util';
import { FinalOptions, PackageConfig } from './types';

export async function getPackageConfig(
  options: FinalOptions,
): Promise<PackageConfig> {
  const { projectDirectory, configPath } = options;

  const fullConfigPath = nodePath.join(projectDirectory, configPath);

  const projectJson = await readProjectJson(fullConfigPath);

  const { publishDir, include } = projectJson.publish;

  const fullPublishDir = nodePath.join(projectDirectory, publishDir);

  return {
    publishDir: fullPublishDir,
    include,
  };
}
