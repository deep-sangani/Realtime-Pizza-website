const order = require('../../../models/order')
const Order = require('../../../models/order')

function statusController(){
 return   {
update(req,res){
    order.updateOne({_id:req.body.orderId},{status:req.body.status},(err,data)=>{
        if(err){
          return  res.redirect('/admin/orders')
        }
       return res.redirect('/admin/orders')
    })

}
    }
}

module.exports = statusController