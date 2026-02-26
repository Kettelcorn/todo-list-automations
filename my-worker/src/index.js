/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

const { Client } = require("@notionhq/client")

export default {
	async fetch(request, env, ctx) {
		const notion = new Client({
        	auth: env.NOTION_TOKEN,
    	})
		data_source = env.TEST_DATA_SOURCE; //use testing db
		console.log(`This is notion: ${notion}`)
		return new Response(`Hello there`);
	},
};
