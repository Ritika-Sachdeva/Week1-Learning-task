const Note= require('../models/Note');

exports.createNote = async (req,res,next)=>{
    try{
        const {title,content}=req.body;
        if(!title) return res.status(400).json({message:'Title required'});

        const note =await Note.create({user:req.user._id,title,content});
        return res.status(201).json(note);

    }catch(err){
        next(err);
    }
};

exports.getNotes= async (req,res,next)=>{
    try{
        const notes= await Note.find({user:req.user._id}).sort({createdAt:-1});
        return res.json(notes);
    }catch(err){
        next(err);
    }
};

exports.updateNote= async (req,res,next)=>{
    try{
        const {id} =req.params;
        const note= await Note.findOne({_id:id,user:req.user._id});
        if(!note) return res.status(404).json({message:'Note not found'});

        note.title=req.body.title ?? note.title;
        note.content= req.body.content ?? note.content;
        await note.save();
        return res.json(note);
    }catch(err){
        next(err);
    }
};

exports.deleteNote = async (req,res,next)=>{
    try{
        const {id} =req.params;
        const note= await Note.findOneAndDelete({_id:id,user:req.user._id});
        if(!note) return res.status(404).json({message:'Note not found'});
        return res.json({success:true});
    }catch(err){
        next(err);
    }
};