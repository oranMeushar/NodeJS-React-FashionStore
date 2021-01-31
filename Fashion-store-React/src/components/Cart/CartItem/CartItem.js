import React from 'react';
import './CartItem.css';


const CartItem = (props) =>{
    return(
        <div className="CartItem">
            <div className="CartItem-img-wrapper">
                <img src={props.imageUrl} alt="CartItem-im"/>
            </div>
            <div className="CartItem-info">
                <h3>{props.name}</h3>
                <h4>{props.quantity} x ${props.price}</h4>
            </div>
            <button 
                className="CartItem-remove"
                onClick={props.clicked}>X
            </button>
        </div>
    )
}


export default CartItem;