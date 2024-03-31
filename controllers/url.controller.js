const ShortUrl = require('../models/url.model')
const User = require('../models/user.model')
const shortid = require('shortid')
const jwt = require('jsonwebtoken')

const shorturl = async (req,res) => {
    try {
        const {longUrl} = req.body
    
        if(!longUrl){
            res.send("Not a valid URL")
        }    
        // const urlExists = await ShortUrl.findOne({full_url:longUrl})
        // if (urlExists){
        //     res.send(`URL already existed ==> https://cuturl.vercel.app/${urlExists.short_url}`)
        // }
        else{
            try {
            const token = req.cookies.jwt
            const decode = jwt.verify(token,'verysecrettoken')
            const email = (decode.email)
            // const email = req.locals.email
            const userdata = await User.findOne({email:email})
            const userid = (userdata._id)
            const sid = shortid.generate()
            const shortUrl = new ShortUrl({full_url: longUrl, short_url: sid, user:userid})

            const result = await shortUrl.save()
            res.send("Short URL created successfully ==> https://cuturl.vercel.app/"+result.short_url)
            } catch (error) {
            const sid = shortid.generate()
            console.log(sid)
            const shortUrl = new ShortUrl({full_url: longUrl, short_url: sid})

            const result = await shortUrl.save()
            res.send("Short URL created successfully ==> https://cuturl.vercel.app/"+result.short_url)
            }
        }
    } catch (error) { 
        res.send(error)
    }
}

const unshorturl = async (req,res) => {
    try {
            const {shortid} = req.params
            const result = await ShortUrl.findOne({short_url:shortid})
            if(!result){
                res.render('fourzerofour')
            }
            else{
                ShortUrl.findOneAndUpdate(
                    {short_url:shortid},
                    { $inc: { click_count: 1 },shared_on:Date.now()},
                    {new: true}
                ).then((response)=>{
                    res.redirect(result.full_url)
                })
            }
            
            
    } catch (error) {
        res.send(error)
    }
}

module.exports = {shorturl, unshorturl}