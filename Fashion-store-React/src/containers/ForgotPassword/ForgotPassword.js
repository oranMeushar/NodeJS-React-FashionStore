import React from 'react';
import './ForgotPassword.css';

import Form from '../../components/Form/Form';
import Button from '../../components/Button/Button';

class ForgotPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email:'',
            message:{
                displayed:false,
                data:'',
                color:''
            }
        }
    }

    handleChange = (e) =>{
        this.setState({
            [e.target.name]:e.target.value
        })    
    }

    handleResponse = (data, messageColor) =>{
        this.setState({
            message:{
                displayed:true,
                data:data.message,
                color:messageColor
            }
        })
    }

    handleSubmit = async(e) =>{
        e.preventDefault();
        const response = await fetch('/api/v1/auth/forgotPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                email:this.state.email
            })
        });
        const data = await response.json();
        if (response.status === 200) {
            this.handleResponse(data, 'green');
        }
        else{
           this.handleResponse(data, 'red');
        }    

    }

    render(){
        return(
            <div className="ForgotPassword">
                <Form>
                    <div className="form-container">
                        <h1>Type your email for password reset</h1>                
                        <form className="form-container-form" autoComplete='off' onSubmit={this.handleSubmit}>
                            <label>
                                <input 
                                    placeholder=" "
                                    type="text" 
                                    name = 'email' 
                                    value={this.state.email} 
                                    onChange={this.handleChange}/>
                                <span>Email</span>
                            </label>
                            <div className="buttons-wrapper">
                                <Button color="black" type="submit">Reset Password</Button>
                            </div>   
                        </form>
                        {this.state.message.displayed ?
                            <p className={'form-container-msg-' + this.state.message.color}>
                            {this.state.message.data}</p>:null
                        }
                    </div>  
                </Form>
            </div>
        )
    }
}

export default ForgotPassword;