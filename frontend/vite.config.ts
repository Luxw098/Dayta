import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { readFileSync } from 'fs';

const baseURL = "localhost:3001";

export default defineConfig({
	plugins: [sveltekit()],
  server: {
		port: 3000,
    https: {
      key: readFileSync('../cert/key.key'),
      cert: readFileSync('../cert/cert.crt')
    },
    proxy: {
      '/api': {
        target: 'https://' + baseURL,
        secure: false
      }
    }
  }
});
