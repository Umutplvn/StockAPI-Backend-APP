"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
const { mongoose } = require('../configs/dbConnection')
/* ------------------------------------------------------- */

const BrandSchema = new mongoose.Schema({

    name:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },

    image:{ //URL
        type:String,
        trim:true,
    }

},{collection:"brands", timestamps:true})


/* ------------------------------------------------------- */

// As it was already asked in our React Project

BrandSchema.pre('init', function(data){  // 'init' => to send some additional data before the main data send to UI
    //The user asked us for two additional information called "id" and "createds", we already have these, but since we needed to change their names, we set it this way and sent it via pre('init'...).
    // We cant put id directly to our model as mongo get it as a field not specificly id
    // init command doesnt waste storage room in db
        data.id = data._id,     
        data.createds=data.createdAt.toLocaleDateString('ie-ie')
    })
    
    /* ------------------------------------------------------- */
    module.exports = mongoose.model('Brand', BrandSchema)