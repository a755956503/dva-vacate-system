export default {
  "entry": "src/index.js",
  "disableCSSModules": false,
  "autoprefixer": null,
  "extraBabelPlugins": [
    "transform-runtime",
    [
      "import",
      {
        "libraryName": "antd",
        "style": true
      }
    ]
  ],
  "env": {
    "development": {
      "extraBabelPlugins": [
        "dva-hmr"
      ]
    }
  },
  "proxy": {
    "/api": {
      "target": "http://172.20.140.45:3000",
      "changeOrigin": true,
      "pathRewrite": {
        "^/": "/"
      }
    }
  }
}
