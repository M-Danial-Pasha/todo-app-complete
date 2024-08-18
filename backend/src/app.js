import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { baseURL, whiteDomains } from "./utils/Constants.js";

//Defining Express App Object
const app = express();

//Applying CORS policy
app.use(cors({
    origin: whiteDomains.length > 0 ? whiteDomains : process.env.CORS_DEFAULT_ORIGIN_POLICY,
    credentials: true,
}));

//Applying Middlewares on Express App
app.use(express.json({limit: "20kb"}));
app.use(express.urlencoded({extended: true, limit: "20kb"}));
app.use(express.static("public"));
app.use(cookieParser());

//All Routes
import { UserRoutes } from "./routes/index.js";

app.use(`${baseURL}/auth`, UserRoutes);

//Exporting the Express App
export { app };
