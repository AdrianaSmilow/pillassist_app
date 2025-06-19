// client/src/setupProxy.js
const { createProxyMiddleware } = require("http-proxy-middleware");

function setupProxy(app) {
  app.use(
    ["/medicine", "/usage"],
    createProxyMiddleware({
      target: "http://localhost:3000",
      changeOrigin: true,
    })
  );
}

module.exports = setupProxy;