import { createProxyMiddleware } from "http-proxy-middleware";

export default function configureProxy(app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:8800",
      changeOrigin: true,
    })
  );
}
