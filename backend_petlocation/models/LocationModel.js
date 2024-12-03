import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    pinName: {
        type: String,
        required: true,
        default: ""
    },
    long: {
        type: Number,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    lastUpdated: {
        type: Date
    }
});


export default mongoose.model("Location", LocationSchema);