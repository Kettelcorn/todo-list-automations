const { Client } = require("@notionhq/client")

require('dotenv').config()

// Initialize the client
async function findData() {
    const notion = new Client({
        auth: process.env.NOTION_TOKEN,
    })

    const result = await notion.databases.retrieve({
        database_id: process.env.TEST_DATA_SOURCE
    })
    console.log(result)
    // Get all tasks that have the Morning, Afternoon, or Evening Tag
    const data = await notion.dataSources.query({
        data_source_id: process.env.DATA_SOURCE,
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

    // Uncheck all checkboxes for filtered tasks
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

    //removeChecks(data)

    // If tasks number exceeds 100, request next batch
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

findData()
