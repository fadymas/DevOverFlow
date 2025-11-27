import { defineConfig, globalIgnores } from 'eslint/config'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier/flat'
import promisePlugin from 'eslint-plugin-promise'
import importPlugin from 'eslint-plugin-import'

export default defineConfig([
  // --- Next.js rules ---
  ...nextCoreWebVitals,
  ...nextTypescript,

  // --- Plugins (flat style) ---
  {
    plugins: {
      promise: promisePlugin,
      import: importPlugin
    },
    rules: {
      ...importPlugin.configs.recommended.rules,
      ...promisePlugin.configs.recommended.rules
    }
  },

  // --- Prettier (must be last to disable conflicting rules) ---
  prettier,

  // --- Ignores ---
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts'])
])
