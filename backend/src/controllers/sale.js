"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */

const Sale = require('../models/sale')
const Product = require('../models/product')

module.exports = {

    list: async(req, res)=>{
         /*
            #swagger.tags = ["Sales"]
            #swagger.summary = "List Sales"
            #swagger.description = `
                You can send query with endpoint for search[], sort[], page and limit.
                <ul> Examples:
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                    <li>URL/?<b>page=2&limit=1</b></li>
                </ul>
            `
        */
    
        const data = await res.getModelList(Sale, {}, ['brand_id', 'product_id'] )

        // res.status(200).send({
        //     error:false,
        //     details: await res.getModelList(Sale),
        //     data
        // })

        //As it was asked us to send the data directly unlike mentioned above
        res.status(200).send(data)

    },

    create: async(req, res)=>{
       /*
            #swagger.tags = ["Sales"]
            #swagger.summary = "Create Sale"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: { $ref: '#/definitions/Sale' }
            }
        */
      
        //Auto add user_id to req.body
        req.body.user_id = req.user?.id

        //Get Stock info to check if we have enough stock
        const currentProduct=await Product.findOne({_id:req.body.product_id})
        
        if(currentProduct.stock >=req.body.quantity){

            const data = await Sale.create(req.body)
            
            //Set stock after Sale process
            const updateProduct = await Product.updateOne({ _id: data.product_id }, { $inc: { stock: -data.quantity } })

            res.status(201).send({
            error:false,
            data,
            
        })

        }else{
            throw new Error('There is no enough stock for this sale', {cause: {currentProduct}})
        }    
         // Update:
         const data = await Sale.updateOne({ _id: req.params.id }, req.body, { runValidators: true })

         res.status(202).send({
             error: false,
             data,
             new: await Sale.findOne({ _id: req.params.id })
         })  
        
    },

    read: async(req, res)=>{
         /*
            #swagger.tags = ["Sales"]
            #swagger.summary = "Get Single Sale"
        */

        const data = await Sale.findOne( {_id:req.params.id}).populate(['brand_id', 'product_id'])

        res.status(200).send({
            error:false,
            data
        })
    },

    update: async(req, res)=>{

        /*
            #swagger.tags = ["Sales"]
            #swagger.summary = "Update Sale"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: { $ref: '#/definitions/Sale' }
            }
        */

            if (req.body?.quantity) {
                // get current stock quantity from the Sale:
                const currentSale = await Sale.findOne({ _id: req.params.id })
                // different:
                const quantity = req.body.quantity - currentSale.quantity
                // console.log(quantity)
                // set stock (quantity) when Sale process:
                const updateProduct = await Product.updateOne({ _id: currentSale.product_id, stock: { $gte: quantity } }, { $inc: { stock: -quantity } }) // gte = greater than or equal
                // console.log(updateProduct)
                
                // if stock limit not enough:
                if (updateProduct.modifiedCount == 0) { // Check Limit
                    res.errorStatusCode = 422
                    throw new Error('There is not enough stock for this sale.')
                }
            }


        const data = await Sale.updateOne({_id:req.param.id}, req.body, { runValidators: true })  // If there is a validate function in our model and we want to use it while updating, we have to add it.

        res.status(202).send({
            error:false,
            data,
            new: await Sale.findOne({_id:req.params.id})
        })
    },

    delete: async (req, res) => {
        /*
            #swagger.tags = ["Sales"]
            #swagger.summary = "Delete Sale"
        */
        // Get current stock quantity 
        const currentSale = await Sale.findOne({_id:req.params.id})

        //Delete:

        const data = await Sale.deleteOne({ _id: req.params.id })
        const updateProduct=await Product.updateOne({_id:currentSale.product_id}, {$inc: {stock: +currentSale.quantity}}) // increase : "stock" field

        res.status(data.deletedCount ? 204 : 404).send({
            error: !data.deletedCount,
            data
        })
    },
}