import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: {
			'/photos': {
				target: 'http://47.141.162.220:2283',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/photos/, '')
			},
			'/map': {
				target: 'http://47.141.162.220:8079',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/map/, '')
			}
		}
	}
});
