const {MongoClient} = require("mongodb");
const url = "mongodb://localhost:27017";
const database = "local";
const client = new MongoClient(url);


async function getConnection() {
    let result = await client.connect();
    let db = result.db(database);
    let collection = db.collection("products");
    let response = await collection.find({}).toArray()
    console.log(response);
}
 

getConnection();