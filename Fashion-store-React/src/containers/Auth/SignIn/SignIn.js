import React from 'react';

import {withRouter, Link} from 'react-router-dom';
import {connect} from 'react-redux';

import Button from '../../../components/Button/Button';
import Form from '../../../components/Form/Form';
import * as actions from '../../../store/actions/auth';
import {setLocalWithExpire} from '../../../util/LocalStorage/LocalStorage';

class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo:{
                email:'',
                password:'',
            },
            errorMessage:null
        }
    }

    handleChange = (e) =>{
        const userInfo = {...this.state.userInfo};
        userInfo[e.target.name] = e.target.value;
        this.setState({
            userInfo
        })    
    }

    handleSuccessResponse = (token) =>{
        this.props.onSuccess(token);
        setLocalWithExpire();
        this.props.history.push('/');
    }

    handleFailureResponse = (data) =>{
        if (data.error) {
            this.setState({
                errorMessage:data.message
            })
        }
    }

    handleSubmit = async(e) =>{
        e.preventDefault();
        
        const response = await fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials:'include',
            body: JSON.stringify(this.state.userInfo)
        });
        const data = await response.json();
        if (response.status === 200) {
            this.handleSuccessResponse(data.data.token);
        }
        else{
            this.handleFailureResponse(data);
        }    

    }

    render(){
        let errorMessage = null;
        if (this.state.errorMessage) {
            errorMessage = <p className="error-message">{this.state.errorMessage}</p>; 
        }
        return(
            <Form>
            <div className="form-container">
                <h1>I already have an account</h1>
                <p>Sign in with your email and password</p>
                
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
                    <label>
                        <input 
                        placeholder=" "
                        type="password" 
                        name = 'password' 
                        value={this.state.password}
                        onChange={this.handleChange}/>
                        <span>Password</span>
                    </label>  
                    <div className="buttons-wrapper">
                        <Button color="black" type="submit">Login</Button>
                    </div>   
                </form>
                {errorMessage}
                <Link to="/forgotPassword" className="forgot-password">forgot password?</Link>
            </div>   
            </Form>

        )
    }
}

const mapDispatchToProps = (dispatch) =>{
    return{
        onSuccess:(token)=>dispatch(actions.success(token))
    }
}

export default connect(null, mapDispatchToProps)(withRouter(SignIn));