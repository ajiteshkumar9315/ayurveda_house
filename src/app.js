const express = require("express");
const app = express(); //  this app has all the content of express
const path = require("path");  //this is used for connecting the path in sort.
const hbs = require("hbs"); // this is used for the template engine.
require("./db/connection");
const Register = require("./model/register");
const bcrypt=require("bcrypt");

const port = process.env.PORT || 3000;  // this is used for the connecting and showing the port all over the place

//this is used for connecting static files ex- html .
const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());  //if we use postman 
app.use(express.urlencoded({extended:false}));
app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.get("/",(req,res)=>{
    res.render("index")
});

//to access the pages
app.get("/register",(req,res)=>{
    res.render("register");
});
app.get("/login",(req,res)=>{
    res.render("login");
});
app.get("/payment",(req,res)=>{
    res.render("payment");
});

app.get("/",(req,res) => {
    res.send("hello from the jack sparrow");
});

app.post("/register", async (req,res)=>{
   try{
    //  console.log(req.body.phone);
    //  res.send(req.body.phone);
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;


    if(password == cpassword){
        const customerIde = new Register({
            firstname : req.body.firstname,
            lastname: req.body.lastname,
            zipcode: req.body.zipcode,
            gender: req.body.gender,
            phone: req.body.phone,
            state: req.body.state,
            city: req.body.city,
            email: req.body.email,
            password: password,
            confirmpassword: cpassword
        })

        console.log("the success part is" + customerIde);
        const token = await customerIde.generateAuthToken();
        console.log("the token part is" + token);

        const register = await customerIde.save();
        console.log("the token part is" + token);
        res.status(201).render("index");
    }
    else{
        res.send("password are not matching")
    }
   }
   catch(error){
    res.status(400).send(error.message);
   }
});


//login check
app.post('/login',async(req,res)=>{
    try {
        const email=req.body.email;
        const password=req.body.password;

        //this is use to read the data of register
        const useremail=await Register.findOne({email:email});
        // res.send(useremail);
        // console.log(useremail);
        const ismatch= await bcrypt.compare(password, useremail.password);

        const token = await useremail.generateAuthToken();  //in this we change the instance because customerId is nor present .
        console.log("the token part is" + token);

        //if(useremail.password===password){
        if(ismatch){    
            res.status(201).render("index");
        }
        else{
            res.send("Email/Password are not matching");
        }
        
    } catch (error) {
     res.status(400).send("invalid email");   
    }
});

app.listen(port, ()=>{
    console.log(`server is running at port no ${port}`);
})