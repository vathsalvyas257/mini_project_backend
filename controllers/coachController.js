const User = require("../models/userModel");

// Coach assigns a user as Organiser
exports.assignOrganiserByEmail= async (req, res) => {
 try{
    const{email}=req.body;
    //find user by email

    const user=await User.findOne({email});
    if(!user) return res.status(404).json({message:"user not found"});

    //update role to organiser
    user.role="organizer";
    await user.save();

    res.status(201).json({message:`user with email ${email} assigned as organizer`});
 }catch(error){
    res.status(500).json({message:"server errror",error})
 }
};
