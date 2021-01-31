import React from 'react';
import './ResetPassword.css';

import validator from 'validator';
import rfdc from 'rfdc';

import Button from '../../components/Button/Button';
import Form from '../../components/Form/Form';

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

class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo:{
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
            resetToken:null
        }
    }

    componentDidMount(){
        const resetToken = this.props.match.params.resetToken;
        this.setState({
            resetToken
        })
    }

    handleChange = (e) =>{
        const userInfo = rfdc()(this.state.userInfo);
        const value = validator.trim(e.target.value)
        userInfo[e.target.name].value = value;

        if (value.length !== 0) {
            switch (e.target.name) {
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

    handleSuccessResponse = () =>{
        this.props.history.push('/auth');
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
        const response = await fetch(`/api/v1/auth/resetPassword/${this.state.resetToken}`, {
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type': 'application/json'
            },
            credentials:'include',
            body:JSON.stringify(userInfo)
        });
        const data = await response.json();
        if (response.status === 200) {
           this.handleSuccessResponse();
        }
        else{
            this.handleFailureResponse(data);
        }    
    }

    render(){
        return(
            <div className="ResetPassword">
                <Form>
                <div className="form-container">
                    <h1>Enter your new password</h1>
                    <form className="form-container-form" autoComplete='off' onSubmit = {this.handleSubmit}>
                        <label>
                            <input 
                            placeholder=" "
                            type="password" 
                            name = 'password' 
                            value={this.state.userInfo.password.value}
                            onChange={this.handleChange}
                            className = {this.state.userInfo.password.colored}/>
                            <span>Password</span>
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
                            <Button color="black" type="submit">Change Password</Button>
                        </div>   
                    </form>
                </div>   
            </Form>
            </div>
            
        )
    }
}


export default ResetPassword;