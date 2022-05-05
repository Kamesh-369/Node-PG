// var nodemailer = require('nodemailer');

// var sender = nodemailer.createTransport({
//     service : 'gmail',
//     auth : {
//         user : 'testmail.course@gmail.com',
//         pass : 'asdfghjkl@2'
//     }
// });

// var composeEmail = {
//     from: 'testmail.course@gmail.com',
//     to:'reciever',
//     subject: 'Testing Email',
//     html:'<h1>Testing Email</h1>'
// };


// sender.sendMail(composeEmail, function(error,info){
//     if(error){
//         console.log(error);
//     }
//     else{
//         console.log("Mail sent successfully" + info.response);
//     }
// })