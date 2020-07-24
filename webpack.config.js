const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',

  entry: {
    jscradle: './src/index.ts',
    sw: './src/worker.ts',
    dw: './src/data-worker.ts',
    cw: './src/cache-worker.ts'
  },
  devServer: {
    contentBase: './run',
    //hot: true,
    compress: true,
    port: 9000
  },
  output: {
    path: path.resolve(__dirname, 'run'),
    filename: '[name].bundle.js'
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  module: {
    rules: [
      { test: /\.tsx?$/, use: ['ts-loader'], exclude: /node_modules/ },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.(png|svg|jpg|gif)$/, use: ['file-loader'] }
    ]
  },

  node: {
    fs: "empty",
    module: "empty"
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Dear Webpack',
      template: 'src/template.hbs',
      filename: 'index-sd.html',
      inject: true,
      chunks: ['jscradle']
    }),
    new HtmlWebpackPlugin({
      title: 'Webpack+ServiceWorker',
      template: 'src/template.hbs',
      filename: 'index-sw.html',
      inject: true,
      chunks: ['jscradle', 'sw']
    }),
    new HtmlWebpackPlugin({
      title: 'Webpack+ServiceWorker',
      template: 'src/template.hbs',
      filename: 'index-dw.html',
      inject: true,
      chunks: ['jscradle', 'dw']
    }),
    new webpack.NamedModulesPlugin(),
    /*new webpack.HotModuleReplacementPlugin({
      // Options...
    })*/
  ],

}
