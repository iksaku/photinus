import solid from "solid-start/vite";
import { VitePWA as pwa } from "vite-plugin-pwa"
import { defineConfig } from "vite";

export default defineConfig((env) => ({
  plugins: [
    solid({ ssr: false }),
    pwa({
      devOptions: {
        enabled: true
      },
      selfDestroying: env.mode === 'development',
      registerType: 'autoUpdate',
      manifest: {
        name: 'Photinus',
        short_name: 'Photinus',
        id: 'io.jglz.photinus',
      }
    }),
  ],
}));
