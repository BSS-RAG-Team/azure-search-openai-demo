import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        preserveSymlinks: true
    },
    build: {
        outDir: "../backend/static",
        emptyOutDir: true,
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: id => {
                    if (id.includes("@fluentui/react-icons")) {
                        return "fluentui-icons";
                    } else if (id.includes("@fluentui/react")) {
                        return "fluentui-react";
                    } else if (id.includes("node_modules")) {
                        return "vendor";
                    }
                }
            }
        },
        target: "esnext"
    },
    server: {
        port: 5173,
        strictPort: false,
        host: "127.0.0.1",
        open: false,
        cors: true,
        // Enhanced proxy configuration with better error handling
        proxy: {
            "/content/": {
                target: "http://localhost:50505",
                changeOrigin: true,
                secure: false,
                configure: (proxy, _options) => {
                    proxy.on('error', (err, _req, _res) => {
                        console.log('[Proxy Error - /content/]', err);
                    });
                    proxy.on('proxyReq', (proxyReq, req, _res) => {
                        console.log('[Proxy Request]', req.method, req.url);
                    });
                    proxy.on('proxyRes', (proxyRes, req, _res) => {
                        console.log('[Proxy Response]', proxyRes.statusCode, req.url);
                    });
                }
            },
            "/auth_setup": {
                target: "http://localhost:50505",
                changeOrigin: true,
                secure: false
            },
            "/.auth/me": {
                target: "http://localhost:50505",
                changeOrigin: true,
                secure: false
            },
            "/ask": {
                target: "http://localhost:50505",
                changeOrigin: true,
                secure: false
            },
            "/chat": {
                target: "http://localhost:50505",
                changeOrigin: true,
                secure: false
            },
            "/speech": {
                target: "http://localhost:50505",
                changeOrigin: true,
                secure: false
            },
            "/config": {
                target: "http://localhost:50505",
                changeOrigin: true,
                secure: false
            },
            "/upload": {
                target: "http://localhost:50505",
                changeOrigin: true,
                secure: false
            },
            "/delete_uploaded": {
                target: "http://localhost:50505",
                changeOrigin: true,
                secure: false
            },
            "/list_uploaded": {
                target: "http://localhost:50505",
                changeOrigin: true,
                secure: false
            },
            "/chat_history": {
                target: "http://localhost:50505",
                changeOrigin: true,
                secure: false
            }
        }
    },
    // Enable detailed logging for debugging
    logLevel: 'info',
    clearScreen: false,
    // Enhanced CSS debugging
    css: {
        devSourcemap: true
    },
    // Optimized dependency pre-bundling for faster dev server
    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            'react-router-dom',
            '@fluentui/react',
            '@fluentui/react-components',
            'react-markdown'
        ]
    }
});
