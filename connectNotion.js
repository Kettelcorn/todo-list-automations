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
    fetch(`https://api.notion.com/v1/data_sources/3132c390-ceff-8189-8d61-000b877cd880/query`, {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer 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',
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
    .then(res => {
    return res.json()
    })
    .then(data => removeChecks(data))
    .catch(error => console.log(error))
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
        for (let i = 0; i < tasks.results.length; i++) {
            fetch(`https://api.notion.com/v1/pages/${tasks.results[i].id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': 'Bearer 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',
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
            .then(res => {
            return res.json()
            })
            .then(data => console.log(`Unchecked ${tasks.results[i].properties.Name.title[0].plain_text}`))
            .catch(error => console.log(error))
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
    }

    //removeChecks(data)

    // If tasks number exceeds 100, request next batch
//     if (data.has_more) {
//         let current_data = data
//         let has_more = data.has_more
//         while (has_more) {
//             const temp = await notion.dataSources.query({
//                 data_source_id: process.env.DATA_SOURCE,
//                 filter_properties: ['Tags', 'Checkbox', 'Name'],
//                 start_cursor: current_data.next_cursor,
//             })
//             removeChecks(temp)
//             if (temp.has_more){
//                 current_data = temp
//             } else {
//                 has_more = false
//             }
//         } 
//     }
// }

//findData()