import { useEffect, type DependencyList } from "react";

export const useOnKeyPress = (
  keys: string[],
  callback: (event: KeyboardEvent) => void,
  deps: DependencyList,
) => {
  useEffect(() => {
    const handleCallback = (event: KeyboardEvent) => {
      // If no keys are provided, call the callback
      if (keys.length === 0) {
        callback(event);
        return;
      }

      // If all keys are pressed, call the callback
      if (keys.every((key) => event.key === key)) {
        callback(event);
        return;
      }
    };

    document.addEventListener("keydown", handleCallback);

    return () => {
      document.removeEventListener("keydown", handleCallback);
    };
  }, [...deps, keys]);
};
