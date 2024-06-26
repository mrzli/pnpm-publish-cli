import { describe, expect, it } from '@jest/globals';
import { parseProjectJson } from './parse-project-json';
import { ProjectJson } from '../types';

describe('parse-project-json', () => {
  describe('parseProjectJson()', () => {
    describe('valid', () => {
      interface Example {
        readonly description: string;
        readonly input: string;
        readonly expected: ProjectJson;
      }

      const EXAMPLES: readonly Example[] = [
        {
          description: 'simple',
          input: `
            {
              "publish": {
                "publishDir": "dist",
                "include": [
                  "some-file"
                ]
              }
            }
          `,
          expected: {
            publish: {
              publishDir: 'dist',
              include: ['some-file'],
            },
          },
        },
      ];

      for (const example of EXAMPLES) {
        it(example.description, () => {
          const actual = parseProjectJson(example.input);
          expect(actual).toEqual(example.expected);
        });
      }
    });

    describe('throws', () => {
      interface Example {
        readonly description: string;
        readonly input: string;
      }

      const EXAMPLES: readonly Example[] = [
        {
          description: 'empty json',
          input: '',
        },
        {
          description: 'empty publish dir',
          input: `
            {
              "publish": {
                "publishDir": "",
                "include": [
                  "some-file"
                ]
              }
            }
          `,
        },
        {
          description: 'empty string in include',
          input: `
            {
              "publish": {
                "publishDir": "",
                "include": [
                  ""
                ]
              }
            }
          `,
        },
      ];

      for (const example of EXAMPLES) {
        it(example.description, () => {
          const call = (): ProjectJson => parseProjectJson(example.input);
          expect(call).toThrowError();
        });
      }
    });
  });
});
