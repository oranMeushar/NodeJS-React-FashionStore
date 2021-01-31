import React from 'react';
import './MenuItem.css';

import { withRouter } from 'react-router-dom';

const MenuItem = (props) =>{

    const hatsPage = (props) =>{
        return () => props.history.push(`/shop/${props.section.title}`)
    }

    return (
        <div 
            className={`homePage-menu-item item-${props.section.id}`}
            onClick={hatsPage(props)}>
            <img src={props.section.imageUrl} alt={`img-${props.section.id}`}/>
            <div className="title-wrapper">
                <h1>{props.section.title}</h1>
                <p>shop now</p>
            </div>
        </div>
    )
}




export default withRouter(MenuItem);