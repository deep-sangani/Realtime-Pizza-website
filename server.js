require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const path = require('path')
const session = require('express-session')
const flash = require('express-flash')
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const MongodbStore = require('connect-mongo')(session)
const passport = require('passport')

const PORT = process.env.PORT || 3000


//use json file for responce
app.use(express.json())
app.use(express.urlencoded({extended:false}))


// declare layout
app.use(expressLayout)
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')



// connect to mongodb
const url = 'mongodb://localhost/pizza'
mongoose.connect(url,
    {useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:true,
    useUnifiedTopology:true})



  
    const connection = mongoose.connection

    connection.once('open',()=>{
        console.log("database connected")
    }).catch(err => {
    console.log("database err")
    })



// session start in mongodb
let mongoStore = new MongodbStore({
    mongooseConnection: connection,
    collection:"sessions"
}
)

// create session
app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave:false,
    saveUninitialized:false,
    store:mongoStore,
    cookie:{maxAge:1000*60*60*24}
   
}))



const passportconfig = require('./app/config/passport')
passportconfig(passport)
app.use(passport.initialize())
app.use(passport.session())
// create local session
app.use((req,res,next)=>{

    res.locals.session = req.session
    res.locals.user = req.user
    
    
    next();
 })
 


app.use(flash())

//create static path
app.use(express.static('public'))


// call function
require('./routes/web')(app)


app.listen(PORT,()=>{
    console.log(`server is running on port no ${PORT}`)
})