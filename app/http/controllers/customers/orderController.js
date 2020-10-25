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
           Order.populate(result,{path:'customerId'},(err,placedorder)=>{
            req.flash('success','Order placed successfully')
            delete req.session.cart
            // emmit
            const eventEmitter = req.app.get('eventEmitter')
            eventEmitter.emit('orderPlaced',placedorder)
            res.redirect('/customer/orders')
           })
          

         }).catch(err=>{
             req.flash('error','Something Went Wrong ')
             return res.redirect('/cart')
         })
    },

    index:async(req,res)=>{
         try {
            const orders = await Order.find({customerId:req.user._id},
                null,
                {sort:{'createdAt':-1}})
                res.header('Cache-Control','no-cache,private,no-store,must-revalidate,max-state=0,post-check=0,pre-check=0')
           res.render('customers/orders',{orders:orders,moment:moment})
         } catch (error) {
             console.log(error)
         }
    },
    show:async(req,res)=>{
        const order = await Order.findById(req.params.id)
  console.log(order.customerId)
        if((req.user._id).toString() === (order.customerId).toString()){
        return  res.render('customers/singleOrder',{order})
        }
        return res.redirect('/')
      }
}
}

module.exports = ordercontroller