import { writeFile } from "fs/promises";
import { generateFileFromAST } from "./generator";
import { TEMPLATES } from "./templates";
import { bindAll, RootState } from "./transformers";
import { getSortedTransformers } from "./transformers/storage";
import { RtcSourceType } from "./transformers/timers/rtc";
import { FileType, TransformerContext } from "./types";

export function transform(rootState: RootState) {
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
    context = transformer({ ...context }, rootState);
    context.appliedTransformers.push(transformer);
  });

  return context;
}

// Register all transformers
bindAll();

async function run(rootState: RootState) {
  const context = transform(rootState);

  const files = [...context.filesMap.values()];

  const result = files.map(async (e) => {
    const content = generateFileFromAST(e)!;
    console.log("content=", content);

    await writeFile("out/" + e.path, content, { flag: "w+" });
  });

  await Promise.all(result);

  // TODO: save to file, to db, etc.
}

const mockRootState: RootState = {
  timers: {
    rtc: {
      alarmEnabled: false,
      rtcEnabled: true,
      rtcSource: RtcSourceType.External,
      rtcDateTime: {
        year: 2022,
        month: 11,
        weekDay: 6,
        day: 3,
        hours: 21,
        minutes: 20,
        seconds: 15,
      },
      rtcRegisters: [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    },
  },
};

run(mockRootState).catch(console.error);
