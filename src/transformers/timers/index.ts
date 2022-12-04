import { DefaultTransformPriority } from "../../types";
import { addTransformer } from "../storage";
import { transformRtc } from "./rtc";

export function bindPeriphery() {
  addTransformer(transformRtc, DefaultTransformPriority.Normal);

  // TODO: add other periphery transformers
}
