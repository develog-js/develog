const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: ['./src/app.js', './src/scss/index.scss'],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'js/app.js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, './app.js')],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [['@babel/plugin-transform-runtime', { corejs: 3, proposals: true }]],
          },
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        loader: 'file-loader',
        options: { outputPath: 'img', publicPath: 'img', name: '[name].[ext]' },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: 'src/index.html' }),
    new MiniCssExtractPlugin({ filename: 'css/style.css' }),
  ],
  devServer: {
    open: true,
    port: 'auto',
    proxy: { '/': 'http://localhost:9000' },
  },
  devtool: 'source-map',
  mode: 'development',
};
