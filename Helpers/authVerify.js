const{tokenValidator} = require('./token');
const jwt = require('jsonwebtoken');

module.exports = async function(req,res,next){

    if(!req.headers.authorization){
        return res.status(401).send('Unauthorized request')
    }

    let token = req.headers.authorization.split(' ')[1]
    if(token === 'null'){
        return res.status(401).send('Unauthorized request')
    }
    try {
        let payload = jwt.verify(token, 'courseRegistration')
        if(!payload){
            return res.status(401).send('Unauthorized request')
        }
        req.userId = payload.subject
        next()
    } catch (error) {
        console.log(error+"error");
        res.status(401).send('Unauthorized request')
    }
    
    





    // try {
    //     const {jwt} = req.cookies;
    // const valid = await tokenValidator(jwt);
    // if(valid){
    //     next();
    // }
    // else{
    //     res.send("Access Denied");
    // }
        
    // } catch (error) {
    //     console.log(error);
    // }
    
}