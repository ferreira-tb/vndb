import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: false,
        environment: 'node',
        watch: true,
        typecheck: {
            tsconfig: './tsconfig.json'
        }
    }
});