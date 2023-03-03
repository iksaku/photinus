import solid from "solid-start/vite";
import { VitePWA as pwa } from "vite-plugin-pwa"
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    solid({ ssr: false }),
    pwa({
      devOptions: {
        enabled: true
      },
      registerType: 'autoUpdate',
      manifest: {
        name: 'Photinus',
        short_name: 'Photinus',
        id: 'io.jglz.photinus',
      }
    }),
  ],
});
