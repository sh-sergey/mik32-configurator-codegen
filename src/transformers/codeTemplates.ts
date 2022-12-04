import { LINE_TABULATION } from "../constants";

export function addFunctionPrototype(
  container: string[],
  name: string,
  optional?: {
    specifier?: string;
    returnType?: string;
    arguments?: string[] | undefined;
  }
) {
  container.push(
    `${optional?.specifier?.concat(" ") || ""}${
      optional?.returnType || "void"
    } ${name}(${"".concat(...(optional?.arguments ?? []))});`
  );
}

export function addFunction(
  container: string[],
  name: string,
  body: string[],
  optional?: {
    specifier?: string;
    returnType?: string;
    arguments?: string[] | undefined;
  }
) {
  container.push(
    ...[
      `${optional?.specifier?.concat(" ") || ""}${
        optional?.returnType || "void"
      } ${name}(${"".concat(...(optional?.arguments ?? []))})`,
      "{",
      ...body.map((e) => LINE_TABULATION + e),
      "}",
    ]
  );
}
