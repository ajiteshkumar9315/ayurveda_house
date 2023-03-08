const mongoose = require('mongoose');
//import mongoose from 'mongoose';

 mongoose.set('strictQuery', true);

mongoose.connect("mongodb://localhost:27017/Regestration").then(()=>{
    console.log(`connecting successfully`);
}).catch((e)=>{
    console.log(`no connection`);
})
