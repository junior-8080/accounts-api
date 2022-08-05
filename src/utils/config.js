require("dotenv").config({path:'/home/abdul/backend/apis/node/authentication/.env'})

module.exports = {
    appPort : process.env.APP_PORT,
    mongodbName: process.env.MONGO_DB_NAME,
    mongodbURL: process.env.MONGO_DB_URL,
    webBaseUrl : process.env.AUTH_WEB_BASE_URL,
    jwtToken: process.evn.JWT_SECRET
    
}