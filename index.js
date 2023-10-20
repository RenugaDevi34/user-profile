const express=require("express");
const cors=require("cors");
require('dotenv').config();
const app=express();
const userProfile=require('./Routes/userProfile');

app.use(cors({
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,PUT,GET,DELETE"
}));

app.use(userProfile);

const PORT = process.env.PORT;
app.listen(PORT, process.env.IP, function () {
    console.log("Running on PORT", PORT);
});


module.exports=app;