import { Schema, Types, model } from "mongoose";
import { UserInterface } from "../shared/interface/modelInterface";

const UserSchema: Schema<UserInterface> = new Schema({
    "email" : {
        type: String,
        required: true,
        unique: true
    },
    "password": {
        type: String,
        required: true
    },
    "is_superuser": {
        type: Boolean,
        default: false,
        required: true
    }
}, {versionKey: false});

export default model<UserInterface>("User", UserSchema);