import React from 'react';
import './Cart.css';

import {Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import * as actions from '../../store/actions/cart';
import CartItem from './CartItem/CartItem';

class Cart extends React.Component {

    handleRemoveItem = (items) =>{
        this.props.onRemoveItems(items);
    }

    handleCheckOut = () =>{
        this.props.showCart();
    }

    render(){
        let cartItems = <p>Cart is empty</p>
        let checkOutLink = null;

        if (this.props.cart.length !== 0) {
            cartItems = this.props.cart.map((items) =>{
                return(
                    <CartItem 
                    key = {items._id}
                    {...items}
                    clicked = {()=>this.handleRemoveItem(items)}/>  
                )
            })    
        }
        if (this.props.location.pathname !== '/checkout' && this.props.cart.length !== 0) {
            checkOutLink = (
                <Link 
                    to="/checkout" 
                    className = "Cart-checkout"
                    onClick = {this.handleCheckOut}>Go to checkout
                </Link>
            )
        }
        return(
            <div className={`Cart ${this.props.class}`}>
                {cartItems}
                {checkOutLink}
            </div>
        )
    }
}

const mapStateToProps =(state) =>{
    return{
        cart:state.cart.cart,
    }
}

const mapDispatchToProps = (dispatch) =>{
    return{
        onRemoveItems:(items) => dispatch(actions.removeItems(items)),
        showCart:()=>dispatch(actions.showCart())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Cart));