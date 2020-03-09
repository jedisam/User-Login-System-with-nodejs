var express = require('express');
var router = express.Router();
var multer = require('multer');
const upload = multer({dest:'./uploads'})
const passport = require('passport')

const LocalStrategy = require('passport-local').Strategy
const Users = require('../models/users')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//users/register

router.get('/register', function(req, res, next) {
  res.render('register',{title:'Register'});
});

router.get('/login', function(req, res, next) {
  res.render('login',{title:'Login'});
});

router.post('/login',passport.authenticate('local',{failureRedirect:'/users/login',failureFlash:'Invalid UserName or Password'}),function(req,res){
  console.log("Logged Message")
 req.flash('success','You are now logged in')
 res.redirect('/')
})

passport.serializeUser((user,done)=>{
  done(null,user.id)
})

passport.deserializeUser((id,done)=>{
  Users.getUserById(id,(err,user)=>{
    done(err,user)
  })
})

passport.use(new LocalStrategy(function(username,password,done){
  Users.getUserByUsername(username,(err,user)=>{  
    if(err) throw err
    if(!user){
      return done(null, false,{message:'Unkown User'})
    }

    Users.comparePassword(password,user.password,(err,isMatch)=>{
      if(err) return done(err)
      if(isMatch){
        return done(null,user)
      }else{
        return done(null,false,{message:'Invalid Password'})
      }
    })
  })
}))

router.post('/register',upload.single('profileimage') ,function(req, res, next) {
   const name= req.body.name
   const email= req.body.email
   const username= req.body.username
   const profileimage= req.body.profileimage
   const password= req.body.password
   const password2= req.body.password2

  // const fileext = req.file.mimetype
  // const filesize = req.file.size
  if(req.file){
    console.log('Uploading File')
    const profileimage = req.file.filenmae
  }else{
    console.log('No File Uploaded')
    const profileimage='noimage.jpg'
  }

  // Form Validation
   req.checkBody('name','Name Field is required').notEmpty()
   req.checkBody('email','Email Field is required').notEmpty()
   req.checkBody('email','Email is not Valid').isEmail()
   req.checkBody('username','UserName Field is required').notEmpty()
   req.checkBody('password','Password Field is required').notEmpty()
   req.checkBody('password2','passwords do not match').equals(req.body.password)
   // Check Errors
   const errors = req.validationErrors();

   if(errors){  
      res.render('register',{
        errors:errors
      })
   }else{
     const newUser = new Users({
       name:name,
       email:email,
       username:username,
       password:password,
       profileimage:profileimage
     })

     Users.createUser(newUser,(err,user)=>{
       if(err) throw err
       console.log(user)

     })

     req.flash('success','You are now Registered and can now login')

     res.location('/')
     res.redirect('/')
   }  



});

router.get('/logout',(req,res)=>{
  req.logout()
  req.flash('success','You are now logged out')
  res.redirect('/users/login')
})


module.exports = router;
