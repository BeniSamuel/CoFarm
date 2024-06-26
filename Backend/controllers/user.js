const User=require("../models/user")



exports.getUsers= async(req,res) =>{
    try{
       const users=await User.find();

       res.status(201).send(users);
    }catch(error){
      res.status(500).send("internal server error!");
    }

};

exports.getAsingleUser= async(req,res)=>{
    try{
      const users=await User.findById(req.params.id);
      if(!users) {res.status(404).send("User not found!")};
    
      res.status(201).send(users);
    }
    catch(error){
       res.status(500).send(error);
    }
}