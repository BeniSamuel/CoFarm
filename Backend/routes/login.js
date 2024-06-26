const loginFun=require("../controllers/login");
const express=require("express");
const router= express.Router();


router.post("/",loginFun.loginUser);


module.exports=router;