import axios from 'axios'
import Noty from 'noty'
import {initAdmin} from './admin'





let addTocart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')

function updatecart(pizza){
axios.post('/updatecart',pizza).then((res)=>{

 cartCounter.innerText = res.data.totalQty

 new Noty({
     type:'success',
     timeout:1000,
     text:'Item added to cart',
     progressBar:false

 }).show()
}).catch(()=>{
    new Noty({
        type:'error',
        timeout:1000,
        text:'something went wrong',
        progressBar:false
   
    }).show()
})
}


addTocart.forEach((btn)=>{
btn.addEventListener('click',(e)=>{
   
    let pizza = JSON.parse(btn.dataset.pizza)
    updatecart(pizza)
    console.log(pizza)

})
})

//remove alert message after x seconds

const alertMsg = document.querySelector('#success-alert')
if(alertMsg){
    setTimeout(() => {
        alertMsg.remove()
    }, 2000);
}

initAdmin()



