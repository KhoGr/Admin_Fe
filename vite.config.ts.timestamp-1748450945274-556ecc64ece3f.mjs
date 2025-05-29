// vite.config.ts
import svgr from "file:///D:/code/doantotnghiep/restaurants/front-end/Admin_ui/node_modules/@svgr/rollup/dist/index.js";
import react from "file:///D:/code/doantotnghiep/restaurants/front-end/Admin_ui/node_modules/@vitejs/plugin-react/dist/index.mjs";
import fs from "fs/promises";
import { resolve } from "path";
import { defineConfig } from "file:///D:/code/doantotnghiep/restaurants/front-end/Admin_ui/node_modules/vite/dist/node/index.js";
var __vite_injected_original_dirname = "D:\\code\\doantotnghiep\\restaurants\\front-end\\Admin_ui";
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      src: resolve(__vite_injected_original_dirname, "src")
    }
  },
  esbuild: {
    loader: "tsx",
    include: /src\/.*\.tsx?$/,
    exclude: []
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        {
          name: "load-js-files-as-tsx",
          setup(build) {
            build.onLoad({ filter: /src\\.*\.js$/ }, async (args) => ({
              loader: "tsx",
              contents: await fs.readFile(args.path, "utf8")
            }));
          }
        }
      ]
    }
  },
  plugins: [svgr(), react()],
  // ✅ Thêm cấu hình server ở đây
  server: {
    port: 5173
    // 👈 đổi thành cổng bạn muốn
  },
  base: "/"
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxjb2RlXFxcXGRvYW50b3RuZ2hpZXBcXFxccmVzdGF1cmFudHNcXFxcZnJvbnQtZW5kXFxcXEFkbWluX3VpXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxjb2RlXFxcXGRvYW50b3RuZ2hpZXBcXFxccmVzdGF1cmFudHNcXFxcZnJvbnQtZW5kXFxcXEFkbWluX3VpXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9jb2RlL2RvYW50b3RuZ2hpZXAvcmVzdGF1cmFudHMvZnJvbnQtZW5kL0FkbWluX3VpL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHN2Z3IgZnJvbSAnQHN2Z3Ivcm9sbHVwJztcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcclxuaW1wb3J0IGZzIGZyb20gJ2ZzL3Byb21pc2VzJztcclxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgc3JjOiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIGVzYnVpbGQ6IHtcclxuICAgIGxvYWRlcjogJ3RzeCcsXHJcbiAgICBpbmNsdWRlOiAvc3JjXFwvLipcXC50c3g/JC8sXHJcbiAgICBleGNsdWRlOiBbXSxcclxuICB9LFxyXG4gIG9wdGltaXplRGVwczoge1xyXG4gICAgZXNidWlsZE9wdGlvbnM6IHtcclxuICAgICAgcGx1Z2luczogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIG5hbWU6ICdsb2FkLWpzLWZpbGVzLWFzLXRzeCcsXHJcbiAgICAgICAgICBzZXR1cChidWlsZCkge1xyXG4gICAgICAgICAgICBidWlsZC5vbkxvYWQoeyBmaWx0ZXI6IC9zcmNcXFxcLipcXC5qcyQvIH0sIGFzeW5jIChhcmdzKSA9PiAoe1xyXG4gICAgICAgICAgICAgIGxvYWRlcjogJ3RzeCcsXHJcbiAgICAgICAgICAgICAgY29udGVudHM6IGF3YWl0IGZzLnJlYWRGaWxlKGFyZ3MucGF0aCwgJ3V0ZjgnKSxcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICBdLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHBsdWdpbnM6IFtzdmdyKCksIHJlYWN0KCldLFxyXG5cclxuICAvLyBcdTI3MDUgVGhcdTAwRUFtIGNcdTFFQTV1IGhcdTAwRUNuaCBzZXJ2ZXIgXHUxRURGIFx1MDExMVx1MDBFMnlcclxuICBzZXJ2ZXI6IHtcclxuICAgIHBvcnQ6IDUxNzMsIC8vIFx1RDgzRFx1REM0OCBcdTAxMTFcdTFFRDVpIHRoXHUwMEUwbmggY1x1MUVENW5nIGJcdTFFQTFuIG11XHUxRUQxblxyXG4gIH0sXHJcblxyXG4gIGJhc2U6ICcvJyxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMFYsT0FBTyxVQUFVO0FBQzNXLE9BQU8sV0FBVztBQUNsQixPQUFPLFFBQVE7QUFDZixTQUFTLGVBQWU7QUFDeEIsU0FBUyxvQkFBb0I7QUFKN0IsSUFBTSxtQ0FBbUM7QUFPekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxRQUFRLGtDQUFXLEtBQUs7QUFBQSxJQUMvQjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLFFBQVE7QUFBQSxJQUNSLFNBQVM7QUFBQSxJQUNULFNBQVMsQ0FBQztBQUFBLEVBQ1o7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLGdCQUFnQjtBQUFBLE1BQ2QsU0FBUztBQUFBLFFBQ1A7QUFBQSxVQUNFLE1BQU07QUFBQSxVQUNOLE1BQU0sT0FBTztBQUNYLGtCQUFNLE9BQU8sRUFBRSxRQUFRLGVBQWUsR0FBRyxPQUFPLFVBQVU7QUFBQSxjQUN4RCxRQUFRO0FBQUEsY0FDUixVQUFVLE1BQU0sR0FBRyxTQUFTLEtBQUssTUFBTSxNQUFNO0FBQUEsWUFDL0MsRUFBRTtBQUFBLFVBQ0o7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztBQUFBO0FBQUEsRUFHekIsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBO0FBQUEsRUFDUjtBQUFBLEVBRUEsTUFBTTtBQUNSLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
