import express from 'express'
import { database } from './data/database_utility.js';
import LocationModel from './models/LocationModel.js';
import cors from "cors";

const app = express();


app.get("/save", async (req, res) => {

    const id = req.query.id ?? Math.random() * 99999;
    const pinName = req.query.pinName ?? "";
    const long = req.query.long ?? 0;
    const lat = req.query.lat ?? 0;
    const lastUpdated = new Date();

    const existing = await LocationModel.findOne({pinName: pinName}).exec()
    let message = "";
    if(existing){
        existing.lat = lat;
        existing.long = long;
        existing.lastUpdated = lastUpdated;

        existing.save();
        message = "Updated existing data: " + pinName; 
    }else{
        await LocationModel.create({
        id: id,
        pinName: pinName,
        long: long, 
        lat: lat,
        lastUpdated: lastUpdated
    })
    message = "Created new data: " + pinName; 
    }

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.status(200).send(message)
})

app.get("/deleteAll", async (req, res) => {

    await LocationModel.deleteMany({}).exec();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.status(200).send("Removed All Data")
})

app.get("/getlocations", async (req, res) => {

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader("Access-Control-Allow-Headers", "*");
    const locations = await LocationModel.find({}).exec()
    res.status(200).send({data: locations})
})

app.use(
    cors({
      origin: ["http://localhost:5173", "*"],
      credentials: false,
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    })
  );
database();
const server = app.listen(80, ()=> {
    console.log("Backend Server is now running")
})

server.headersTimeout = 120 * 1000;
server.keepAliveTimeout = 120 * 1000;

export default app;