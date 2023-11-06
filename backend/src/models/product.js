"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
const { mongoose } = require('../configs/dbConnection')
/* ------------------------------------------------------- *
{
    "category_id": "65343222b67e9681f937f203",
    "brand_id": "65343222b67e9681f937f107",
    "name": "Product 1"
}
/* ------------------------------------------------------- */
// Product Model:

const ProductSchema = new mongoose.Schema({

   category_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Category',
    required:true
   },

   brand_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Brand',
    required:true
   },

   name:{
    type:String,
    trim:true,
    required:true,
   },

//    quantity:{
//     type:Number,
//     default: 0
//    },

    stock:{ //instead of quantity
      type:Number,
      default: 0
    }

}, { collection: 'products', timestamps: true})

/* ------------------------------------------------------- */
// FOR REACT PROJECT:
ProductSchema.pre('init', function (data) {
    data.id = data._id
    data.createds = data.createdAt.toLocaleDateString('ie-ie')
})
/* ------------------------------------------------------- */
module.exports = mongoose.model('Product', ProductSchema)