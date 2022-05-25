const exp = require('express')

const routes = exp.Router();

const User=require("../models/User");
const Category=require("../models/Category");

const {hashGenerate,hashValidator}=require("../Helpers/hashing");
const{tokenGenerator,refreshtokenGenerator} = require("../Helpers/token");
const authVerify = require("../Helpers/authVerify");

var nodemailer = require('nodemailer');

const jwt = require("jsonwebtoken");
routes.post("/register",async (req,res)=>{
  console.log(req.body);
  try {

    const hashPassword= await hashGenerate(req.body.password);
    // const userEmail = await req.body.email;
    const existingUser = await User.findOne({email:req.body.email})
    
    if(existingUser)
    {
      return res.status(400).send(error);
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
    console.log(savedUser);
    
  } catch (error) {
    res.send(error);
  }

    
})

routes.post("/login",async (req,res)=>{
  try {
    const existingUser = await User.findOne({email:req.body.email})  
    
    if(!existingUser)
    {
      return res.status(400).send(error);
    }
    else
    {
      const checkUser = await hashValidator(req.body.password,existingUser.password)
      if(!checkUser)
      {
        return res.status(400).send(error);
        
      }
      else{
        const token = await tokenGenerator(existingUser.email, existingUser.userType)
        const ref_token = await refreshtokenGenerator(existingUser.email, existingUser.userType)
        const check = await (existingUser.userType)
        res.cookie("jwt",token);
        res.cookie("ref_jwt",ref_token);
        res.send({token:token,ref_token:ref_token,msg:"Login Success"});
       // res.send({token:ref_token,msg:"Login Success with Refresh Token"});
        console.log(check);

        //

        var sender = nodemailer.createTransport({
          service : 'gmail',
          auth : {
              user : 'testmail.course@gmail.com',
              pass : 'kamesh@123'
          }
      });
      
      var composeEmail = {
          from: 'testmail.course@gmail.com',
          to: existingUser.email,
          subject: 'Skillup',
          html:'<h1>Welcome To Skillup ---- You have been Loggedin successfuly.....',
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
  const cat = await Category.find({category:catego,courseName:cour}).select({ "duration": 1, "_id": 0,"courseName":1,"instructorDetails": 1,"overview":1,"instructor":1,"category":1,"price":1});;

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

// enrollments
routes.post("/view/enroll",authVerify,async(req,res)=>{
  //const userName = request.body.email;
  console.log(req.body);
  User.updateOne(
    { email: req.body.email },{ $push: { enrollments: req.body.courseName } },

    function (err, result) {
      if (err) {
        res.send(err);
      } else {
        console.log("res", result);
        res.send(result);
      }
    }
  );

})

//Profile Component

routes.get("/profile/:email",authVerify,async(req,res)=>{
  //const userName = request.body.email;
  const mail = req.params.email;
  console.log(mail);
  const cat = await User.find({email:mail})
  try {
    res.json(cat);
  } catch (error) {
    res.status(500).send(error);
  }
  // User.updateOne(
  //   { email: req.body.email },{ $push: { enrollments: req.body.courseName } },

  //   function (err, result) {
  //     if (err) {
  //       res.send(err);
  //     } else {
  //       console.log("res", result);
  //       res.send(result);
  //     }
  //   }
  // );

})


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


routes.post("/token",async (req,res) => {
  // // refresh the damn token
  // const postData = await req.body
  // console.log(req.body);
  // // if refresh token exists
  // if(postData.ref_token ) {
  //     const user = await {
  //         "email": postData.email,
  //         "userType": postData.userType
  //     }
  //     const token = await jwt.sign(user, "Registration", { expiresIn: "10m"})
  //     const response = await {
  //         "token": token,
  //     }
  //     // update the token in the list
  //     //tokenList[postData.refreshToken].token = token
  //     res.status(200).json(response);        
  // } else {
  //     res.status(404).send('Invalid request')
  // }
  console.log("Inside the node");
  const refreshToken = req.body.refreshToken;
  const mail=req.body.mail;
  const role=req.body.role;
  if (!refreshToken) {
    return res.json("User not found");
  }
  const token = await jwt.sign(refreshToken, "Registration");
  console.log("token", token);
  console.log("InsideRefreshPart");
  if (token) {
    const accessToken = tokenGenerator(mail,role);
    return res.json({ accessToken });
  }
},




)

module.exports = routes;