# tsc-webpack-plugin

> A TypeScript plugin that runs tsc command and push output to webpack.

## Install

```bash
yarn add -D tsc-webpack-plugin
```

> Example how to configure it with [babel-loader](https://github.com/babel/babel-loader)
> can be found in [**example**](./example) directory.

* [@babel/preset-typescript](https://babeljs.io/docs/en/babel-preset-typescript)
* [Babel with TypeScript](https://www.typescriptlang.org/docs/handbook/babel-with-typescript.html)
* [What is a tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

> Using babel for transpiling, webpack for bundling and tsc for types.

## Usage

In your webpack configuration:

```js
const TscWebpackPlugin = require("tsc-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.ts",
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
    ],
  },
  plugins: [new TscWebpackPlugin()],
};

```

## Options

You can pass tsc [CLI Options](https://www.typescriptlang.org/docs/handbook/compiler-options.html) as object to plugin.

For example cli `--project ./config/tsconfig.json` will be

```js
const TscWebpackPlugin = require("tsc-webpack-plugin");

module.exports = {
  // ...
  plugins: [new TscWebpackPlugin({ project: "./config/tsconfig.json" })],
  // ...
};
```

## License

MIT License
