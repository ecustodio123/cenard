import { useSyncExternalStore } from "react";
const subscribe = (callback: () => void) => {
  const media = window.matchMedia("(max-width: 767px)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};
const snapshot = () => window.matchMedia("(max-width: 767px)").matches;
const serverSnapshot = () => false;

// One representation in the DOM; desktop SSR and hydration remain consistent.
export function useDirectoryMobile() {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}
