// This hook is used to get the history object from given state.

import { useEffect, useState } from "react";

interface UseHistoryProps<T> {
  state: T;
  maxHistory: number;
  listenUndo?: boolean;
  listenRedo?: boolean;
  onRedo?: (state: T, history: T[], pointer: number) => void;
  onUndo?: (state: T, history: T[], pointer: number) => void;
}

interface UseHistoryReturn<T> {
  state: T;
  history: T[];
  pointer: number;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  set: (newState: T) => void;
}

export const useHistory = <T>({
  state,
  maxHistory,
  onRedo,
  onUndo,
  listenRedo = false,
  listenUndo = false,
}: UseHistoryProps<T>): UseHistoryReturn<T> => {
  const [history, setHistory] = useState<T[]>([state]);
  const [pointer, setPointer] = useState(0);

  const canUndo = pointer > 0;
  const canRedo = pointer < history.length - 1;

  const set = (newState: T) => {
    let newHistoryLength = 0;

    setHistory((prev) => {
      const newHistory = [...prev, newState].slice(-maxHistory);
      newHistoryLength = newHistory.length;
      return newHistory;
    });

    setPointer((prev) => newHistoryLength - 1);
  };

  useEffect(() => {
    set(state);
  }, [state]);

  const undo = () => {
    if (!canUndo) return;

    const state = history[pointer - 1];
    if (onUndo) {
      onUndo(state, history, pointer - 1);
    }
    setPointer((prev) => prev - 1);
  };

  const redo = () => {
    if (!canRedo) return;

    const state = history[pointer + 1];
    if (onRedo) {
      onRedo(state, history, pointer + 1);
    }
    setPointer((prev) => prev + 1);
  };

  useEffect(() => {
    if (!listenUndo) return;

    const handleUndo = (e: KeyboardEvent) => {
      // Windows
      if (e.ctrlKey && e.key === "z") {
        undo();
      }

      // Mac
      if (e.metaKey && e.key === "z") {
        undo();
      }
    };

    window.addEventListener("keydown", handleUndo);
    return () => window.removeEventListener("keydown", handleUndo);
  }, [listenUndo, onUndo]);

  useEffect(() => {
    if (!listenRedo) return;

    const handleRedo = (e: KeyboardEvent) => {
      // Windows
      if (e.ctrlKey && e.shiftKey && e.key === "y") {
        redo();
      }

      // Mac
      if (e.metaKey && e.shiftKey && e.key === "z") {
        redo();
      }
    };

    window.addEventListener("keydown", handleRedo);
    return () => window.removeEventListener("keydown", handleRedo);
  }, [listenRedo, onRedo]);

  return {
    state: history[pointer],
    history,
    pointer,
    canUndo,
    canRedo,
    undo,
    redo,
    set,
  };
};
