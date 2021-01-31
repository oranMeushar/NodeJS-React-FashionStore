import React from 'react';
import './CheckOutList.css';

import {connect} from 'react-redux';

import CheckOutItem from './CheckOutItem/CheckOutItem';
import * as cartActions from '../../store/actions/cart';
import StripeButton from '../../components/StripeButton/StripeButton';

class CheckOut extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showInfo: false,
            isOrderFailed:false
        }
    }

    handleAddItem = (item) => {
        this.props.addItem(item);
    }

    handleRemoveItem = (item) => {
        this.props.removeItem(item);
    }

    handleRemoveItems = (items) => {    
        this.props.removeItems(items);
    }

    handleInfoButton = () =>{
        this.setState((prevState, props) =>{
            return {showInfo:!prevState.showInfo}
        })
    }

    handleSuccessResponse = () =>{
        this.props.resetCart();

        //*Reset local storage
        const cart = JSON.parse(localStorage.getItem('cart'));
        cart.userCart = {
            cart:[],
            totalItems:0,
            totalPrice:0,
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        this.props.history.push('/orders');
    }

    handleStripeButton = async(token) =>{
        const response = await fetch(`/api/v1/orders`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials:'include',
            body:JSON.stringify({
                items:this.props.cart,
                totalItems:this.props.totalItems,
                totalPrice:this.props.totalPrice
            })    
        });
        if (response.status === 200) {
            this.handleSuccessResponse();
        } 
    }


    render() {
        let showInfoClass = ["CheckOutList-info"];
        if (this.state.showInfo) {
            showInfoClass.push("active");
        }
        
        return (
            <div className="CheckOutList">
                <div className="CheckOutList-titles">
                    <h2>Product</h2>
                    <h2>Description</h2>
                    <h2>Quantity</h2>
                    <h2>Price</h2>
                    <h2>Remove</h2>
                </div>
                {
                    this.props.cart.map((item) =>{
                        return(
                            <CheckOutItem
                            key = {item._id}
                            onAddItemClicked = {()=>this.handleAddItem(item)}
                            onRemoveItemClicked = {()=>this.handleRemoveItem(item)}
                            onRemoveItemsClicked = {()=>this.handleRemoveItems(item)}
                            {...item}/>
                        )
                    })
                }
                <div className="CheckOutList-footer">
                    <h1 className="CheckOutList-totalPrice">TOTAL: ${this.props.totalPrice}</h1>
                    <div className="CheckOutList-footer-buttons">
                        <StripeButton 
                            price = {this.props.totalPrice}
                            clicked = {this.handleStripeButton}
                        />
                        <button onClick={this.handleInfoButton}>&#33;</button>
                        <p className={showInfoClass.join(' ')}>Test credit card:<br/>
                                Credit Number: 4242 4242 4242 4242<br/>
                                Exp: 01/22<br/>
                                CVC:123
                        </p>
                    </div>
                </div>
                
            </div>
        )
    }
}

const mapStateToProps = (state) =>{
    return{
        cart:state.cart.cart,
        totalPrice:state.cart.totalPrice,
        totalItems:state.cart.totalItems
    }
}

const mapDispatchToProps = (dispatch) =>{
    return{
        removeItems:(items) => dispatch(cartActions.removeItems(items)),
        removeItem:(item)=>dispatch(cartActions.removeItem(item)),
        addItem:(item)=>dispatch(cartActions.addItem(item)),
        resetCart:()=>dispatch(cartActions.resetCart())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckOut);