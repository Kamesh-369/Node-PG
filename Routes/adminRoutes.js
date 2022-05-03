const exp = require('express')

const routes = exp.Router();

const User=require("../models/User");
const Category=require("../models/Category");



routes.post("/courseupdate",async (req,res)=>{
  try { 
    
    // if(existingUser)
    // {
    //   return res.status(400).send("User Exist");
    // }
    const category = new Category({
      
        category:req.body.category,
        courseName:req.body.courseName,
        duration:req.body.duration,
        instructor:req.body.instructor,
        instructorDetails:req.body.instructorDetails,
        overview:req.body.overview

        
    });

    const savedCategory = await category.save()
    res.send(savedCategory);
    
  } catch (error) {
    res.send(error);
  }

    
})






routes.get("/view", async (request, response) => {
    const user = await User.find({});
  
    try {
      response.send(user);
    } catch (error) {
      response.status(500).send(error);
    }
  });

















module.exports = routes;