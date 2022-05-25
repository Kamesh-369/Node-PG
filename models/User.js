const mongoose=require("mongoose")

const userSchema =new mongoose.Schema({

    username:{ type:String,required:true,unique:true},
    email:{type:String,required:true},
    phoneno:{type:String,required:true},
    password:{type:String,required:true},
    userType:{type:String,default:'user'},
    enrollments: {type: [Object],default: null},
})

module.exports = mongoose.model("User",userSchema);