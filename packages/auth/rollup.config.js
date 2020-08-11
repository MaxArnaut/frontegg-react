import { terser } from "rollup-plugin-terser";
import json from "@rollup/plugin-json";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import ts from "rollup-plugin-typescript2";
import progress from "rollup-plugin-progress";
import postcss from "rollup-plugin-postcss";
import typescript from "typescript";
import fs from "fs";
import movePackageJson from "../../conf/movePackageJson";

const pkg = JSON.parse(fs.readFileSync("./package.json"));
const isProduction = process.env.NODE_ENV === "production";

const commonOutput = {
  exports: "named",
  sourcemap: !isProduction
};

const plugins = [
  replace({
    __BUILD_ENV__: isProduction ? "prod" : "dev",
    __BUILD_DATE__: () => new Date(),
    "process.env.NODE_ENV": JSON.stringify(isProduction ? "production" : "development"),
    "process.env.FRONTEGG_DEBUG_LEVEL": JSON.stringify(isProduction ? "error" : "debug")
  }),
  json(),
  resolve({
    jsnext: true,
    browser: true
  }),
  postcss({
    extensions: ["scss", "sass"],
    minimize: true
    // extract: "style.css"
  }),
  commonjs({
    include: [/node_modules/],
    sourceMap: false
  }),
  isProduction ? terser() : progress(),
  ts({
    typescript,
    clean: true,
    check: true,
    abortOnError: false
  })
];

const commonConfig = {
  input: "src/index.ts",
  external: [
    "react",
    "react-dom",
    "react-router",
    "react-router-dom"
  ]
};

export default {
  ...commonConfig,
  plugins: [
    ...plugins,
    // transformTypesAlias(),
    // visualizer()
    movePackageJson({
      npmDistFolder: "../../../local_npm_repo/@frontegg-react/auth/"
    })
  ],
  external: [...Object.keys(pkg.dependencies || [])],
  inlineDynamicImports: true,
  output: {
    ...commonOutput,
    dir: "../../../local_npm_repo/@frontegg-react/auth/",
    format: "cjs"
  }

};
