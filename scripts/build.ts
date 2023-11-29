import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { existsSync as exists } from 'node:fs';
import { execa } from 'execa';

try {
  await execa('pnpm', ['rollup'], { stdio: 'inherit' });

  const dirname = path.dirname(fileURLToPath(import.meta.url));
  const src = path.join(dirname, 'dist/src');
  if (exists(src)) await fs.rm(src, { recursive: true });
} catch (err) {
  console.error(err);
  process.exit(1);
}
