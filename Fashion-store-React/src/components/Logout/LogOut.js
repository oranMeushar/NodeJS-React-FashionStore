import React from 'react';

import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

import * as authActions from '../../store/actions/auth';
import * as cartActions from '../../store/actions/cart';

class Logout extends React.Component {

    async componentDidMount(){
        //*Delete localStorage
        localStorage.removeItem('cart');

        //*Delete cookie
        await fetch('/api/v1/auth/logout',{
            method:'GET',
            credentials:'include',
            
        });
        this.props.onLogout();
        this.props.resetCart();
    }

    render(){
        return(
            <Redirect to='/'/>
        )
    }
}

const mapDispatchToProps = (dispatch) =>{
    return{
        onLogout:()=>dispatch(authActions.logout()),
        resetCart:()=>dispatch(cartActions.resetCart())
    }
}

export default connect(null, mapDispatchToProps)(Logout);
