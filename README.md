# tsc-webpack-plugin

> A TypeScript plugin for webpack

## Install

```bash
yarn add -D tsc-webpack-plugin
```

## Usage

In your webpack configuration:

```js
const TscWebpackPlugin = require("tsc-webpack-plugin");

module.exports = {
  // ...
  plugins: [new TscWebpackPlugin()],
  // ...
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
