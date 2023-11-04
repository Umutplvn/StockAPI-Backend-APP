"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */

const User = require('./user')
const Token = require('./token')
const passwordEncrypt = require('../helpers/passwordEncrypt')

module.exports={

    login:async(req,res)=>{
         /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Login"
            #swagger.description = 'Login with username (or email) and password.'
            #swagger.parameters["body"] = {
                in: "body",
                required: true,
                schema: {
                    "username": "test",
                    "password": "1234",
                }
            }
        */

    const {username, email, password} = req.body

    if((username || email) && password){

        const user = await User.findOne({$or: [{username}, {email}]})

        if(user && user.password == passwordEncrypt(password)){

            if(user.is_active){
                let tokenData = await Token.findOne({user_id:user._id})
                if(!tokenData) tokenData = await Token.create({
                    user_id:user._id,
                    token: passwordEncrypt(user_id+Date.now())
                })

                res.send({
                    // token: tokenData.token,
                    //As it was requested with the name of key
                    error:false,
                    key:tokenData.token,
                    user
                })

            }else{
                res.errorStatusCode = 401
                throw new Error('This account is not active.')
            }

        }else{
            res.statusCode(401)
            throw new Error('Wrong username/email or password.')
        }

    }else{
        res.statusCode(401)
        throw new Error('Please enter your email/username and password.')
    }


    },

    logout:async(req,res)=>{
        /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Logout"
            #swagger.description = 'Delete token key.'
        */
    },


}