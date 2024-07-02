const cookieParser = require('cookie-parser');
const express=require('express');
const app=express();
const userModel= require('./models/usermodels');
const path=require('path');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken')







app.set('view engine',"ejs");
app.use(express.json());

app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser())

app.get('/',(req,res)=>{

    res.render('index')
})


app.post('/create', (req,res)=>{
     
    let{name,email,password}=req.body;

    bcrypt.genSalt(10,function(err,salt){

        bcrypt.hash(password,salt,async function(err,hash){
            
            let userCreate=await userModel.create({

                name,
                email,
                password:hash
            })
            let token=jwt.sign({email},"afjafajfa");
            res.cookie("token",token);
            res.send(userCreate);
        })
    })
 
})


app.get('/login',(req,res)=>{
    res.render('login')
})
app.post('/login',async(req,res)=>{
    let user= await userModel.findOne({email:req.body.email});

    if(!user) return res.send('something went worng');
    bcrypt.compare(req.body.password,user.password,function(err,result){
           

        let token=jwt.sign({email:req.body.email},"afjafajfa");
        res.cookie("token",token);
       if(result)
        res.send('Yes you can login')
    else
        res.send('invalid password')
    })

})

app.get('/logout',(req,res)=>{
    res.cookie("token","");
    res.redirect('/login')
})

app.get('/read',async(req,res)=>{

    let read=await userModel.find();

    res.send(read)
})



app.listen(3000);