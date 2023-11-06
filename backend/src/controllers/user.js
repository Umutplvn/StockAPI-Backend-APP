"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */

const User = require('../models/user')
const Token = require('../models/token')
const passwordEncrypt = require('../helpers/passwordEncrypt')

module.exports = {

    list: async(req, res)=>{
         /*
            #swagger.tags = ["Users"]
            #swagger.summary = "List Users"
            #swagger.description = `
                You can send query with endpoint for search[], sort[], page and limit.
                <ul> Examples:
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                    <li>URL/?<b>page=2&limit=1</b></li>
                </ul>
            `
        */
        
 const filters = (req.user?.is_superadmin) ? {} : { _id: req.user._id } // To let staff to see only its own recordings and data unless its superadmin

        const data = await res.getModelList(User, filters)

        // res.status(200).send({
        //     error:false,
        //     details: await res.getModelList(User),
        //     data
        // })

        //As it was asked us to send the data directly unlike mentioned above
        res.status(200).send(data)

    },

    create: async(req, res)=>{
        /*
        #swagger.tags = ["Users"]
        #swagger.summary = "Create User"
        #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
        "username": "test",
       "password": "1234",
        "email": "test@site.com",
        "first_name": "test",
        "last_name": "test",
        }
        }
        */

       // Disallow setting admin/staff:
       req.body.is_staff = false
       req.body.is_superadmin = false

       const data = await User.create(req.body)

       // Create token for auto-login: Kullanici olusturulunca login sayfasina yonlendirmesin ve login oldugunu anlasin diye
       const tokenData = await Token.create({
           user_id: data._id,
           token: passwordEncrypt(data._id + Date.now())
       })
          // res.status(201).send({
        //     error: false,
        //     token: tokenData.token,
        //     data
        // })

        // FOR REACT PROJECT:
        res.status(201).send({
            error: false,
            token: tokenData.token,
            ...data._doc    // To reach any data in "data" 
        })
    },

    read: async(req, res)=>{
         /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Get Single User"
        */
        const filters = (req.user?.is_superadmin) ? {_id:req.params.id} : { _id: req.user._id } // If you are not superadmin you can only see your own recordings if you try to see another one's data
        const data = await User.findOne( {_id:req.params.id})

        res.status(200).send({
            error:false,
            data
        })
    },

    update: async(req, res)=>{

        /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Update User"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "username": "test",
                    "password": "1234",
                    "email": "test@site.com",
                    "first_name": "test",
                    "last_name": "test",
                }
            }
        */
        const filters = (req.user?.is_superadmin) ? {_id:req.params.id} : { _id: req.user._id } 
            
        req.body.is_superadmin = (req.user?.is_superadmin) ? req.body.is_superadmin : false

        const data = await User.updateOne(filters, req.body, { runValidators: true })  // If there is a validate function in our model and we want to use it while updating, we have to add it.

        res.status(202).send({
            error:false,
            data,
            new: await User.findOne({_id:req.params.id})
        })
    },

    delete: async(req, res)=>{

        /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Delete User"
        */
        const filters = (req.user?.is_superadmin) ? {_id:req.params.id} : { _id: req.user._id }     
        
        const data = await User.deleteOne(filters)

        res.status(data.deletedCount ? 204 : 404).send({
            error: !data.deletedCount,
            data
        })
        
    },
}