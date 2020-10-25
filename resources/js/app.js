import axios from 'axios'
import Noty from 'noty'
import {initAdmin} from './admin'
import moment from 'moment'




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



// rander status
let statuses = document.querySelectorAll('.status-line')
const hiddeninput = document.querySelector('#hiddeninput')
let order = hiddeninput ? hiddeninput.value : null
order = JSON.parse(order)
let time = document.createElement('small')

function updateStatus(order){
    statuses.forEach((status)=>{
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepcompleted = true
    statuses.forEach((status)=>{
        let dataprop = status.dataset.status
        if(stepcompleted){
            status.classList.add('step-completed')
        }
        if(dataprop === order.status){
            stepcompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
            if(status.nextElementSibling){
                status.nextElementSibling.classList.add('current')
            }
         
        }
    })

}

updateStatus(order)

//socket
let socket = io()

// join
if(order){
    socket.emit('join',`order_${order._id}`)
}

let adminArea = window.location.pathname
if(adminArea.includes('admin')){
    initAdmin(socket)
    socket.emit('join','adminRoom')
}

socket.on('orderupdated',(data)=>{
    const updatedOrder = {...order}
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    new Noty({
        type:'success',
        timeout:1000,
        text:'order updated',
        progressBar:false
   
    }).show()

    
})


