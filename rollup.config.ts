import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';

export default defineConfig([
    {
        input: 'src/index.ts',
        output: [
            {
                file: 'dist/index.js',
                format: 'es',
                generatedCode: 'es2015'
            },
            {
                file: 'dist/index.umd.js',
                format: 'umd',
                name: 'VNDBQuery',
                generatedCode: 'es2015'
            }
        ],
        plugins: [typescript()]
    }
]);