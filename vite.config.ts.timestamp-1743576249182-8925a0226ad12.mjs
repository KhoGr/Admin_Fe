// vite.config.ts
import svgr from "file:///D:/code/doantotnghiep/blog-admin/MatDash-1.0.0/node_modules/@svgr/rollup/dist/index.js";
import react from "file:///D:/code/doantotnghiep/blog-admin/MatDash-1.0.0/node_modules/@vitejs/plugin-react/dist/index.mjs";
import fs from "fs/promises";
import { resolve } from "path";
import { defineConfig } from "file:///D:/code/doantotnghiep/blog-admin/MatDash-1.0.0/node_modules/vite/dist/node/index.js";
var __vite_injected_original_dirname = "D:\\code\\doantotnghiep\\blog-admin\\MatDash-1.0.0";
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
  base: "/"
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxjb2RlXFxcXGRvYW50b3RuZ2hpZXBcXFxcYmxvZy1hZG1pblxcXFxNYXREYXNoLTEuMC4wXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxjb2RlXFxcXGRvYW50b3RuZ2hpZXBcXFxcYmxvZy1hZG1pblxcXFxNYXREYXNoLTEuMC4wXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9jb2RlL2RvYW50b3RuZ2hpZXAvYmxvZy1hZG1pbi9NYXREYXNoLTEuMC4wL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHN2Z3IgZnJvbSAnQHN2Z3Ivcm9sbHVwJztcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcclxuaW1wb3J0IGZzIGZyb20gJ2ZzL3Byb21pc2VzJztcclxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgc3JjOiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIGVzYnVpbGQ6IHtcclxuICAgIGxvYWRlcjogJ3RzeCcsXHJcbiAgICBpbmNsdWRlOiAvc3JjXFwvLipcXC50c3g/JC8sXHJcbiAgICBleGNsdWRlOiBbXSxcclxuICB9LFxyXG4gIG9wdGltaXplRGVwczoge1xyXG4gICAgZXNidWlsZE9wdGlvbnM6IHtcclxuICAgICAgcGx1Z2luczogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIG5hbWU6ICdsb2FkLWpzLWZpbGVzLWFzLXRzeCcsXHJcbiAgICAgICAgICBzZXR1cChidWlsZCkge1xyXG4gICAgICAgICAgICBidWlsZC5vbkxvYWQoeyBmaWx0ZXI6IC9zcmNcXFxcLipcXC5qcyQvIH0sIGFzeW5jIChhcmdzKSA9PiAoe1xyXG4gICAgICAgICAgICAgIGxvYWRlcjogJ3RzeCcsXHJcbiAgICAgICAgICAgICAgY29udGVudHM6IGF3YWl0IGZzLnJlYWRGaWxlKGFyZ3MucGF0aCwgJ3V0ZjgnKSxcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICBdLFxyXG4gICAgfSxcclxuICB9LFxyXG5cclxuICBwbHVnaW5zOiBbc3ZncigpLCByZWFjdCgpXSxcclxuICBiYXNlOiAnLycsXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXNVLE9BQU8sVUFBVTtBQUN2VixPQUFPLFdBQVc7QUFDbEIsT0FBTyxRQUFRO0FBQ2YsU0FBUyxlQUFlO0FBQ3hCLFNBQVMsb0JBQW9CO0FBSjdCLElBQU0sbUNBQW1DO0FBT3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssUUFBUSxrQ0FBVyxLQUFLO0FBQUEsSUFDL0I7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxRQUFRO0FBQUEsSUFDUixTQUFTO0FBQUEsSUFDVCxTQUFTLENBQUM7QUFBQSxFQUNaO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixnQkFBZ0I7QUFBQSxNQUNkLFNBQVM7QUFBQSxRQUNQO0FBQUEsVUFDRSxNQUFNO0FBQUEsVUFDTixNQUFNLE9BQU87QUFDWCxrQkFBTSxPQUFPLEVBQUUsUUFBUSxlQUFlLEdBQUcsT0FBTyxVQUFVO0FBQUEsY0FDeEQsUUFBUTtBQUFBLGNBQ1IsVUFBVSxNQUFNLEdBQUcsU0FBUyxLQUFLLE1BQU0sTUFBTTtBQUFBLFlBQy9DLEVBQUU7QUFBQSxVQUNKO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBRUEsU0FBUyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7QUFBQSxFQUN6QixNQUFNO0FBQ1IsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
