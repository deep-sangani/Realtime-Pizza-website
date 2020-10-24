const Order = require('../../../models/order')
const moment = require('moment')

function ordercontroller(){
return {
    store:(req,res)=>{
         const {phoneno,address} = req.body
         if(!phoneno || !address){
             req.flash('error','All Fields are required')
             res.redirect('/cart')
         }


         const order = new Order({
             customerId:req.user._id,
             items:req.session.cart.items,
             phoneno:phoneno,
             address:address,
         })

         order.save().then(result=>{
           
           req.flash('success','Order placed successfully')
           delete req.session.cart
           res.redirect('/customer/orders')

         }).catch(err=>{
             req.flash('error','Something Went Wrong ')
             return res.redirect('/cart')
         })
    },

    index:async(req,res)=>{
         const orders = await Order.find({customerId:req.user._id},
            null,
            {sort:{'createdAt':-1}})
            res.header('Cache-Control','no-cache,private,no-store,must-revalidate,max-state=0,post-check=0,pre-check=0')
       res.render('customers/orders',{orders:orders,moment:moment})
    }
}
}

module.exports = ordercontroller