import mongoose from "mongoose";

export function connectDb() {

    const USER = process.env.DATABASE_USER;
    const PASSWORD = process.env.DATABASE_PASSWORD;

    console.log(`User: ${USER}`)

    mongoose.connect(
        `mongodb+srv://${USER}:${PASSWORD}@mongocluster.erslo.mongodb.net/?retryWrites=true&w=majority&appName=CSE110project`,
        { useNewUrlParser: true },
        err => {if (err) console.log(err);}
    );

};

export function getDbConnection() {
    return mongoose.connection;
}