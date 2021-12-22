import { useEffect } from "react";

export function useKeypress(key: string, action: () => void): void {
  useEffect(() => {
    function onKeyup(event: KeyboardEvent): void {
      event.preventDefault();
      if (event.key === key) {
        action();
      }
    }
    window.addEventListener("keyup", onKeyup);

    return () => window.removeEventListener("keyup", onKeyup);
  }, [action, key]);
}
