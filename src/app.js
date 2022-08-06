require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const  {appPort, webBaseUrl, jwtTokenSecret} = require('./utils/config');
const accounts = require("./accounts/route");
const {dbInit}  = require('./utils/dbConnections');
const session = require('express-session');
const passport = require('passport')
require('./utils/auth');
const cookieParser = require('cookie-parser');
const cors = require('cors')

app.use(cors({
    origin:webBaseUrl, 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}))

dbInit();
app.use(session({
    secret: jwtTokenSecret,
    resave: false ,
    saveUninitialized: true ,
}))

app.use(cookieParser())
app.use(passport.initialize()) // init passport on every route call
app.use(passport.session())    //allow passport to use express-sessions

app.use(bodyParser.json());
app.use('/v1/auth',accounts);
app.listen(appPort,() => console.log(`api started on port ${appPort}`))
