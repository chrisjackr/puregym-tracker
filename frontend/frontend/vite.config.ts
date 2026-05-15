import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    server: {
      host: "0.0.0.0",
      port: 5173,
      allowedHosts: [
        env.VITE_API_HOST_ORIGIN
      ]
    }
  }
})