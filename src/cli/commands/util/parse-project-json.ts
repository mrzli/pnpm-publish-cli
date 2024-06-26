import Ajv, { JSONSchemaType } from 'ajv';
import { ProjectJson } from '../types';

export function parseProjectJson(content: string): ProjectJson {
  const projectJson = JSON.parse(content);
  const isValid = validateProjectJson(projectJson);
  if (!isValid) {
    console.error(validateProjectJson.errors);
    throw new Error('Invalid instruments data.');
  }

  return projectJson;
}

const AJV = new Ajv();

const SCHEMA_PROJECT_JSON: JSONSchemaType<ProjectJson> = {
  type: 'object',
  properties: {
    publish: {
      type: 'object',
      properties: {
        publishDir: { type: 'string', minLength: 1 },
        include: {
          type: 'array',
          items: { type: 'string', minLength: 1 },
        },
      },
      required: ['publishDir', 'include'],
      additionalProperties: false,
    },
  },
  required: ['publish'],
  additionalProperties: false,
};

const validateProjectJson = AJV.compile<ProjectJson>(SCHEMA_PROJECT_JSON);
