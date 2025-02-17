module.exports = {
  presets: ["babel-preset-expo"],
  env: {
    test: {
      plugins: ["@babel/plugin-transform-modules-commonjs"], // 👈 Transforms ES modules for Jest
    },
  },
};
