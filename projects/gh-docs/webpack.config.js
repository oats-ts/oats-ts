const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { ProvidePlugin } = require('webpack')

module.exports = {
  entry: './src/index.ts',
  devtool: 'cheap-source-map',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../../docs'),
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
      template: path.resolve('src/index.html'),
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
