import React from 'react';
import './Order.css';

import{Link} from 'react-router-dom';

const Order = (props) => {
    return(
        <div className="Order">
            <h2>{props._id.slice(16, props._id.length)}</h2>
            <h2>{props.createdAt}</h2>
            <h2>{props.totalItems}</h2>
            <h2>${props.totalPrice}</h2>
            <Link className="Order-link-details" to={`/orders/${props._id}`}>View</Link>
            <button onClick={props.removeOrder}>X</button>
        </div>
    )
}

export default Order;