const postmark = require("postmark");

const token = process.env.POSTMARK_API_TOKEN;

const client = new postmark.ServerClient(token);

export { client };
