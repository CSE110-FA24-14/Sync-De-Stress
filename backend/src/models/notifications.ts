import { Schema, model } from "mongoose";
import { NotificationInterface } from "../shared/interface/modelInterface";

const NotificationSchema: Schema<NotificationInterface> = new Schema({
    "message": {
        type: String,
        required: true
    },
    "type": {
        type: String,
        required: true
    },
    "icon": {
        type: String,
        default: ""
    },
    "actionLink": {
        type: String,
        default: ""
    }
}, { versionKey: false });

export default model<NotificationInterface>("Notification", NotificationSchema);