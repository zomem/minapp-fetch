
const path = require('path')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: {
    index: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  // optimization: {
  //   minimize: true,
  //   minimizer: [
  //     new UglifyJSPlugin()
  //   ]
  // }
}