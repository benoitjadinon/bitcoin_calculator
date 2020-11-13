const sveltePreprocess = require('svelte-preprocess');
const production = !process.env.ROLLUP_WATCH;
module.exports = {
    // Consult https://github.com/sveltejs/svelte-preprocess
    // for more information about preprocessors
    preprocess: sveltePreprocess(
        {
            sourceMap: !production,
            postcss: {
                plugins: [
                    require("tailwindcss"),
                    require("autoprefixer"),
                ],
            },
        }
    ),
	// By default, `npm run build` will create a standard Node app.
	// You can create optimized builds for different platforms by
	// specifying a different adapter
	adapter: '@sveltejs/adapter-node'
};
