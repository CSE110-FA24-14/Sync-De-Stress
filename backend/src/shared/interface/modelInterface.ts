import { Document, ObjectId, Types } from "mongoose"

export interface UserInterface extends Document {
    email: String
    password: String,
    is_superuser: Boolean
}

export interface AuthInterface extends Document {
    user_id: Types.ObjectId,
    auth1: String,
    auth2: String,
    created: Date,
    expired: Date
}

