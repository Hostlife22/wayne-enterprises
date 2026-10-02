import type { ConfigState, ConfigAction } from "./types";

export const INITIAL_STATE: ConfigState = {
  preset: "standard",
  finish: "black",
  exploded: false,
};
export function configReducer(
  state: ConfigState,
  action: ConfigAction,
): ConfigState {
  switch (action.type) {
    case "preset":
      return { ...state, preset: action.id, exploded: false };
    case "finish":
      return { ...state, finish: action.id };
    case "explode":
      return { ...state, exploded: true };
    default: {
      const unhandled: never = action;
      return unhandled;
    }
  }
}
