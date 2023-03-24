// Configure dotenv
import dotenv from 'dotenv';
dotenv.config();

// Create express app
import express from 'express'
const app = express();

// Very Very Imp for  Saving 3 Hrs.
import cors from 'cors';
app.use(cors());

// Application Configuration
// app.use(express.urlencoded({extended:false}));
app.use(express.json());

// Connect to Database
import connectDB from "./db/dbConnection.js";
connectDB(process.env.DB_URI);

// Configure Express Sessions
import session from 'express-session';
import MongoDBStore from 'connect-mongodb-session';
var store = new MongoDBStore({
    uri: process.env.DB_URI,
    collection: process.env.DB_NAME
});
// Catch errors
store.on('error', function (error) {
    console.log(error);
});

app.use(require('express-session')({
    secret: process.env.JWT_SECRET,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    store: store,
    resave: true,
    saveUninitialized: true
}));



// Routes
import user from './routes/user.js'
app.use('/user', user);

// Listen Server
const Port = process.env.PORT;

app.listen(Port, () => {
    console.log(`Server running on http://localhost:${Port}`);
})
