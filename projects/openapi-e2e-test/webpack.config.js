const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { ProvidePlugin } = require('webpack')

module.exports = {
  entry: './src/web/index.ts',
  mode: 'development',
  node: {
    global: true,
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      path: require.resolve('path-browserify'),
      process: require.resolve('process'),
      fs: false,
      url: false,
      perf_hooks: false,
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('src/web/index.html'),
    }),
    new ProvidePlugin({
      process: 'process/browser',
    }),
  ],
  devServer: {
    client: {
      overlay: false,
    },
  },
}
