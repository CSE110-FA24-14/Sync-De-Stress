import mongoose from "mongoose";

export function connectDb() {

    const USER = process.env.DATABASE_USER;
    const PASSWORD = process.env.DATABASE_PASSWORD;
    
    const uri = process.env.NODE_ENV == 'test' && typeof process.env.MONGO_URI !== 'undefined' ?
        process.env.MONGO_URI :
        `mongodb+srv://${USER}:${PASSWORD}@mongocluster.erslo.mongodb.net/?retryWrites=true&w=majority&appName=CSE110project`;

    mongoose.connect(
        uri,
        { useNewUrlParser: true },
        err => { if (err) console.log(err); }
    );

};

export function getDbConnection() {
    return mongoose.connection;
}