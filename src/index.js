import Client from './client';
import utils from './utils';

// Named exports let ESM consumers tree-shake (e.g. `import { utils }` drops Client + wsclient + ws).
export { Client, utils };
// Default export keeps the historical interface for CJS (`require('obyte')`) and the UMD browser build.
export default { Client, utils };
