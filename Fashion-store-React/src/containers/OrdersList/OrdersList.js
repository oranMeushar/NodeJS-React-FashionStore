import React from 'react';
import './OrdersList.css';

import rfdc from 'rfdc';
import Order from './Order/Order';
import Loader from '../../components/Loader/Loader';

class OrderList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orders:[],
            isLoading:false,
        }
    }

    async componentDidMount(){
        try{
            this.setState({
                isLoading:true
            });
            const response = await fetch('/api/v1/orders',{
                credentials:'include'
             });
             const data = await response.json();
             this.setState({
                 orders:data.data,
                 isLoading:false
             })
        }
        catch(e){
            this.setState({
                isLoading:false
            });
        }
        
    }

    handleRemoveButton = async(orderToDelete) =>{
        let orders = rfdc()(this.state.orders);
        const index = orders.findIndex((order) =>order._id === orderToDelete._id)
        orders.splice(index, 1);
            this.setState({
                orders
            });
        await fetch(`/api/v1/orders/${orderToDelete._id}`, {
            method:'DELETE',
            headers:{
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials:'include',
        });
    }

    render(){
        let loader = null;
        if (this.state.isLoading) {
            loader = (<Loader/>)
        }
        return(
            <div className="OrderList">
                
                <div className="OrderList-titles">
                    <h2>Order</h2>
                    <h2>Created At</h2>
                    <h2>Total Items</h2>
                    <h2>Price</h2>
                    <h2>Details</h2>
                </div>  
                {loader}
                {
                    this.state.orders.map((order) =>{
                        return(
                            <Order
                            key = {order._id}
                            removeOrder = {()=>this.handleRemoveButton(order)}
                            {...order}/>
                        )
                    })
                }
            </div>
        )
    }

}

export default OrderList;