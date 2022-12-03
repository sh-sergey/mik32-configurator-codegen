import { FileAST } from "../types";
import { mainCTemplate } from "./MainC";

export const TEMPLATES: Record<string, FileAST> = {
  [mainCTemplate.path]: mainCTemplate,
};
