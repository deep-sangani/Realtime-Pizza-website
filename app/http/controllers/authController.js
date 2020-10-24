const User = require('../../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')


function authController(){
 const _getRedirectUrl = (req)=>{
   return req.user.role === 'admin' ? '/admin/orders' : '/customer/orders'
 }


    return {
        login :(req,res)=>{
         
          return  res.render('auth/login')
        },
        postlogin:(req,res,next)=>{
          const {name,email,password} = req.body
          
          //validate request
          if( ! email || !password){
            req.flash('error','All field is required')
         
            return res.redirect('/login')
          }


           passport.authenticate('local',(err,user,info)=>{
                if(err){
                  req.flash('error',info.message)
                  next(err)
                }

                if(!user){
                  req.flash('error',info.message)
                 return res.redirect('/login')
                }

                req.login(user,(err)=>{
                      if(err){
                            req.flash('error',info.message)
                            next(err)
                      }

                      return res.redirect(_getRedirectUrl(req))
                })
           })(req,res,next)
        },
        register :(req,res)=>{
         
           return res.render('auth/register')
        },
        postregister :async(req,res)=>{
         const {name,email,password} = req.body
          
          //validate request
          if(!name || ! email || !password){
            req.flash('error','All field is required')
            req.flash('username',name)
            req.flash('email',email)
            return res.redirect('/register')
          }

          User.exists({email:email},(err,user)=>{
            if(err){
              throw err
            }
            if(user){
              req.flash('error','Username is already exist')
              return res.redirect('/register')
            }
          })



           hasspass = await bcrypt.hash(password,10)
        const user =    new User({
            email:email,
            name:name,
            password: hasspass
          })
          user.save().then((doc)=>{
               res.redirect('/')
          }).catch(()=>{
            req.flash('error','something want wrong')
            req.flash('username',name)
            req.flash('email',email)
            return res.redirect('/register')
          })

          
          

          
      
         
       },

       logout:(req,res)=>{
         req.logout()
         res.redirect('/login')

       }


    }
    
    }
    
    
    module.exports = authController