const express=require("express");
const mongoose= require("mongoose");
const config=require("./config/config");
const routes=require("./routes/register");
const app=express();

app.use("/auth",routes);


const port=config.port;
app.listen(port,()=>{
    console.log(`app is running at port ${port}`);
})