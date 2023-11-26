import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import dts from 'vite-plugin-dts';

export default defineConfig([
  {
    plugins: [typescript(), dts({ rollupTypes: true })],
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.mjs',
        format: 'es',
        generatedCode: 'es2015'
      },
      {
        file: 'dist/index.cjs',
        format: 'cjs',
        generatedCode: 'es2015'
      },
      {
        file: 'dist/index.umd.js',
        format: 'umd',
        name: 'VNDBQuery',
        generatedCode: 'es2015'
      }
    ]
  }
]);
