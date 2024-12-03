import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

const uri = process.env.DB_CONN ?? "";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version

export const database = () => {
    console.log("Connecting to mongodb");
    mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = mongoose.connection;

    db.on("error", (error) => {
        console.log(error);
    });
    db.once("open", () => {
        console.log("MongoDB - Database Connected");
    });
}