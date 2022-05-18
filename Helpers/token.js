const jwt = require("jsonwebtoken");

const tokenGenerator = (email,userType)=>{
    const token = jwt.sign({email,userType}, process.env.JWT_KEY, {expiresIn:"10m"})
    return token;
}

const tokenValidator = (token)=>{
    try {
        const data = jwt.verify(token,process.env.JWT_KEY);
        return data;
    } catch (error) {
        return false;
    }
}

module.exports.tokenGenerator=tokenGenerator;
module.exports.tokenValidator=tokenValidator;