import { useCallback, useEffect, useState } from "react";

export function useViewerControls(reduced: boolean) {
  const [reset, setReset] = useState(0);
  const [tour, setTour] = useState(false);
  const stopTour = useCallback(() => setTour(false), []);
  const resetView = useCallback(() => {
    setTour(false);
    setReset((value) => value + 1);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") stopTour();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [stopTour]);

  useEffect(() => {
    if (reduced) stopTour();
  }, [reduced, stopTour]);

  return {
    reset,
    tour,
    stopTour,
    resetView,
    startTour: () => setTour(!reduced),
  };
}
