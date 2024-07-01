import fs from 'fs-extra';
import { ProjectJson } from '../types';
import { parseProjectJson } from './parse-project-json';

export async function readProjectJson(path: string): Promise<ProjectJson> {
  const fileExists = await fs.pathExists(path);
  if (!fileExists) {
    throw new Error(`Config file not found at path: '${path}'.`);
  }

  const projectJsonContent = await fs.readFile(path, 'utf8');
  const projectJson = parseProjectJson(projectJsonContent);

  return projectJson;
}
