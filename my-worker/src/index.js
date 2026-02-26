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
		async function findData(notion_token, data_source) {
			console.log("still here")
			
    		const notion = new Client({
        		auth: notion_token,
    		})
			console.log(`${data_source}`)
    		// Get all tasks that have the Morning, Afternoon, or Evening Tag
    		const data = await notion.dataSources.query({
				data_source_id: data_source,
				filter_properties: ['Tags', 'Checkbox', 'Name'],
				filter: {
					"and": [
						{
							property: "Checkbox",
							checkbox: { equals: true},   
						},
						{
							"or": [
								{
									property: 'Tags',
									multi_select: { contains: "Morning" },
								},
								{
									property: 'Tags',
									multi_select: { contains: "Afternoon"},
								},
								{
									property: 'Tags',
									multi_select: { contains: "Evening"},
								}
							]
						}
					]
				}
			})
			console.log("hello?")
			console.log(data)
			return data;
		}

		async function removeChecks(tasks) {
			for (let i = 0; i < tasks.results.length; i++) {
				const result = await notion.pages.update({
					page_id: tasks.results[i].id,
					properties: {
						Checkbox: {
							checkbox: false,
						} 
					}
				})
				console.log(`Unchecked ${tasks.results[i].properties.Name.title[0].plain_text}`)
			}
		}

		async function hasMore(data) {
			if (data.has_more) {
				let current_data = data
				let has_more = data.has_more
				while (has_more) {
					const temp = await notion.dataSources.query({
						data_source_id: process.env.DATA_SOURCE,
						filter_properties: ['Tags', 'Checkbox', 'Name'],
						start_cursor: current_data.next_cursor,
					})
					removeChecks(temp)
					if (temp.has_more){
						current_data = temp
					} else {
						has_more = false
					}
				} 
			}
		}
        const notion_token = env.NOTION_TOKEN;
		console.log("Hello there");
		const data_source = env.TEST_DATA_SOURCE;
		const result = findData(notion_token, data_source);
		removeChecks(result);
		hasMore(result);
		return new Response(`Hello there ${data_source}`);
	},
};




