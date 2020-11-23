const webpack = require('webpack')
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    'vue3-chartjs': './src/index.js'
  },
  devtool: 'source-map',
  output: {
    filename: './[name].js',
    library: 'Vue3ChartJs',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: {
    'chart.js': {
      root: 'Chart',
      commonjs: 'chart.js',
      commonjs2: 'chart.js',
      amd: 'chart.js'
    }
  },
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        include: [resolve('src')]
      }
    ]
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
}

// delete module.exports.devtool
module.exports.plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"production"'
    }
  })
]
