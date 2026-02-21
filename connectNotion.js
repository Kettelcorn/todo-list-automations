const { Client } = require("@notionhq/client")

require('dotenv').config()

// Initialize the client
async function findData() {
    const notion = new Client({
        auth: process.env.NOTION_TOKEN,
    })

    const data = await notion.dataSources.query({
        data_source_id: process.env.DATA_SOURCE,
    })
    
    console.log(data.results[0].properties.Tags.multi_select)
}

findData()
