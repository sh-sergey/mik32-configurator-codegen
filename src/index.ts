import { writeFile } from "fs/promises";
import { generateFileFromAST } from "./generator";
import { TEMPLATES } from "./templates";
import { bindAll } from "./transformers";
import { getSortedTransformers } from "./transformers/storage";
import { FileType, TransformerContext } from "./types";

export function transform() {
  const transformers = getSortedTransformers();

  let context: TransformerContext = {
    appliedTransformers: [],
    filesMap: new Map(),
    getOrCreateFile(path: string, type: FileType = FileType.SOURCE) {
      if (!this.filesMap.has(path)) {
        const template = TEMPLATES[path];

        this.filesMap.set(
          path,
          template || {
            defines: [],
            functions: [],
            includes: [],
            main: [],
            path,
            type,
          }
        );
      }

      return this.filesMap.get(path)!;
    },
  };

  transformers.forEach((transformer) => {
    context = transformer({ ...context });
    context.appliedTransformers.push(transformer);
  });

  return context;
}

// Register all transformers
bindAll();

async function run() {
  const context = transform();

  const files = [...context.filesMap.values()];

  const result = files.map(async (e) => {
    const content = generateFileFromAST(e)!;
    console.log("content=", content);

    await writeFile("out/" + e.path, content, { flag: "w+" });
  });

  await Promise.all(result);

  // TODO: save to file, to db, etc.
}

run().catch(console.error);
