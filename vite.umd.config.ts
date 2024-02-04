import { URL, fileURLToPath } from 'node:url'
import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist/umd',
    // lib 库模式
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      // name 暴露的全局变量 'umd' | 'iife' 时是必须的
      name: 'VElement',
      // fileName 输出的文件名，默认fileName是package.json的name选项
      fileName: 'v-element',
      // formats 默认是 ['es', 'umd']
      formats: ['umd']
    },
    rollupOptions: {
      // external 不想把vue打包进去
      external: ['vue'],
      output: {
        // exports 告诉rollup 有具名、匿名导出
        exports: 'named',
        globals: {
          // 给剔出去的vue，提供全局变量名称
          vue: 'Vue',
        },
        assetFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'style.css')
            return 'index.css'

          return chunkInfo.name as string
        },
      },
    },
  },
})
