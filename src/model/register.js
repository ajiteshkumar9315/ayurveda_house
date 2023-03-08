const mongoose = require('mongoose');
const bcrypt=require('bcrypt');
const jwt= require('jsonwebtoken');


const CustomerId = new mongoose.Schema({
    firstname : {
        type:String,
        required:true
    },
    lastname : {
        type:String,
        required:true
    },
    gender : {
        type:String,
        required:true
    },
    phone : {
        type:Number,
        required:true,
        // unique:true
    },
    zipcode : {
        type:Number,
        required:true
    },
    email : {
        type:String,
        required:true,
        unique:true
    },
    password : {
        type:String,
        required:true
    },
    confirmpassword : {
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
        required:true
        }
    }]

});

// generate tokens
CustomerId.methods.generateAuthToken = async function(){
    try {
        console.log(this._id);
        const token = jwt.sign({_id:this._id}, "mynameisajiteshkumarcomputersciencestudent");
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        return token;
    } catch (error) {
        resizeBy.send(`the error part is ${error.message}`);
    }
}

// converting passwoed into hash
CustomerId.pre("save",async function(next) {

    if(this.isModified("password")){  // this is used when you modified th password then this is call utherwise in case of modifing the name  it simply skip this part.
   // console.log(`the password is ${this.password}`);
    this.password= await bcrypt.hash(this.password,10);
   // console.log(`this is the hash password ${this.password}`);

    this.confirmpassword=await bcrypt.hash(this.confirmpassword,10);
    }
    next();  // next is used if the password is hash then they assine new task. eg-after taking the users detail,then changes to hash and then save to db.
})

//Register in model is always singular it show error on plular

const Register = new mongoose.model ("Register",CustomerId); 
module.exports= Register;

