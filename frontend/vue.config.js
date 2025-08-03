const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  runtimeCompiler: true,
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      extensions: ['.ts', '.js', '.vue', '.json'],
    },
    entry: {
      app: './src/main.ts',
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: [/\.vue$/], // Handle <script lang="ts"> in Vue SFCs
            },
          },
        },
      ],
    },
  },
  // NOTE: Uncomment the following lines to enable proxying API requests during development
  // devServer: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:3000',
  //       changeOrigin: true,
  //     },
  //   },
  // },
})
