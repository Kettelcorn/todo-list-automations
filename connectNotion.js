const { Client } = require("@notionhq/client")

// Initialize the client
const notion = new Client({
    auth: process.env.NOTION_TOKEN,
})

console.log(notion)

async function connectServer() {
    const listUsersResponse = await notion.users.list({})
    console.log(listUsersResponse)
}

connectServer()
