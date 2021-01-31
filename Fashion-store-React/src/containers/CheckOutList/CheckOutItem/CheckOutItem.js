import React from 'react';
import './CheckOutItem.css';

const CheckOutItem = (props) => {
    return(
        <div className="CheckOutItem">
            <img  src={props.imageUrl} alt="CheckOutItem-im"/>
            <h2>{props.name}</h2>
            <div className="CheckOutItem-buttonWrapper">
                <button onClick={props.onRemoveItemClicked}>&#60;</button>
                <p className="CheckOutItem-quantity">{props.quantity}</p>
                <button onClick={props.onAddItemClicked}>&#62;</button>
            </div>
            <p className="CheckOutItem-quantity">{props.quantity} x ${props.price}</p>
            <button className="CheckOutItem-removeItems" onClick={props.onRemoveItemsClicked}>X</button>
        </div>
    )
}

export default CheckOutItem;