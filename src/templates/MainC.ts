import { FileAST, FileType } from "../types";

// TODO: main.c template
export const mainCTemplate: FileAST = {
  defines: [],
  privateVariables: [],
  privateFunctionPrototypes: [],
  includes: [],
  main: [],
  path: "main.c",
  type: FileType.SOURCE,
};
