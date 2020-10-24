const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcrypt')

function init(passport){
passport.use(new LocalStrategy({usernameField:'email'},async(email,password,done)=>{
    
  const user = await User.findOne({email:email})

  if(!user){
    return done(null,false,{message:"user is not exist"})
  }

  bcrypt.compare(password,user.password).then((match)=>{
       if(match){
        return done(null,user,{message:"logged in successfully"})
       }
       return done(null,false,{message:"wrong password"})


   }).catch((err)=>{
       throw err

    return done(null,false,{message:"something went wrong"})

   })

}))

passport.serializeUser((user,done)=>{
   done(null,user._id)
})


passport.deserializeUser((id,done)=>{
    User.findById(id,(err,user)=>{
            done(err,user)
    })
})
}

module.exports = init