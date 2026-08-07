// Widget bundle entry — registers every widget type with the engine via the
// SC global (separate IIFE bundle; communicates only through window.SC).
// Widget types are added per milestone; the registry pattern means a missing
// widget degrades to a quiet fallback, never an error.

import './convolution';
import './fourier-series';
import './polezero';
export {};
