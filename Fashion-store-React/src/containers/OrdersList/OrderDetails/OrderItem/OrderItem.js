import React from 'react';
import './OrderItem.css';

const OrderItem = (props) => {
    return(
        <div className="OrderItem">
            <img  src={props.imageUrl} alt="OrderItem-im"/>
            <h2>{props.name}</h2>
            <p className="OrderItem-quantity">{props.quantity}</p>
            <p className="OrderItem-quantity">{props.quantity} x ${props.price}</p>
        </div>
    )
}

export default OrderItem;