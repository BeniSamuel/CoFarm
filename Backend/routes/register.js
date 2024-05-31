const registration=require("../controllers/registration");
const express= require("express");
const router=express.Router();



router.post("/register",registration.createUser);




module.exports=router;