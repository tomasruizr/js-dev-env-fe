import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackMd5Hash from 'webpack-md5-hash';
import MiniCssExtractPlugin from "mini-css-extract-plugin";

export default {
  mode: 'development',
  devtool: 'source-map',
  entry: [ 
    path.resolve(__dirname, 'src/index')
  ],
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].[chunkhash].js'
  },
    // Use CommonsChunkPlugin to create a separate bundle
    // of Webpack runtime and vendor libraries so that they're cached separately.
    optimization: {
      splitChunks: {
          chunks: 'all',
      },
      runtimeChunk: true,
  },
  plugins: [
    // Generate an external css file with a hash in the filename
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[hash].css'
    }),

    // Hash the files using MD5 so that their names change when the content changes.
    new WebpackMd5Hash(),

    // Create HTML file that includes reference to bundled JS.
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      },
      inject: true,
      // Properties you define here are available in index.html
      // using htmlWebpackPlugin.options.varName
      trackJSToken: '43ad216f57d94259968435894490a5c7'
    }),
  ],
  module: {
    rules: [
      {test: /\.js$/, exclude: /node_modules/, loaders: ['babel-loader']},
      {
        test:  /\.css$/,
        loaders: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          // 'postcss-loader',
          // 'sass-loader',
        ],
      }
    ]
  }
};
