const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')


mongoose.connect('mongodb://localhost/Authentication',{ useNewUrlParser: true })
const db = mongoose.connection

const UserSchema = mongoose.Schema({
    username:{
        type:String,
        index:true
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    name:{
        type:String
    },
    profileimage:{
        type:String
    }
})

const User = module.exports = mongoose.model('user',UserSchema)

module.exports.getUserById = (id,callback)=>{
    User.findById(id,callback)
}

module.exports.getUserByUsername = (username,callback)=>{
    const query = {username:username}
    User.findOne(query,callback)
}


module.exports.comparePassword = (candidatePassword,hash,callback)=>{
    bcrypt.compare(candidatePassword,hash,(err,isMatch)=>{
        callback(null,isMatch)
    })
}



module.exports.createUser = (newUser,callback)=>{

    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(newUser.password,salt,(err,hash)=>{
            newUser.password = hash
            newUser.save(callback)
        })
    })



   
}