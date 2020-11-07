const Order = require('../../../models/order')
const moment = require('moment')
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

function ordercontroller(){
return {
    store:(req,res)=>{
         const {phoneno,address,stripeToken,paymentType} = req.body

         if(!phoneno || !address){
            return res.status(422).json({message:'All Fields are required'})

         }


         const order = new Order({
             customerId:req.user._id,
             items:req.session.cart.items,
             phoneno:phoneno,
             address:address,
         })

         order.save().then(result=>{
           Order.populate(result,{path:'customerId'},(err,placedorder)=>{
            //req.flash('success','Order placed successfully')
        

            //Stripe payment
            if(paymentType ==='card'){
                stripe.charges.create({
                    amount:req.session.cart.totalPrice * 100,
                    source:stripeToken,
                    currency:'inr',
                    description:`Pizza Order: ${placedorder._id}`
                }).then(()=>{
                    placedorder.paymentStatus = true;
                    placedorder.paymentType = paymentType
                    placedorder.save().then((ord)=>{
                   
                        const eventEmitter = req.app.get('eventEmitter')
            eventEmitter.emit('orderPlaced',ord)
            delete req.session.cart
            return res.json({message:'Payment successful, Order placed successfully'})

                    }).catch((err)=>{
                        console.log(err)
                    })
                }).catch((err)=>{
                    delete req.session.cart
                    return res.json({message:'OrderPlaced but Payment failed, You can pay delivery time'})
                })
            }
            else{
                delete req.session.cart
            return res.json({message:'Order placed successfully'})
            }


           })
          

         }).catch(err=>{
            return res.status(500).json({message:'Something Went Wrong '})

            //  req.flash('error','Something Went Wrong ')
            //  return res.redirect('/cart')
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