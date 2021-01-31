import React from 'react';
import './MenuItemList.css';

import SECTIONS from '../../data/HomePageData/HomePageData';
import MenuItem from './MenuItem/MenuItem';

class MenuItemList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sections:SECTIONS,
        }
    }
    render() {
        return(
            <div className="homePage-menu-item-list">
                {this.state.sections.map((section) =>{
                    return <MenuItem key = {section.id} section = {section}/>
                })}
            </div>
        )
    }
}

export default MenuItemList;