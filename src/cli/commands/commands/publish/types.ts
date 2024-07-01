export interface Options {
  readonly config: string;
  readonly dryRun: boolean | undefined;
}

export interface FinalOptions {
  readonly projectDirectory: string;
  readonly configPath: string;
  readonly dryRun: boolean;
}

export interface PublishConfig {
  readonly publishDir: string;
  readonly dryRun: boolean;
}
