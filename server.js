import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import mainRouter from './routes/indexRouting.js';
import bodyParser from 'body-parser';
import cors from "cors";

dotenv.config();

const app = express();

// ✅ Enable CORS first
app.use(cors({
    origin: '*', // Allow only frontend requests
    credentials: true // Allow cookies if needed
}));

// ✅ Middleware for JSON parsing
app.use(bodyParser.json());

// ✅ Define routes AFTER CORS middleware
app.use("/", mainRouter);

// ✅ Database Connection
mongoose.set("strictQuery", false);
mongoose
    .connect(process.env.db)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(process.env.port, () => { 
            console.log(`Node API is running on port http://localhost:${process.env.port}`);
        });
    })
    .catch((error) => {
        console.log("Database connection error:", error);
    });
