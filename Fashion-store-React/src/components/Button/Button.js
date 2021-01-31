import React from 'react';
import './Button.css';

const Button = (props) =>{
    return(
        <button className = {"Button " + props.color}
        type ={props.type}>{props.children}</button>
    )
}

export default Button;