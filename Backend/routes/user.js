const userFunc=require("../controllers/user");
const express=require("express");
const router=express.Router();


router.get("/",userFunc.getUsers);
router.get("/:id",userFunc.getAsingleUser);




module.exports=router;