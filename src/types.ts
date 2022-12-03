export enum FileType {
  HEADER = "header",
  SOURCE = "source",
  OTHER = "other",
}

export interface FileAST {
  /**
   * @example main.c
   * @example config/rtc.h
   */
  path: string;
  type: FileType;

  /**
   * Упорядоченные объявления зависимостей
   */
  includes: string[];

  /**
   * Упорядоченные объявления констант до функций
   */
  defines: string[];

  /**
   * Упорядоченные объявления функций до int main() {}
   */
  functions: string[];

  /**
   * Упорядоченные строки кода в тее функции int main() {}
   */
  main: string[];
}

export type Transformer = (context: TransformerContext) => TransformerContext;

type FilePath = string;
export interface TransformerContext {
  filesMap: Map<FilePath, FileAST>;
  appliedTransformers: Transformer[];

  getOrCreateFile(filePath: FilePath, fileType?: FileType): FileAST;
}

export enum DefaultTransformPriority {
  High = 0,
  Normal = 50,
  Low = 100,
}

export interface TransformerStorage {
  transformers: {
    priority: number | DefaultTransformPriority;
    transformer: Transformer;
  }[];
}