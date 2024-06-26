export interface ProjectJson {
  readonly publish: ProjectJsonPublish;
}

export interface ProjectJsonPublish {
  readonly publishDir: string;
  readonly include: readonly string[];
}
