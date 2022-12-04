import { bindPeriphery } from "./timers";
import { RtcState } from "./timers/rtc";

export interface RootState {
  timers: {
    rtc: RtcState;

    // TODO: add others
  };

  // TODO: add others
}

export function bindAll() {
  bindPeriphery();
  // TODO: bind other
}
