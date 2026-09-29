import { createContext, useContext } from "react";

/**
 * VisualizerContext — Shared context for in-canvas visualizer actions (e.g. Custom Array Modal, playback state).
 */
export const VisualizerContext = createContext({
  openCustomModal: () => {},
  isCustomArrayAvailable: false,
  isRunning: false,
});

export const useVisualizer = () => useContext(VisualizerContext);
