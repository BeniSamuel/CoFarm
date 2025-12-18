const registration=require("../controllers/registration.controller");
const express= require("express");
const router=express.Router();



router.post("/",registration.createUser);




module.exports=router;