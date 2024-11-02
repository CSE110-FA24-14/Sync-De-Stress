import express, { Application } from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors"

// Inject env variable
dotenv.config({path: path.join(__dirname, "../.env")});

const app: Application = express();
const PORT: Number = Number(process.env.port) || 3102;

// Setup middlewares
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

app.listen(PORT, () => console.log(`Server started at Port: ${PORT}`));