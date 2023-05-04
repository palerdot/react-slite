import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

// ref: https://vitejs.dev/guide/build.html#library-mode
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    // ref: https://github.com/vitejs/vite/issues/1401#issuecomment-755594141
    // ref: https://vitejs.dev/config/shared-options.html#resolve-dedupe
    dedupe: ['react', 'react-dom'],
  },
  plugins: [react(), dts(), cssInjectedByJsPlugin()],
  build: {
    lib: {
      formats: ['es', 'cjs'],
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.tsx'),
      name: 'Slite',
      // the proper extensions will be added
      fileName: format => `react-slite.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['react', 'react-dom'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: 'React',
        },
      },
    },
  },
})
