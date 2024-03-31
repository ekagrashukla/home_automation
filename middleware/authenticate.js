const jwt = require('jsonwebtoken')
const ShortUrl = require('../models/url.model')
const User = require('../models/user.model')
const cookieParser = require("cookie-parser");

const authenticate = async (req,res,next) => {
    try {
        console.log(req.cookies)
        const token = req.cookies.jwt
        const decode = jwt.verify(token,'verysecrettoken')
        // res.locals.email = decode.email
        // console.log(decode.email)
        // res.locals.email = decode.email
        next()
    } catch (error) {
        if(error.name == "TokenExpiredError") {
            res.status(401).json({
                message: "Token Expired"
            })
        }
        else {
            res.json({
                message: "Authentication failed "+error
            })
        }
    }
}

const isPublic = async (req,res,next) => {
    try {
        const shorturl = req.params.shortid
        const data = await ShortUrl.findOne({short_url:shorturl})
        if(!data){
            res.render('fourzerofour')
        }
        else{
            const ispublic = data.public
            if(ispublic === true){
                next()
            }
            else{
                try {
                    const token = req.cookies.jwt
                    const decode = jwt.verify(token,'verysecrettoken')
                    const currentUser = await User.findOne({email:decode.email})
                    console.log(currentUser.id)
                    console.log(data.user.toString())
                    if(data.user.toString() == currentUser.id) {
                        next()
                    }
                    else{
                        res.send("not authorized")
                    }
                    
                } catch (error) {
                    if(error.name == "TokenExpiredError") {
                        res.status(401).json({
                            message: "Token Expired"
                        })
                    }
                    else {
                        res.json({
                            message: "Authentication failed "+error
                        })
                    }
                }
            }
        }
        
    } catch (error) {
        res.send(error)
    }
}

module.exports = {authenticate, isPublic}