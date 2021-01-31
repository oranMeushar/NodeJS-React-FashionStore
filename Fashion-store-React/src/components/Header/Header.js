import React from 'react';
import './Header.css';

import {NavLink, Link} from 'react-router-dom';
import {connect} from 'react-redux';

import ShopBag from '../../assets/ShopingBag/shopingBag.svg';
import Logo from '../../assets/Crown/crown.svg';
import Cart from '../Cart/Cart';
import * as actions from '../../store/actions/cart';

const Header = (props) =>{    
    const handleShopBagClicked = (e) =>{
        if(e.target.className.includes("header-shopBag-img")
        ||e.target.className.includes("header-quantity")){
            props.onShowCart();
        }
    }

    let shopBag = null;
    if (props.token) {
        shopBag = (
            <div 
                className="header-shopBag"
                onClick={handleShopBagClicked}>
                <img className = "header-shopBag-img"src={ShopBag} alt="shopBag"/>
                <p className = "header-quantity">{props.totalItems}</p>
                <Cart class = {props.showCart?'cart-active' : ''}/>
            </div>
        )
    }
    return(   
        <div className="header">    
            <div className="header-logo">
                <Link to = "/"><img src={Logo} alt="logo"/></Link>    
            </div>      
            <div className="header-links">
                <NavLink exact to="/shop">shop</NavLink>
                {props.token ?<NavLink exact to="/orders" >Orders</NavLink>:null}
                <NavLink exact to="/contact" >contact</NavLink>
                <NavLink exact to={props.token ? '/logout' :'/auth'} >{props.token ? 'logout' :'login'}</NavLink>
                {shopBag}
            </div>
            
        </div>
    )
}

const mapStateToProps = (state) =>{
    return{
        token:state.auth.token,
        totalItems:state.cart.totalItems,
        showCart:state.cart.showCart,
    }
}

const mapDispatchToProps = (dispatch) =>{
    return{
        onShowCart:()=>dispatch(actions.showCart())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
