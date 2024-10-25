const mongoose=require("mongoose");


const userSchema=new mongoose.Schema({
name:{
    type:String,
    required:true,
    minlength:4,
},
email:{
    type:String,
    unique:true,
    required:true,
},
password:{
    type:String,
    required:true,
}
});


const User=mongoose.model("User",userSchema);

module.exports=User;