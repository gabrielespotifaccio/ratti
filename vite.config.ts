import { defineConfig } from 'vite';
// Relative assets work both at the domain root and /any-repository-name/.
export default defineConfig({base:'./', build:{target:'es2022'}});
