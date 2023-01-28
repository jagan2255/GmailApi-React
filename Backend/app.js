const express = require('express');
const app = express();
const cors=require("cors");
const mongoose= require('mongoose');


const PORT = process.env.PORT || 3001;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


//DataBase connection
mongoose
  .connect("YOUR-DATABASE-URL" ,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  });


//Routes
const userRoute = require("./src/routes/user")
app.use("/user" , userRoute)


app.get('/' , async(req,res)=>{
    res.send(`Server Running on ${PORT}`);
})  
 


app.listen(PORT , ()=>{
    console.log(`Server Running on ${PORT}`)
})