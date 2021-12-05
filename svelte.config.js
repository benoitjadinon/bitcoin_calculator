import preprocess from 'svelte-preprocess';
//import adapter from '@sveltejs/adapter-static';
import path from 'path'

const production = !process.env.ROLLUP_WATCH;

/** @type {import('@sveltejs/kit').Config} */
let config;
config = {
    // Consult https://github.com/sveltejs/svelte-preprocess
    // for more information about preprocessors
    preprocess: preprocess(
        {
            sourceMap: !production,
        }
    ),

    kit: {
        // hydrate the <div id="svelte"> element in src/app.html
        target: '#svelte',
        /*
        adapter: '@sveltejs/adapter-node'
        adapter: adapter({
            // default options are shown
            pages: 'build',
            assets: 'build',
            fallback: null
        }),
        prerender: {
            enabled: false
        },
        ssr: false,
         */
        vite: {
            resolve: {
                alias: {
                    $lib: path.resolve('src/lib/'),
                    $routes: path.resolve('src/routes/')
                }
            }
        }
    }
};

export default config;
