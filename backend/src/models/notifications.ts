import { Schema, model } from "mongoose";
import { NotificationInterface } from "../shared/interface/modelInterface";

const NotificationSchema: Schema<NotificationInterface> = new Schema({
    "userId": {
        type: String,
        required: true
    },
    "type": {
        type: Number,
        required: true
    },
    "targetId": {
        type: String,
        default: ""
    },
    "date": {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });

export default model<NotificationInterface>("Notification", NotificationSchema);