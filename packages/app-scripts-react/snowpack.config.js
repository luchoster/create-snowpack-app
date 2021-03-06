const fs = require("fs");
const path = require("path");

const cwd = process.cwd();
const isTS = fs.existsSync(path.join(cwd, "tsconfig.json"));

const scripts = {
  "mount:public": "mount public --to /",
  "mount:web_modules": "mount web_modules",
};

if (isTS) {
  scripts["lintall:tsc"] = "tsc --noEmit";
  scripts["lintall:tsc::watch"] = "$1 --watch";
}

const buildId = isTS ? "build:ts,tsx,js,jsx" : "build:js,jsx";
if (
  fs.existsSync(path.join(cwd, "babel.config.json")) ||
  fs.existsSync(path.join(cwd, "babel.config.js")) ||
  fs.existsSync(path.join(cwd, "babel.config.cjs")) ||
  fs.existsSync(path.join(cwd, "babel.config.mjs"))
) {
  scripts[buildId] = "babel --no-babelrc";
} else {
  const bundledConfig = path.join(__dirname, "babel.config.json");
  scripts[buildId] = `babel --no-babelrc --config-file ${bundledConfig}`;
}

if (fs.existsSync(path.join(cwd, "postcss.config.js"))) {
  scripts["build:css"] = "postcss";
} else {
  const bundledConfig = path.join(__dirname, "postcss.config.js");
  scripts["build:css"] = `postcss --config ${bundledConfig}`;
}

scripts["build:svg"] = "cat";

module.exports = {
  installOptions: {
    clean: true,
    installTypes: isTS,
  },
  dev: {
    port: 3000,
    src: "src",
    out: "build",
    dist: "/_dist_",
    fallback: "index.html",
    bundle: process.env.NODE_ENV === "production",
  },
  scripts,
};
