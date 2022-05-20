const jwt = require("jsonwebtoken");

const tokenGenerator = (email,userType)=>{
    const token = jwt.sign({email,userType}, process.env.JWT_KEY, {expiresIn:"15m"})
    return token;
}

const refreshtokenGenerator = (email,userType)=>{
    const ref_token = jwt.sign({email,userType}, process.env.REF_JWT_KEY, {expiresIn:"3d"})
    return ref_token;
}

const tokenValidator = (token)=>{
    try {
        const data = jwt.verify(token,process.env.JWT_KEY);
        return data;
    } catch (error) {
        return false;
    }
}

const ReftokenValidator = async (token,secret)=>{
    try {
        const data = jwt.verify(token,secret);
        return data;
      } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
          console.log("Token expire");
          return false;
        }
        // console.log("error secret", err);
      }
    
}

module.exports.tokenGenerator=tokenGenerator;
module.exports.refreshtokenGenerator=refreshtokenGenerator;
module.exports.tokenValidator=tokenValidator;
module.exports.ReftokenValidator=ReftokenValidator;