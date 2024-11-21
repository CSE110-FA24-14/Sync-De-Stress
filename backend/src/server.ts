import express, { Application } from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors"
import mongoSanitize from "express-mongo-sanitize";
import { connectDb } from "./config/db"
import router from "./api/router";

// Inject env variable
dotenv.config({path: path.join(__dirname, "../.env")});

const app: Application = express();
const PORT: Number = Number(process.env.port) || 3102;

// Setup middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(mongoSanitize());
app.use(express.static(path.join(__dirname, '../public')));
app.use("/", router());

// Start the server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
    connectDb();
    app.listen(PORT, () => console.log(`Server started at Port: ${PORT}`));
}

export default app;