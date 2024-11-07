import { Schema, model } from "mongoose";
import { EventInterface } from "../shared/interface/modelInterface";

const EventSchema: Schema<EventInterface> = new Schema({
    "eventName": {
        type: String,
        required: true
    },
    "description": {
        type: String,
        default: ""
    },
    "eventDate": {
        type: String,
        required: true
    },
    "eventTime": {
        type: String,
        required: true
    },
    "location": {
        type: String,
        required: true
    },
    "priceEstimate": {
        type: Number,
        default: 0
    },
    "coverPhoto": {
        type: String,
        default: ""
    }
}, { versionKey: false });

export default model<EventInterface>("Event", EventSchema);