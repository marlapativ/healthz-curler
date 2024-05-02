import webpack from 'webpack'
import path from 'path'
import nodeExternals from 'webpack-node-externals'

const isDev = process.env.NODE_ENV !== 'production'
const config: webpack.Configuration = {
  name: 'server',
  context: path.resolve(process.cwd()),
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'inline-source-map' : 'source-map',
  target: 'node',
  entry: {
    server: './src/server.ts'
  },
  output: {
    clean: true,
    publicPath: 'dist/',
    path: path.resolve(process.cwd(), 'dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  externals: [
    nodeExternals({
      allowlist: ['healthz-curler-shared-js']
    })
  ]
}

export default config
