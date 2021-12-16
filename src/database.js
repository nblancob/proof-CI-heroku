require("dotenv").config();
const { MongoClient } = require("mongodb");
const { DB_URL } = process.env;
const { DB_NAME } = process.env;
//Database
let connection;
async function connectDB() {
  let client;
  if (connection) return connection;
  try {
    client = await MongoClient.connect(DB_URL, {
      useNewUrlParser: true,
    });
    connection = client.db(DB_NAME);
    console.log("Connected to DB");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
  return connection;
}

module.exports = connectDB;
