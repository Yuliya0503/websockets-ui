const path = require('path');

module.exports = {
  mode: 'production',
  entry: './index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'build.js',
  },
  resilve: {
    extensions: ['.js', '.ts'],
  },
  target: 'node18.16',
  module: {
    rules: [
      {
        use: 'ts-loader',
        test: /\.ts?$/,
        exclude: /node_modules/,
      }
    ]
  }
};