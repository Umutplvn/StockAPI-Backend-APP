"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
const { mongoose } = require('../configs/dbConnection')
/* ------------------------------------------------------- */

const UserSchema = new mongoose.Schema({

    username:{
        type:String,
        trim:true,
        required:true,
        unique:true,
        index:true
    },

    password:{
        type:String,
        trim:true,
        required:true,
    },

    email:{
        type:String,
        trim:true,
        required:true,
        unique:true,
        index:true
    },

    first_name:{
        type:String,
        trim:true,
        required:true,
    },

    last_name:{
            type:String,
            trim:true,
            required:true,
    },

    is_active:{
        type:Boolean,
        default:true,
    },

    is_staff:{
        type:Boolean,
        default:false,
    },

    is_superadmin:{
        type:Boolean,
        default:false,
    }

},{collection:'users', timestamps:true})

/* ------------------------------------------------------- */
// Schema Configs:

//Validations for Password and Email

const passwordEncrypt = require('../helpers/passwordEncrypt')

UserSchema.pre(['save', 'updateOne'], function (next) {// It will be running the following steps prior to save or update  //https://mongoosejs.com/docs/middleware.html

    // get data from "this" when create;
    // if process is updateOne, data will receive in "this._update"
    const data = this?._update || this

    // email@domain.com
    const isEmailValidated = data.email
        ? /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email) // test from "data".
        : true

    if (isEmailValidated) {

        if (data?.password) {

            // pass == (min 1: lowerCase + upperCase + number + @$!%*?& + min 8 chars)
            const isPasswordValidated = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(data.password)

            if (isPasswordValidated) {

                this.password = data.password = passwordEncrypt(data.password)
                this._update = data // updateOne will wait data from "this._update".

            } else {

                next(new Error('Password not validated.'))
            }
        }

        next() // Allow to save.

    } else {

        next(new Error('Email not validated.'))
    }
})

/* ------------------------------------------------------- */

// As it was already asked in our React Project

UserSchema.pre('init', function(data){  // 'init' => to send some additional data before the main data send to UI
//The user asked us for two additional information called "id" and "createds", we already have these, but since we needed to change their names, we set it this way and sent it via pre('init'...).
// We cant put id directly to our model as mongo get it as a field not specificly id
// init command doesnt waste storage room in db
    data.id = data._id,     
    data.createds=data.createdAt.toLocaleDateString('ie-ie')
})

/* ------------------------------------------------------- */
module.exports = mongoose.model('User', UserSchema)