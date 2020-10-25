const order = require('../../../models/order')
const Order = require('../../../models/order')

function statusController(){
 return   {
update(req,res){
    order.updateOne({_id:req.body.orderId},{status:req.body.status},(err,data)=>{
        if(err){
          return  res.redirect('/admin/orders')
        }
        //event emitter
      const eventEmitter = req.app.get('eventEmitter')
      eventEmitter.emit('orderupdated',{id:req.body.orderId,status:req.body.status})
       return res.redirect('/admin/orders')
    })

}
    }
}

module.exports = statusController