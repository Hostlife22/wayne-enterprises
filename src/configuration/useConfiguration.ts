import { useReducer } from "react";
import type { FinishId, PresetId } from "./types";
import { FINISH_BY_ID, PRESET_BY_ID } from "./catalog";
import { configReducer, INITIAL_STATE } from "./reducer";

export function useConfiguration() {
  const [state, dispatch] = useReducer(configReducer, INITIAL_STATE);
  return {
    state,
    preset: PRESET_BY_ID[state.preset],
    finish: FINISH_BY_ID[state.finish],
    selectPreset: (id: PresetId) => dispatch({ type: "preset", id }),
    selectFinish: (id: FinishId) => dispatch({ type: "finish", id }),
    explode: () => dispatch({ type: "explode" }),
  };
}
