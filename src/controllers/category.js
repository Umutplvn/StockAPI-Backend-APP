"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */

const Category = require('../models/category')

module.exports = {

    list: async(req, res)=>{
         /*
            #swagger.tags = ["Categories"]
            #swagger.summary = "List Categories"
            #swagger.description = `
                You can send query with endpoint for search[], sort[], page and limit.
                <ul> Examples:
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                    <li>URL/?<b>page=2&limit=1</b></li>
                </ul>
            `
        */
    
        const data = await res.getModelList(Category)

        // res.status(200).send({
        //     error:false,
        //     details: await res.getModelList(Category),
        //     data
        // })

        //As it was asked us to send the data directly unlike mentioned above
        res.status(200).send(data)

    },

    create: async(req, res)=>{
       /*
            #swagger.tags = ["Categories"]
            #swagger.summary = "Create Category"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: { $ref: '#/definitions/Category' }
            }
        */

        const data = await Category.create(req.body)

            res.status(201).send({
                error: false,
                data
            })
        },

    read: async(req, res)=>{
         /*
            #swagger.tags = ["Categories"]
            #swagger.summary = "Get Single Category"
        */

        const data = await Category.findOne( {_id:req.params.id})

        res.status(200).send({
            error:false,
            data
        })
    },

    update: async(req, res)=>{

        /*
            #swagger.tags = ["Categories"]
            #swagger.summary = "Update Category"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: { $ref: '#/definitions/Category' }
            }
        */


        const data = await Category.updateOne({_id:req.param.id}, req.body, { runValidators: true })  // If there is a validate function in our model and we want to use it while updating, we have to add it.

        res.status(202).send({
            error:false,
            data,
            new: await Category.findOne({_id:req.params.id})
        })
    },

    delete: async(req, res)=>{

        /*
            #swagger.tags = ["Categories"]
            #swagger.summary = "Delete Category"
        */

        const data = await Category.deleteOne({_id:req.params.id})

        res.status(data.deletedCount ? 204 : 404).send({
            error: !data.deletedCount,
            data
        })
        
    },
}