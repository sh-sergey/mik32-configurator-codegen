import { LINE_TABULATION } from "../constants";
import { FileAST, FileType } from "../types";

function generateSource(fileAst: FileAST) {
  let result = "";

  result += fileAst.includes.join("\n");
  result += "\n";

  result += fileAst.defines.join("\n");
  result += "\n";

  if (fileAst.privateVariables.length > 0) {
    result +=
      "/* Private variables ---------------------------------------------------------*/\n";
    result += fileAst.privateVariables.join("\n");
    result += "\n\n";
  }

  if (fileAst.privateFunctionPrototypes.length > 0) {
    result +=
      "/* Private function prototypes -----------------------------------------------*/\n";
    result += fileAst.privateFunctionPrototypes.join("\n");
    result += "\n\n";
  }

  result += "int main() {\n";
  result += fileAst.main.map((e) => LINE_TABULATION + e).join("\n");
  result += "\n";
  result += `${LINE_TABULATION}return 0;\n`;
  result += "}";

  return result;
}

function generateHeader(fileAst: FileAST) {
  // TODO:

  return "";
}

export function generateFileFromAST(fileAst: FileAST) {
  if (fileAst.type === FileType.OTHER)
    throw new Error("Unsupported file: " + JSON.stringify(fileAst));

  if (fileAst.type === FileType.SOURCE) return generateSource(fileAst);
  if (fileAst.type === FileType.HEADER) return generateHeader(fileAst);
}
