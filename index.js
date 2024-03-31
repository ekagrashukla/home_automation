const express = require('express')
const hbs = require('hbs');
const path = require("path");
const cookieParser = require("cookie-parser");

const urlRoute = require('./routes/url.route')
const morgan = require('morgan')
//require('./db/conn')

const app = express()



const static_path = (path.join(__dirname, "./public"));
const template_path = (path.join(__dirname, "./templates/views"));

app.use(express.static(static_path));
app.set("view engine", "hbs");
hbs.registerHelper('splitUrl', function(url) {
    const slicedurl = url.slice(0,50)
    if (slicedurl.length<url.length){
        return slicedurl+" ......"
    }
    else{
        return slicedurl
    }
})
app.set("views", template_path);
app.use(cookieParser());

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use('/', urlRoute)

const PORT = process.env.PORT || 3000;

app.listen(3000, ()=> console.log(`Server Running on port ${PORT}`))