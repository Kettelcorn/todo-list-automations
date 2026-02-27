const { Client } = require("@notionhq/client")

require('dotenv').config()

// fetch(`https://api.notion.com/v1/data_sources/3132c390-ceff-8189-8d61-000b877cd880`, {
//     method: 'GET',
//     headers: {
//         'Authorization': 'Bearer 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',
//         'Notion-Version': '2025-09-03'
//     }
// })
// .then(res => {
//     return res.json()
// })
// .then(data => console.log(data))
// .catch(error => console.log(error))
async function getData(){
    console.log(process.env.TEST_DATA_SOURCE)
    const response = await fetch(`https://api.notion.com/v1/data_sources/${process.env.TEST_DATA_SOURCE}/query`, {
    method: 'POST',
    headers: {
        'Authorization': `${process.env.NOTION_TOKEN}`,
        'Notion-Version': '2025-09-03',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
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
    })
    const data = await response.json()
    console.log("Retrieved Checked Tasks")
    removeChecks(data)
}

getData()



// Initialize the client
// async function findData() {
//     const notion = new Client({
//         auth: process.env.NOTION_TOKEN,
//     })

//     const result = await notion.databases.retrieve({
//         database_id: process.env.TEST_DATA_SOURCE
//     })
//     console.log(result)
//     // Get all tasks that have the Morning, Afternoon, or Evening Tag
//     const data = await notion.dataSources.query({
//         data_source_id: process.env.DATA_SOURCE,
//         filter_properties: ['Tags', 'Checkbox', 'Name'],
//         filter: {
//             "and": [
//                 {
//                     property: "Checkbox",
//                     checkbox: { equals: true},   
//                 },
//                 {
//                     "or": [
//                         {
//                             property: 'Tags',
//                             multi_select: { contains: "Morning" },
//                         },
//                         {
//                             property: 'Tags',
//                             multi_select: { contains: "Afternoon"},
//                         },
//                         {
//                             property: 'Tags',
//                             multi_select: { contains: "Evening"},
//                         }
//                     ]
//                 }
//             ]
//         }
//     })

//     // Uncheck all checkboxes for filtered tasks
    async function removeChecks(tasks) {
        console.log(`Removing ${tasks.results.length} from tasks`)
        for (let i = 0; i < tasks.results.length; i++) {
            console.log(`Starting to uncheck ${tasks.results[i].properties.Name.title[0].plain_text}, #${i}`)
            const response = await fetch(`https://api.notion.com/v1/pages/${tasks.results[i].id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
                    'Notion-Version': '2025-09-03',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    properties: {
                        Checkbox: {
                            checkbox: false,
                        } 
                    }
                })
            })
            const data = await response.json()
            console.log(`Unchecked ${tasks.results[i].properties.Name.title[0].plain_text}`)
            // const result = await notion.pages.update({
            //     page_id: tasks.results[i].id,
            //     properties: {
            //         Checkbox: {
            //             checkbox: false,
            //         } 
            //     }
            // })
            // console.log(`Unchecked ${tasks.results[i].properties.Name.title[0].plain_text}`)
        }
        hasMore(tasks)
    }

    //removeChecks(data)

    // If tasks number exceeds 100, request next batch
    async function hasMore(data){
        if (data.has_more) {
            console.log("Has more indeed lmao")
            let current_data = data
            let has_more = data.has_more
            while (has_more) {
                const response = await fetch(`https://api.notion.com/v1/data_sources/${process.env.TEST_DATA_SOURCE}/query`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `${process.env.NOTION_TOKEN}`,
                        'Notion-Version': '2025-09-03',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        start_cursor: current_data.next_cursor,
                    })
                })
                const temp = await response.json()
                console.log("This block did run")
                removeChecks(temp)
                if (temp.has_more) {
                    current_data = temp
                } else {
                    has_more = false
                }
                    
                // const temp = await notion.dataSources.query({
                //     data_source_id: process.env.DATA_SOURCE,
                //     filter_properties: ['Tags', 'Checkbox', 'Name'],
                //     start_cursor: current_data.next_cursor,
                // })
                // removeChecks(temp)
                // if (temp.has_more){
                //     current_data = temp
                // } else {
                //     has_more = false
                // }
            } 
        }
    }

//findData()