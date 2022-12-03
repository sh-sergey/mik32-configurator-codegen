import {
  DefaultTransformPriority,
  Transformer,
  TransformerStorage,
} from "../types";

const storage: TransformerStorage = {
  transformers: [],
};

export function addTransformer(
  transformer: Transformer,
  priority: DefaultTransformPriority | number = DefaultTransformPriority.Normal
) {
  // avoid duplicates
  if (storage.transformers.find((e) => e.transformer === transformer)) return;

  storage.transformers.push({
    priority,
    transformer,
  });
}

export function getSortedTransformers() {
  storage.transformers.sort((a, b) => a.priority - b.priority);

  return storage.transformers.map((e) => e.transformer);
}
