const bcrypt = require ('bcryptjs');
const User = require ('../models/User');
const generateToken= require('../utils/generateToken');

exports.register = async(req,res,next)=>{
    try{
        const {username,email,password} = req.body;
        if(!username||!email||!password) return res.status(400).json({message:'Missing fields'});

        const exists = await User.findOne({email});
        if(exists) return res.status(409).json({message:'Email already used'});

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password,salt);

        const user= await User.create({ username,email,password:hash});
        return res.status(201).json({
            id:user._id,
            username:user.username,
            email: user.email,
            token:generateToken({id:user._id})
        });

    }catch(err){
        next(err);
    }
};

exports.login = async(req,res,next)=>{
    try{
        const {email,password}= req.body;
        if(!email||!password) return res.status(400).json({message:'Missing fields'});

        const user = await User.findOne({email});
        if(!user) return res.status(401).json({message:'Invalid Credentials'});

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(401).json({message:'Invalid Credentials'});
        
        return res.json({
            id:user._id,
            username:user.username,
            email:user.email,
            token:generateToken({ id:user._id})
        });

    }catch(err){
        next(err);
    }
};