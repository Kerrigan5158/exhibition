const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: path.join(__dirname, '/src/index.js'), // 入口文件
  output: {
    path: path.join(__dirname, '/dist'), //打包后的文件存放的地方
    chunkFilename: '[name]_[chunkhash].min.js',
    filename: '[name].[chunkhash].js',
  },
  devServer: {
    contentBase: './dist', // 本地服务器所加载文件的目录
    inline: true, // 文件修改后实时刷新
    historyApiFallback: true //不跳转
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({template: './src/index.html'})
  ],
  module: {
    rules: [
      {
        test: /\.css$/, // 正则匹配以.css结尾的文件
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
            'url-loader?limit=99999999&name=[name].[ext]'
        ]
      }
    ]
  }
}
