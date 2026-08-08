// Widget bundle entry — registers every widget type with the engine via the
// SC global (separate IIFE bundle; communicates only through window.SC).
// Widget types are added per milestone; the registry pattern means a missing
// widget degrades to a quiet fallback, never an error.

import './convolution';
import './fourier-series';
import './polezero';
import './m1-widgets';
import './system-tester';
import './m2-widgets';
import './m3-widgets';
import './m4-widgets';
import './m5-widgets';
export {};
