const mysql = require("mysql");
const mongoose = require("mongoose");
const { mongodbURL, mongodbName } = require("./config");

/*
const connectInstance = mysql.createPool({
    host:"",
    user:"",
    password:""
})
//  this is the connection attached to every request  transactions.
//  context
connectInstance.getConnection((err ,connection) => {
    connection.beginTransaction(() => {
        console.log('transaction begin.....')
    })
    connection.commit(() => {
        connection.release()
    })
})


/*
    // Postgres db connection
    const pool = new Pool({
    user: 'dbuser',
    host: 'database.server.com',
    database: 'mydb',
    password: 'secretpassword',
    })
    context.
    pool.connect().then(client => {
        client.query('BEGIN').then(res => {
            // log the response to know it value.
            console.log('begining a transaction....')
        })
        // api responses commit for  success;
        client.query('COMMIT').then(res => {
            client.release()
        })
        api responses commit for  failure;
        client.query('ROLLBACK).then(res => {
            client.release()
        })
        client.release()
    })

*/
    



// Mongo db connection.
const db = mongoose.connection;
function dbInit() {
    mongoose.connect(`${mongodbURL}`,{useNewUrlParser: true,useUnifiedTopology:true})
}

db.once('open',_ => {
    console.log('[MongoBD]Database is connected:',mongodbName)
})

db.on('error',_ => {
    console.log('[MONGODB]Error connecting to Database.:',`${mongodbURL}/${mongodbName}`)
})


module.exports = {
    dbInit
};
