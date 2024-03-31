const express = require('express')
const router = express.Router()
const UrlController = require('../controllers/url.controller')
const AuthController = require('../controllers/auth.controller')
//const {authenticate, isPublic} = require('../middleware/authenticate')
const fetch = require('node-fetch')

router.get('/',async (req,res)=> {
    try {
        const apiUrl = 'https://myxenius.com/Prepaid_data_daily_logHelper/get_monthly_chart_data/658802020111';
        const response = await fetch(apiUrl);
        const data = await response.json();
        const len = data['grid'].length;
        const grid_reading = data['grid'];
        const todays_reading = grid_reading[len-1];
        res.render("index", {data: todays_reading*7.681})
        //res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
router.get('/register', (req,res)=> {
    res.render("signup")
})
router.get('/login', (req,res)=>{
    res.render("login")
})
router.get('/data/api', async (req, res) => {
    try {
        const apiUrl = 'https://myxenius.com/Prepaid_data_daily_logHelper/get_monthly_chart_data/658802020111';
        const response = await fetch(apiUrl);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
//router.get('/logout',authenticate, AuthController.logout)
router.post('/publicshort',UrlController.shorturl)
router.get('/short',(req,res)=> res.render("index"))
//router.post('/short', authenticate, UrlController.shorturl)
//router.get('/:shortid', isPublic, UrlController.unshorturl)
router.post('/login', AuthController.login)
router.post('/register', AuthController.register)


module.exports = router
