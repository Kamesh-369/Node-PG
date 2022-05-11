const exp = require('express')

const routes = exp.Router();

const User=require("../models/User");
const Category=require("../models/Category");

const {hashGenerate}=require("../helpers/hashing");
const {hashValidator}=require("../helpers/hashing");
const{tokenGenerator} = require("../Helpers/token");
const authVerify = require("../Helpers/authVerify");
const req = require('express/lib/request');
var nodemailer = require('nodemailer');
const res = require('express/lib/response');

routes.post("/register",async (req,res)=>{
  console.log(req.body);
  try {

    const hashPassword= await hashGenerate(req.body.password);
    // const userEmail = await req.body.email;
    const existingUser = await User.findOne({email:req.body.email})
    
    if(existingUser)
    {
      return res.status(400).send("User Exist");
    }
    const user = new User({
      
        username:req.body.username,
        email:req.body.email,
        phoneno:req.body.phonenumber,
        password:hashPassword,
        userType:req.body.userType
        
    });

    const savedUser = await user.save()
    res.json(savedUser);
    
  } catch (error) {
    res.send(error);
  }

    
})

routes.post("/login",async (req,res)=>{
  try {
    const existingUser = await User.findOne({email:req.body.email})
    
    if(!existingUser)
    {
      res.send("Email Id Mismatch");
    }
    else
    {
      const checkUser = await hashValidator(req.body.password,existingUser.password)
      if(!checkUser)
      {
        res.json({msg:"Password is Invalid"});
        return;
      }
      else{
        const token = await tokenGenerator(existingUser.email, existingUser.userType)
        const check = await (existingUser.userType)
        res.cookie("jwt",token);
        res.send({token:token,msg:"Login Success"});
        console.log(check);
    }
    }


  } catch (error) {
    res.send(error);
    
  }
    

    
})

routes.get("/view",authVerify ,async (request, response) => {
  const user = await User.find({});

  try {
    response.send(user);
  } catch (error) {
    response.status(500).send(error);
  }
});



//Use Case:2 To view based on specific Categories -- Done
routes.get("/view/:category",authVerify ,async (request, response) => {
  const catego = request.params.category;
  console.log(catego);
  const cat = await Category.find({category:catego })

  try {
    response.json(cat);
  } catch (error) {
    response.status(500).send(error);
  }
});



//Use Case 3: To Show Relavant Courses -- Done
routes.get("/view/:category/:course" ,authVerify,async (request, response) => {
  
  const catego = request.params.category;
  const cour=request.params.course;
  console.log(catego);
  console.log(cour);
  const cat = await Category.find({category:catego,courseName:cour}).select({ "duration": 1, "_id": 0,"courseName":1,"instructorDetails": 1,"overview":1,"instructor":1});;

  try {
    response.json(cat);
  } catch (error) {
    response.status(500).send(error);
  }
});


//Use Case 4: To show CourseDetails InstructorDetails and Option to enroll----Option to enroll need to be done.
routes.get("/view/:category/:course/:course",authVerify ,async (request, response) => {
  const catego = request.params.category;
  const cour=request.params.course;
  const cat = await Category.find({category:catego,courseName:cour}).select({ "courseName":1,"instructorDetails": 1, "_id": 0,"overview":1,"instructor":1});;

  try {
    response.send(cat);
  } catch (error) {
    response.status(500).send(error);
  }
});


//Logout Functionality  
routes.get("/logout",(req,res)=>{
  res.clearCookie("jwt");
  res.send("completed successfully");
});



//Use Case 5: Confirm Enrollment
routes.post("/view/:category/:course/:course/enroll",authVerify ,async (request, response) => {
  const catego = request.params.category;
  const cour=request.params.course;
  const userName = request.body.email;
  //const cat = await Category.find({category:catego,courseName:cour}).select({ "courseName":1,"instructorDetails": 1, "_id": 0,"overview":1});;
  var sender = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : 'testmail.course@gmail.com',
        pass : 'kamesh@123'
    }
});

var composeEmail = {
    from: 'testmail.course@gmail.com',
    to: userName,
    subject: 'Testing Email',
    html:'<h1>Testing Email ---- Course Registerd Successfuly<br>'+cour+' : Course Registerd</h1>',
};

sender.sendMail(composeEmail, function(error,info){
  if(error){
      console.log(error);
      response.send(error);
  }
  else{
      response.send("Mail sent successfully" + info.response);
  }
})

});

module.exports = routes;