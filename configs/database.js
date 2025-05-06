require('dotenv').config();

const mongoose = require("mongoose");

module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            serverSelectionTimeoutMS: 300000,
            connectTimeoutMS: 100000,
        });
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error connecting:", error);
    }
};