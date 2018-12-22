import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import {schema} from './data/schema';

const APP_PORT = 3001;

// Serve the Relay app
const compiler = webpack({
  mode: 'development',
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /\/node_modules\//,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ],
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'inline-source-map',
});
const app = new WebpackDevServer(compiler, {
  contentBase: '/dist/',
  stats: {colors: true},
});

// Serve static resources
app.use('/', express.static(path.resolve(__dirname, 'dist')));

// Setup GraphQL endpoint
app.use(
  '/graphql',
  graphQLHTTP({
    schema: schema,
    pretty: true,
    graphiql: true,
  }),
);

app.listen(APP_PORT, () => {
  console.log(`App is now running on http://localhost:${APP_PORT}`);
});
