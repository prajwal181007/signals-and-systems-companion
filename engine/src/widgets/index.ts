// Widget bundle entry — registers every widget type with the engine via the
// SC global (separate IIFE bundle; communicates only through window.SC).
// Widget types are added per milestone; the registry pattern means a missing
// widget degrades to a quiet fallback, never an error.

const SC = (window as any).SC;
if (!SC) {
  console.error('widgets.js loaded without the SC bootstrap');
} else {
  // Widget registrations land here as they are built (M2+).
}
export {};
