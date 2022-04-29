const exp = require('express')

const mongoose=require("mongoose")

const dotenv = require("dotenv");
dotenv.config();

const cookieParser = require("cookie-parser");


mongoose.connect(process.env.DB_URL,()=>{console.log("DB Connected")})

const app = exp()

const authRoutes=require("./routes/authRoutes")
const adminRoutes = require("./routes/adminRoutes")

app.use(cookieParser());
app.use(exp.json());
app.use("/api/user",authRoutes);
app.use("/admin",adminRoutes);








// app.get('/', (req, res) => {
//   res.send('Home Page')
// })

// app.get('/users',auth, (req, res) => {
//   res.send('Users Page')
// })


// function auth(req, res, next) {
//     if (req.query.admin === 'true') {
//       next()
//     } else {
//       res.send('ERROR: You must be an admin')
//     }
//   }



app.listen(3000, () => console.log('Server Started'))