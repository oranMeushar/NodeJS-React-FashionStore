import React from 'react';
import './ShopItem.css';

import {connect} from 'react-redux';

const ShopItem = (props) =>{
    return(
        <div className="shop-item">
            <div className="image-wrapper">
                <img src={props.imageUrl} alt=""/>
                {props.token?
                    <button onClick={props.clicked}>add to cart</button>:
                    null
                }
            </div>
            {
            <div className="shop-item-footer">
                <h2>{props.name}</h2>
                <h2>${props.price}</h2>
            </div>  
            } 
        </div>
    )
}

const mapStateToProps = (state) =>{
    return{
        token:state.auth.token
    }
}

export default connect(mapStateToProps)(ShopItem);