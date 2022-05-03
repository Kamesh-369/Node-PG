const mongoose=require("mongoose")

const categorySchema =new mongoose.Schema({

    category:{ type:String,required:true},
    courseName:{type:String,required:true},
    duration:{type:String,required:true},
    instructor:{type:String,required:true},
    instructorDetails:{type:String,required:true},
    overview:{type:String,required:true}

})

module.exports = mongoose.model("Category",categorySchema);