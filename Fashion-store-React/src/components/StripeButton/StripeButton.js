import React from 'react';
import StripeCheckOut from 'react-stripe-checkout';


const StripeButton = (props) =>{
    const stripePrice = props.price * 100;
    const publishableKey =  `pk_test_51IDpSOH7F1Xev6tDKNhgo4qDrxt0dZsnQqnMhazsT2mecSczXmtyCOl5n47O0hCMetDqMB5eEhldI6VFwnmxvyBi00ydLsUoxf`;
                          
    return(
        <div className="StripeButton">
            <StripeCheckOut
                token = {props.clicked}
                stripeKey = {publishableKey}
                label = "Pay Now"
                image="https://svgshare.com/i/CUz.svg"
                name="OM fashion"
                shippingAddress
                billingAddress
                description = {`Total price of $${props.price}`}
                amount = {stripePrice}
                panelLabel = 'Pay Now'
                email="info@vidhub.co"
            />
        </div>
        
    )
}

export default StripeButton;