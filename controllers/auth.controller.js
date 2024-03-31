const mongoose = require('mongoose');
const User = require('../models/user.model');
const shortUrl = require('../models/url.model')
const jwt = require('jsonwebtoken')

const register = async (req,res) => {
    try{
        let user = new User ({
            email: req.body.email,
            password: req.body.password,
            username: req.body.username
        })
        await user.save()
        res.json({
            message: "User added successfully"
        })
    }
    catch(error){
        res.json({
            message: error
        })
    }
}

const login = async (req,res) => {
    const email = req.body.email
    User.findOne({email:req.body.email})
    .then(async user => {
        if(user){
            if (req.body.password === user.password){
                let token = jwt.sign({email:user.email}, 'verysecrettoken', {expiresIn: '10d'})
                res.cookie("jwt",token, {
                    expires: new Date(Date.now()+300000),
                    httpOnly:true
                })
                console.log(user._id)
                const urldata = await shortUrl.find({user:user._id},{_id:0,user:0,updatedAt:0,__v:0})
                const userinfo = await User.findById({_id:user._id})
                res.render("user",{ uname:  user.username , udata : urldata, userinfo : userinfo})
            }
            else{
                res.json({
                    message:"Pasword does not match"
                })
            }
    }
        else{
            res.json({
                mesage:"No user found"
            })
        }
    })
}

const logout = (req,res) => {
    try {
        console.log("inside logout")
        res.clearCookie("jwt");
        console.log("logout successfully")
        res.redirect("/")
    } catch (error) {
        res.status(500).send(error) 
    }   
}

module.exports = {register, login, logout}