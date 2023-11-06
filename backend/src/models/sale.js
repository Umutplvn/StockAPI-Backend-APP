"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
const { mongoose } = require('../configs/dbConnection')
/* ------------------------------------------------------- *
{
    "brand_id": "65343222b67e9681f937f123",
    "product_id": "65343222b67e9681f937f422",
    "quantity": 1000,
    "price": 20
}
/* ------------------------------------------------------- */
// Sale Model:

const SaleSchema = new mongoose.Schema({

   user_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
   },

   brand_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Brand',
    required:true
   },

   product_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Product',
    required:true
   },

   quantity:{
    type:Number,
    default: 0
   },

    price:{
      type:Number,
      default: 0
    },

    price_total:{
        type: Number,
        default: function(){ return this.quantity * this.price }, // for CREATE
        transform: function(){ return this.quantity * this.price } // for UPDATE
        // set: function(){ return this.quantity * this.price } // to not allow to get a price_total from req.body
    }

}, { collection: 'sales', timestamps: true})

/* ------------------------------------------------------- */
// FOR REACT PROJECT:
SaleSchema.pre('init', function (data) {
    data.id = data._id
    data.createds = data.createdAt.toLocaleDateString('ie-ie')
})
/* ------------------------------------------------------- */
module.exports = mongoose.model('Sale', SaleSchema)