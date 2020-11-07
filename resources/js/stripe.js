
import {loadStripe} from '@stripe/stripe-js';
import {placeOrder} from './apiservice';
import {CardWidget} from './CardWidget'
export async function initStripe(){
    const stripe = await loadStripe('pk_test_51HkYPiCKt7r6tFn36hhIANUCw5DsPCzWasrIR6wEIcOxD1M3QNcPcL4SZgb1h3dJ0O7fbiicXWtnEVyvrjoMARKK00L9tcPRC1');
    let card =null
// function mountWidget(){
//     const elements =  stripe.elements()
  
//      card = elements.create('card',{style:{},hidePostalCode:true})
//     card.mount('#card-element')
// }


//ajax call
const paymentType = document.querySelector('#payment-type')
if(paymentType){
    paymentType.addEventListener('change',(e)=>{
        if(e.target.value=='card'){
         card =  new CardWidget(stripe)
        card.mount()
        
        
        }else{
            card.destroy()
        }
        })

}


const paymentForm = document.querySelector('#payment-form');
if(paymentForm){
  
    paymentForm.addEventListener('submit',async(e)=>{
        e.preventDefault();
        let formdata = new FormData(paymentForm);
         let formObject = {}
        
         for(let [key,value] of formdata.entries()){
             formObject[key]=value
         }
         if(!card){
            placeOrder(formObject)
       
             return
         }
   const token =  await card.createtoken()
   console.log(token)
   formObject.stripeToken = token.id;
    placeOrder(formObject)


        //verify card
        //  stripe.createToken(card).then((result)=>{
       
        //     formObject.stripeToken = result.token.id;
        //     console.log(result)
        //     placeOrder(formObject)
            
        // }).catch((err)=>{
        //    console.log(err)
        // })
         
        



        
        
        })
        
}





}
