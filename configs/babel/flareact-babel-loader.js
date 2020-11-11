module.exports = require("babel-loader").custom((babel) => {
  return {
    customOptions({ dev, isServer, ...loader }) {
      return {
        custom: { dev, isServer },
        loader,
      };
    },

    config(cfg, { customOptions: { isServer, dev } }) {
      const filename = this.resourcePath;
      const isPageFile = filename.includes("pages");

      let plugins = ["react-require", "@babel/plugin-transform-runtime"];

      if (!isServer) {
        if (dev) {
          plugins.push(require.resolve("react-refresh/babel"));
        }

        if (isPageFile) {
          console.log(
            `${filename} is a page file and this is not on the server`
          );
          plugins.push(require.resolve("./plugins/flareact-edge-transform"));
        }
      }

      return {
        ...cfg.options,
        presets: ["@babel/preset-env", "@babel/preset-react"],
        plugins,
      };
    },

    result(result) {
      return {
        ...result,
        code: result.code + "\n// Generated by some custom loader",
      };
    },
  };
});
