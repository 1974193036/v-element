import { URL, fileURLToPath } from 'node:url'
import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    dts({
      tsconfigPath:'./tsconfig.build.json',
      outDir: 'dist/types'
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist/es',
    // lib 库模式
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      // name 暴露的全局变量 'umd' | 'iife' 时是必须的
      name: 'VElement',
      // fileName 输出的文件名，默认fileName是package.json的name选项
      fileName: 'v-element',
      // formats 默认是 ['es', 'umd']
      formats: ['es'],
    },
    rollupOptions: {
      // external 不想把vue打包进去
      // esmodule模式下不用打包以下这些库，因为使用npm install的时候，会自动下载这些生产依赖进行esmodule的导入使用
      external: ['vue', '@fortawesome/fontawesome-svg-core', '@fortawesome/free-solid-svg-icons', '@fortawesome/vue-fontawesome', '@popperjs/core', 'async-validator', 'axios'],
      output: {
        assetFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'style.css')
            return 'index.css'

          return chunkInfo.name as string
        },
      },
    },
  },
})
