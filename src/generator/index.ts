import { FileAST, FileType } from "../types";

function generateSource(fileAst: FileAST) {
  let result = "";

  result += fileAst.includes.join("\n");
  result += "\n";

  result += fileAst.defines.join("\n");
  result += "\n";

  result += fileAst.functions.join("\n");
  result += "\n";

  result += "int main() {\n";
  result += fileAst.main.map((e) => "  " + e).join("\n");
  result += "  return 0;\n";
  result += "}";

  return result;
}

function generateHeader(fileAst: FileAST) {
  // TODO:

  return '';
}

export function generateFileFromAST(fileAst: FileAST) {
  if (fileAst.type === FileType.OTHER)
    throw new Error("Unsupported file: " + JSON.stringify(fileAst));

  if (fileAst.type === FileType.SOURCE) return generateSource(fileAst);
  if (fileAst.type === FileType.HEADER) return generateHeader(fileAst);
}
