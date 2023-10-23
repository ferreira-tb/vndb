import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: false,
        environment: 'node',
        watch: false,
        typecheck: {
            tsconfig: './tsconfig.json'
        }
    }
});