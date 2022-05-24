const exp = require('express')

const routes = exp.Router();

//const User=require("../models/User");
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
  //console.log(request);
  const user = await Category.find({});
  console.log(user);
  
    try {
      response.json(user);
    } catch (error) {
      response.status(500).send(error);
    }
  });


  routes.delete("/view/:courseName", async (request, response) => {
    //console.log(request);
    
    const cour= await request.params.courseName;
    Category.findByIdAndDelete({_id:cour}, 
      function(err, data) {
          if(err){
              console.log(err);
          }
          else{
              response.json(data);

          }
      });


  });  


  routes.put("/view/:id",async(req,res)=>{
    const id= await req.params.id;
    console.log("Change request",req.body);
    Category.updateOne({_id:id},{
     // $set:{
        category:req.body.category,
        courseName:req.body.courseName,
        duration:req.body.duration,
        instructor:req.body.instructor,
        instructorDetails:req.body.instructorDetails,
        overview:req.body.overview
      //}
    })
    .then(result=>{
      res.json({
        updated_product:result
    })}
    )
    

    
  })

















module.exports = routes;