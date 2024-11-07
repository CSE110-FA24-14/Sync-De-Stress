import { Schema, model } from "mongoose";
import { ProfileInterface } from "../shared/interface/modelInterface";

const ProfileSchema: Schema<ProfileInterface> = new Schema({
    "username": {
        type: String,
        required: true
    },
    "description": {
        type: String,
        default: ""
    },
    "dateOfBirth": {
        type: Date,
        required: true
    },
    "year": {
        type: String,
        required: true
    },
    "major": {
        type: String,
        required: true
    },
    "college": {
        type: String,
        required: true
    },
    "classes": {
        type: String,
        required: true
    },
    "hobby": {
        type: String,
        required: true
    },
    "musicPreference": {
        type: String,
        required: true
    },
    "favArtists": {
        type: String,
        required: true
    },
    "friend": {
        type: [String], 
        default: [], 
      },
    "friend_requested": {
        type: [String], 
        default: [], 
      },
    "contact": {
        type: String,
        required: true
    },
}, { versionKey: false });

export default model<ProfileInterface>("Profile", ProfileSchema);