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
    client = await MongoClient.connect("mongodb+srv://student_00:estudiante2021@sandbox.m6mtx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
      useNewUrlParser: true,
    });
    connection = client.db("meta");
    console.log("Connected to DB");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
  return connection;
}

module.exports = connectDB;
