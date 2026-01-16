const mongoose = require('mongoose')
require("dotenv").config();


const MONGOURL = process.env.MONGOURL;
const DB = process.env.MONGO_DB;

const mongoUrl = `${MONGOURL}/${DB}`;
console.log(mongoUrl)

mongoose.connection.on("error", console.error.bind(console, "MongoDB connection error:"));
mongoose.connection.once("open", function () {
    console.log("Connected to MongoDB successfully!");
});

async function mongoConnection() {
    try {
        await mongoose.connect(mongoUrl)
    } catch (error) {
        console.log(error, 'Error from mongo connection')
    }
}

module.exports = mongoConnection;
