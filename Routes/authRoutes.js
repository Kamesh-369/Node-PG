const exp = require('express')

const routes = exp.Router();

const User=require("../models/User");

const {hashGenerate}=require("../helpers/hashing");
const {hashValidator}=require("../helpers/hashing");
const{tokenGenerator} = require("../Helpers/token");
const authVerify = require("../Helpers/authVerify");

routes.post("/register",async (req,res)=>{
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
        phoneno:req.body.phoneno,
        password:hashPassword
        
    });

    const savedUser = await user.save()
    res.send(savedUser);
    
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
        res.send("Password is Invalid");
        return;
      }
      else{
        const token = await tokenGenerator(existingUser.email)
        res.cookie("jwt",token);
        res.send(token);
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





module.exports = routes;