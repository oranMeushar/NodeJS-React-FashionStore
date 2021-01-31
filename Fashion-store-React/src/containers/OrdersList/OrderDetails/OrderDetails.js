import React from 'react';
import './OrderDetails.css';

import OrderItem from './OrderItem/OrderItem';
import Loader from '../../../components/Loader/Loader';

class OrderDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order:{
                items:[],
                totalItems:0,
                totalPrice:0
            },
            error:{
                isError:false,
                errorMessage:''
            },
            isLoading:false
        }
    }

    async componentDidMount(){
        try{
            this.setState({
                isLoading:true
            });
            const orderId = this.props.match.params.orderId;
            const result = await fetch(`/api/v1/orders/${orderId}`,{
                credentials:'include'
            });
            const data = await result.json();
            if (result.status === 200) {
                this.setState({
                    order:data.data,
                    isLoading:false
                })
            }
            else{
                this.setState({
                    error:{isError:true, errorMessage:data.message},
                    isLoading:false
                });
            }
        }
        catch (e){
            this.setState({
                isLoading:false
            });
        }
    }

    render() { 
        let loader = null;
        let ordersDetails = null;

        if (this.state.isLoading) {
            loader = (<Loader/>)
        }   

        if (this.state.error.isError) {
            ordersDetails = (<h1 className="OrdersDetails-error-msg">{this.state.error.errorMessage}!!</h1>)
        }
        else{ 
            ordersDetails = (
                <div className="OrderDetails">
                    <div className="OrderDetails-titles">
                        <h2>Product</h2>
                        <h2>Description</h2>
                        <h2>Quantity</h2>
                        <h2>Price</h2>
                    </div>
                    {
                        this.state.order.items.map((item) =>{
                            return(
                                <OrderItem key = {item._id} {...item}/>
                            )
                        })
                    }
                    <h1 className="OrderDetails-totalPrice">TOTAL: ${this.state.order.totalPrice}</h1>
                </div>
            )
        }
        return (
            <>
            {ordersDetails}
            {loader}
            </>
        )
    }
    
}


export default OrderDetails;


    

    




