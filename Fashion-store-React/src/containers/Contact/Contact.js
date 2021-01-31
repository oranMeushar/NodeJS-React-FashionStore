import React from 'react';
import './Contact.css';

class Contact extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo:{
                fullName:'',
                email:'',
                message:''
            },
            responseMessage:{
                displayed:false,
                message:'',
                color:''
            }    
        }
    }

    handleChange = (e) =>{
        const userInfo = {...this.state.userInfo};
        userInfo[e.target.name] = e.target.value;
        this.setState({userInfo});
    }

    handleResponse = (data, messageColor) =>{
        this.setState({
            responseMessage:{
                displayed:true,
                message:data.message,
                color:messageColor
            }
        })
    }

    handleSubmit = async (e) =>{
        e.preventDefault();
        const response = await fetch(`/api/v1/shop/contact`, {
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(this.state.userInfo)
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
            <div className="Contact">
                <form className="Contact-form" onSubmit={this.handleSubmit} autoComplete="off">
                    <div className="Contact-header">
                        <h1>Contact Us</h1>
                        <p>Please fill this form in a decent manner</p>
                    </div>
                    <div className="Contact-main">
                        <label htmlFor="Contact-fullName">Full Name <strong>*</strong></label>
                        <input 
                            type="text"
                            onChange={this.handleChange}
                            value={this.state.userInfo.fullName}
                            name="fullName"
                            id="Contact-fullName"
                        />
                        <label htmlFor="Contact-email">Email <strong>*</strong></label>
                        <input 
                            type="email"
                            onChange={this.handleChange}
                            value={this.state.userInfo.email}
                            name="email"
                            id="Contact-email"
                        />
                        <label htmlFor="Contact-message">Message <strong>*</strong></label>
                        <textarea 
                            id="Contact-message"
                            name="message"
                            value={this.state.userInfo.message}
                            onChange={this.handleChange}>
                        </textarea>
                        <button type="submit">Submit</button>
                    </div> 
                </form>
                {this.state.responseMessage.displayed ?
                    <p className={'Contact-responseMessage-' + this.state.responseMessage.color}>
                    {this.state.responseMessage.message}</p>:null
                }
            </div>
        )
    }
}

export default Contact;