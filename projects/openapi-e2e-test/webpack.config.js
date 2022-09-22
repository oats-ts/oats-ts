const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/browser/index.ts',
  mode: 'development',
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
    // fallback: {
    //   dgram: false,
    //   fs: false,
    //   net: false,
    //   tls: false,
    //   util: false,
    //   https: false,
    //   crypto: false,
    //   assert: false,
    //   stream: false,
    //   http: false,
    //   zlib: false,
    //   path: false,
    //   process: require.resolve('process'),
    // },
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('src/browser/page.html'),
    }),
  ],
  devServer: {
    client: {
      overlay: false,
    },
  },
}
