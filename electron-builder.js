const Package = require("./package.json");

module.exports = {
  appId: "com.my.app",
  productName: "myapp",
  buildVersion: Package.version,
  directories: {
    app: "./build/",
    output: "./dist/"
  },
  nsis: {
    oneClick: true,
    perMachine: false,
    allowElevation: true
  }
};
