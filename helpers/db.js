const mongoose = require('mongoose');

module.exports=()=>{
    mongoose.connect(process.env.DB_STRING,{useNewUrlParser:true,useCreateIndex:true});

    mongoose.connection.on('open',()=>{
        console.log('mongodb connect');
    });
    mongoose.connection.on('error',(err)=>{
        console.log(`Mongodb error : ${err}`);
    });
    mongoose.Promise=global.Promise;
}