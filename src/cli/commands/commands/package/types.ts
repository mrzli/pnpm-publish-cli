export interface Options {
  readonly config: string;
}

export interface FinalOptions {
  readonly projectDirectory: string;
  readonly configPath: string;
}

export interface PackageConfig {
  readonly publishDir: string;
  readonly include: readonly string[];
}
