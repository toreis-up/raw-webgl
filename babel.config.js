module.exports = (api) => {
  const isProduction = api.env("production");

  return {
    presets: [
      [
        "@babel/preset-env",
        {
          useBuiltIns: "usage",
          corejs: 3,
        },
      ],
      "@babel/typescript",
      [
        "minify",
        {
          builtIns: false,
        },
      ].filter(Boolean),
    ],
  };
};