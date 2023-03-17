// Configure dotenv
import Dotenv from "dotenv";
Dotenv.config()

// Create express app
import express from 'express';
app = express();

// Application Configuration
app.use(express.urlencoded({extended:false}));
app.use(express.json());

// Connect to Database
import connectDB from "./db/dbConnection.js";
connectDB(process.env.DB_URI);

// Listen Server
const Port = process.env.PORT;

app.listen(Port,()=>{
    console.log(`Server running on http://localhost:${Port}`);
})
