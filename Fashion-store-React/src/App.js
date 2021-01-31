import './App.css';
import React, {Suspense}from 'react';
import {Switch, Route} from 'react-router-dom';
import {connect} from 'react-redux';

import Header from './components/Header/Header';
import {getLocalWithExpire} from './util/LocalStorage/LocalStorage';
import * as authActions from './store/actions/auth';
import * as cartActions from './store/actions/cart';

const MenuItemList = React.lazy(() =>import('./containers/MenuItemList/MenuItemList'));
const Shop = React.lazy(() =>import('./containers/Shop/Shop'));
const Auth = React.lazy(() =>import('./containers/Auth/Auth'));
const Logout = React.lazy(()=>import('./components/Logout/LogOut'));
const Checkout = React.lazy(() =>import('./containers/CheckOutList/CheckOutList'));
const CategoryPage = React.lazy(() =>import('./containers/CategoryPage/CategoryPage'));
const ForgotPassword = React.lazy(() =>import('./containers/ForgotPassword/ForgotPassword'));
const ResetPassword = React.lazy(() =>import('./containers/ResetPassword/ResetPassword'));
const Contact = React.lazy(() =>import('./containers/Contact/Contact'));
const Orders = React.lazy(() =>import('./containers/OrdersList/OrdersList'));
const OrderDeatails = React.lazy(() =>import('./containers/OrdersList/OrderDetails/OrderDetails'));

class App extends React.Component {
  async componentDidMount(){
    //check if user is authenticated
    const response = await fetch('http://localhost:5000/api/v1/auth/isAuth',{
      credentials:'include'
    });
    const data = await response.json();
    if (response.status === 200) {
      this.props.onAuthSuccess(data.token)
    }

    //*get cart from local localStorage
    const cart = getLocalWithExpire();
    if (cart) {
      this.props.setCart(cart);
    }
  }
  render(){
    return (
      <div className="App">
        <Header/>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route exact path="/" component={MenuItemList}/>
            <Route exact path="/shop" component={Shop}/>
            <Route exact path="/auth" component={Auth}/>
            <Route exact path="/contact" component={Contact}/>
            <Route exact path="/shop/:category" component={CategoryPage}/>
            <Route exact path="/forgotPassword" component={ForgotPassword}/>
            <Route exact path="/resetPassword/:resetToken" component={ResetPassword}/>
            {this.props.token?<Route exact path="/logout" component={Logout}/>:null}
            {this.props.token?<Route exact path="/checkout" component={Checkout}/>:null}
            {this.props.token?<Route exact path="/orders" component={Orders}/>:null}
            {this.props.token?<Route exact path="/orders/:orderId" component={OrderDeatails}/>:null}
          </Switch>
        </Suspense>
      </div>
        
    );
  }
  
}

const mapStateToProps = (state) =>{
  return{
    token:state.auth.token
  }
}

const mapDispatchToProps = (dispatch) =>{
  return{
    onAuthSuccess:(token)=>dispatch(authActions.success(token)),
    setCart:(cart) =>dispatch(cartActions.setCart(cart))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
