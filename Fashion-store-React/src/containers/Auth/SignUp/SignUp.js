import React from 'react';

import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import validator from 'validator';
import rfdc from 'rfdc';

import Button from '../../../components/Button/Button';
import Form from '../../../components/Form/Form';
import * as actions from '../../../store/actions/auth';
import {setLocalWithExpire} from '../../../util/LocalStorage/LocalStorage';

const validateInputLength = (userInfo, value, name)  =>{
    if (value.length >= userInfo[name].minLength
        && value.length <= userInfo[name].maxLength) {
        userInfo[name].colored = 'green';
    }
    else{
        userInfo[name].colored = 'red';
    }
    return userInfo;
}

const validateEmail = (userInfo, value)  =>{
    if (validator.isEmail(value)) {
        userInfo.email.colored = 'green';
    }
    else{
        userInfo.email.colored = 'red';
    }
    return userInfo;    
}

class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo:{
                name:{
                    value:'',
                    minLength:2,
                    maxLength:30,
                    colored:''
                },
                email:{
                    value:'',
                    colored:'' 
                },
                password:{
                    value:'',
                    minLength:6,
                    maxLength:30,
                    colored:''
                },
                passwordConfirm:{
                    value:'',
                    minLength:6,
                    maxLength:30,
                    colored:''
                }
            },
            signupSuccess:true, 
            errorMessage:null   
        }
    }

    handleChange = (e) =>{
        const userInfo = rfdc()(this.state.userInfo);
        const value = validator.trim(e.target.value)
        userInfo[e.target.name].value = value;

        if (value.length !== 0) {
            switch (e.target.name) {
                case 'name':
                    this.setState({
                        userInfo:validateInputLength(userInfo, value, 'name')
                    })    
                    return;
                 case 'email':
                    this.setState({
                        userInfo:validateEmail(userInfo, value)
                    }) 
                    return;
                case 'password':
                    this.setState({
                        userInfo:validateInputLength(userInfo, value, 'password')
                    }) 
                    return;
                case 'passwordConfirm':
                    this.setState({
                        userInfo:validateInputLength(userInfo, value, 'passwordConfirm')
                    }) 
                    return;
                default:
                    return;
            }
        }
        userInfo[e.target.name].colored = 'white';
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
        const userInfo = rfdc()(this.state.userInfo);
        if (data.error.errors) {
            const keys = Object.keys(data.error.errors);
            keys.forEach(key => {
                userInfo[key].value = '';
                userInfo[key].colored = 'white'; 
            });
        }
        if (data.error.code === 11000) {
            userInfo.email.value = 'Email already exists';
            userInfo.email.colored = 'red';
        }
        this.setState({
            userInfo
        })  
    }

    handleSubmit = async (e) =>{
        e.preventDefault();
        let userInfo = {};
        for (const key in this.state.userInfo) {
            userInfo[key] = this.state.userInfo[key].value;
        }
        const response = await fetch('/api/v1/auth/signup', {
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type': 'application/json'
            },
            credentials:'include',
            body:JSON.stringify(userInfo)
        });
        const data = await response.json();
        if (response.status === 201) {
           this.handleSuccessResponse(data.data.token);
        }
        else{
            this.handleFailureResponse(data);
        }    
    }

    render(){
        return(
            <Form>
                <div className="form-container">
                    <h1>I do not have an account</h1>
                    <p>Sign in with your email and password</p>
                    <form className="form-container-form" autoComplete='off' onSubmit = {this.handleSubmit}>
                        <label>
                            <input 
                                placeholder=" "
                                type="text" 
                                name = 'name' 
                                value={this.state.userInfo.name.value} 
                                onChange={this.handleChange}
                                className = {this.state.userInfo.name.colored}/>
                            <span>Name</span>
                        </label>
                        <label>
                            <input 
                                placeholder=" "
                                type="text" 
                                name = 'email' 
                                value={this.state.userInfo.email.value} 
                                onChange={this.handleChange}
                                className = {this.state.userInfo.email.colored}/>
                            <span>Email</span>
                        </label>
                        <label>
                            <input 
                            placeholder=" "
                            type="password" 
                            name = 'password' 
                            value={this.state.userInfo.password.value}
                            onChange={this.handleChange}
                            className = {this.state.userInfo.password.colored}/>
                            <span>Password</span>
                            <span className="form-password-min-length">*min 6 length</span>
                        </label>
                        <label>
                            <input 
                            placeholder=" "
                            type="password" 
                            name = 'passwordConfirm' 
                            value={this.state.userInfo.passwordConfirm.value}
                            onChange={this.handleChange}
                            className = {this.state.userInfo.passwordConfirm.colored}/>
                            <span>Confirm Password</span>
                        </label>    
                        <div className="buttons-wrapper">
                            <Button color="black" type="submit">sign up</Button>
                        </div>   
                    </form>
                </div>   
            </Form>
        )
    }
}

const mapDispatchToProps =(dispatch) =>{
    return{
        onSuccess:(token)=>dispatch(actions.success(token))
    }
}
export default connect(null, mapDispatchToProps)(withRouter(SignUp));